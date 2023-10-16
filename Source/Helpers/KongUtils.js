/* eslint-disable no-undef */
const Config = require('../App/Config');
const {isEmpty, networkCall} = require('./Utils');
const jwt = require('jsonwebtoken');

const KongUtils = {
	/**
	 * Create kong consumer
	 * @param data
	 * @returns {Promise<{error: boolean, message: string}>}
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

			let {error, body} = await networkCall(postData);
			if (!isEmpty(error) || isEmpty(body)) {
				return {error: true, message: 'user not created.'};
			} else {
				let userId = data?.id;
				await KongUtils.generateAuthToken(userId);
			}
			return {error: false, message: 'Kong User created Successfully'};
		} catch (error) {
			return {error: true, message: 'Error occurred' + error?.message};
		}
	},

	/**
	 * Add acl group name to kong consumers
	 * @param user
	 */
	addUserInGroup: async (user) => {
		for (let primaryRoutes of whitelist) {
			let postData = {
				url: Config.KONG_URL + user?.id + '/acls',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				method: 'POST',
				form: {
					group: primaryRoutes
				}
			};

			let {error, body} = await networkCall(postData);
			if (!isEmpty(error) || isEmpty(body)) {
				return {error: true, message: 'Acl group not created.'};
			}
		}
	},

	/**
	 * To generate Authorization Token from Kong
	 * @param user
	 * @returns {Promise<*>}
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

			let {error, body} = await networkCall(postData);
			if (!isEmpty(error) || isEmpty(body)) {
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
	 * get user based group access list
	 * @param user
	 * @returns {Promise<{error: boolean, message: string}|{aclGroups, error: boolean, message: string}>}
	 */
	getUserGroup: async (user) => {
		let bodyData;
		let postData = {
			url: Config.KONG_URL + user?.id + '/acls',
			method: 'GET'
		};

		let {error, body} = await networkCall(postData);
		if (!isEmpty(error) || isEmpty(body)) {
			return {error: true, message: 'group not created.'};
		} else {
			bodyData = JSON.parse(body);
			if (isEmpty(bodyData)) return {error: true, message: 'Acl not created'};
			return {error: false, message: 'Acl is created', aclGroups: bodyData};
		}
	}
};
module.exports = KongUtils;
