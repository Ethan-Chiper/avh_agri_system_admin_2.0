/* eslint-disable no-unused-vars */
const {customAlphabet} = require('nanoid');
const Request = require('request');
const Config = require('../App/Config');
const jwt = require('jsonwebtoken');
const moment = require('moment');

const utils = {
	/***
	 *generate uniqu nanoID
	 */
	getNanoId: () => {
		let alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890';
		let randomId = customAlphabet(alphabet, 8);
		return randomId();
	},
	/***
	 *generate consumer
	 */
	createUserAndTokenInKong: async (data) => {
		try {
			let postData = {
				url: Config.KONG_URL,
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				method: 'POST',
				form: {
					username: data?.id
				}
			};

			let {error, body} = await utils.networkCall(postData);
			if (!utils.isEmpty(error) || utils.isEmpty(body)) {
				return {error: true, message: 'user not created.'};
			} else {
				let userId = data?.id;
				await utils.generateAuthToken(userId);
			}
			return {error: false, message: 'Kong User created Successfully'};
		} catch (error) {
			return {error: true, message: 'Error occurred' + error?.message};
		}
	},
	/***
	 * generate_auth_token
	 * @param user
	 */
	generateAuthToken: async (user) => {
		try {
			let token;
			let postData = {
				url: Config.KONG_URL + user + '/jwt',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				method: 'POST'
			};

			let {error, body} = await utils.networkCall(postData);
			if (!utils.isEmpty(error) || utils.isEmpty(body)) {
				return {error: true, token: 'Token not generated.'};
			} else {
				body = JSON.parse(body);
				token = jwt.sign(
					{
						iss: body?.key.toString(),
						exp: 86_400 //One-Day
					},
					body?.secret.toString()
				);
				return {error: false, token};
			}
		} catch (error) {
			return error;
		}
	},
	/**
	 * Function for checking whether the data is empty
	 * @param data
	 * @returns {boolean}
	 */
	isEmpty: (data) => {
		if (data === null || data === undefined) {
			return true;
		}
		if (typeof data === 'string' && data.replaceAll(' ', '').length > 0) {
			return false;
		}
		if (typeof data === 'number') {
			return false;
		}
		if (typeof data === 'boolean') {
			return false;
		}
		if (Array.isArray(data) && data.length > 0) {
			return false;
		}
		return !(typeof data === 'object' && Object.keys(data).length > 0);
	},
	/**
	 * Network Call function
	 * @param options
	 * @returns {Promise<{response: *, error: *, body: *}|{error: string}|{response: undefined, error, body: undefined}|{response: undefined, error: string, body: undefined}>}
	 */
	networkCall: async (options) => {
		try {
			let postData = {};

			if (utils.isEmpty(options?.url)) {
				return {
					error: 'please provide a url',
					message: undefined
				};
			}
			postData['url'] = options?.url;
			postData['timeout'] = options?.timeout || 60_000;

			// headers prepare for http request
			if (utils.isEmpty(options?.headers)) {
				postData['headers'] = {
					'Content-Type': 'application/json'
				};
			} else {
				let headers = {'Content-Type': 'application/json'};
				for (let key in options?.headers) {
					headers[key] = options?.headers[key];
				}
				postData['headers'] = headers;
			}

			postData['method'] = options?.method || 'GET';

			if (!utils.isEmpty(options?.body)) {
				try {
					postData['body'] = JSON.stringify(options?.body);
				} catch (error) {
					return {error: error};
				}
			}
			let errorData;
			let bodyData;
			await new Promise((resolve) => {
				Request(postData, (error, response, body) => {
					resolve(error, response, body);
					errorData = error;
					bodyData = body;
				});
			});
			return {error: errorData, body: bodyData};
		} catch (error) {
			return {error: error, message: 'Something went wrong'};
		}
	}
};

module.exports = utils;
