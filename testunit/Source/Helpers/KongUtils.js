/* eslint-disable jsdoc/require-returns-check */
const Config = require('../App/Config');
const {isEmpty, networkCall} = require('./Utils');
const jwt = require('jsonwebtoken');
const RouteListForValidation = require('./RouterListForValidation');

const KongUtils = {
	/**
	 * To validate Routes
	 // eslint-disable-next-line jsdoc/check-param-names
	 * @param whitelisted_routes
	 * @returns {{error: string}}
	 */
	validateRoutes: (whitelisted_routes) => {
		let RouteListData = Object.values(RouteListForValidation);
		for (let primaryRoutes of whitelisted_routes) {
			let secondaryRoutes = RouteListData.find((object) => object.group === primaryRoutes);
			if (!secondaryRoutes && secondaryRoutes?.group !== primaryRoutes) {
				return {error: 'Please Enter Valid Route.'};
			}
		}
	},

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
				await KongUtils.addUserInGroup(data);
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
		let whitelist = user?.whitelisted_routes;

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

			// eslint-disable-next-line no-await-in-loop
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
	},

	/**
	 * Delete Acl groups
	 * @param data
	 * @returns {Promise<{error: boolean, message: string}|boolean>}
	 */
	deleteAclGroups: async (data) => {
		let index = 1;
		if (data?.groupDetails.length > 0) {
			for await (let groupDetail of data.groupDetails) {
				try {
					let postData = {
						url: Config.KONG_URL + 'admin_' + data?.admin_id + '/acls/' + groupDetail.id,
						method: 'DELETE'
					};

					await networkCall(postData);
					if (data?.groupDetails.length === index && data?.whitelisted_routes.length > 0) {
						KongUtils.addUserInGroup({
							id: 'admin_' + data?.admin_id,
							whitelisted_routes: data?.whitelisted_routes
						});
					}
				} catch (error) {
					return {error: true, message: 'While deleting cought error' || error};
				}
				index++;
			}
		} else {
			if (data.whitelisted_routes.length > 0) {
				await KongUtils.addUserInGroup({
					id: 'admin_' + data?.admin_id,
					whitelisted_routes: data?.whitelisted_routes
				});
			}
		}
		return false;
	},
	requestTermination: async (agentId, role = '') => {
		try {
			role = isEmpty(role) ? 'agent_' : 'admin_';
			let postData = {
				url: Config.KONG_URL + role + agentId + '/plugins',
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: {
					name: 'request-termination',
					config: {
						status_code: 503
					}
				}
			};
			let response = await networkCall(postData);
			if (response) {
				let data = await response?.body;
				data = JSON.parse(data);
				if (!data.id) {
					return {error: true, message: data?.message};
				}
				return {error: false, message: 'Terminated in kong successfully!', data: data.id};
			}
		} catch (error) {
			return {error: true, message: error?.message || error};
		}
		return false;
	},
	activateTermination: async (agentId, id, role = '') => {
		try {
			role = isEmpty(role) ? 'agent_' : 'admin_';
			let postData = {
				url: Config.KONG_URL + role + agentId + '/plugins',
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				},
				body: {
					name: 'request-termination',
					config: {
						status_code: 503
					}
				}
			};
			let response = await networkCall(postData);
			if (response) {
				try {
					let postData = {
						url: Config.KONG_URL + role + agentId + '/plugins/' + id, // added null/undefined checks
						method: 'DELETE'
					};
					let data = await networkCall(postData);
					if (data) {
						return {error: false, message: 'Kong activation successfully!'};
					}
				} catch (error) {
					return {error: true, message: error.message || 'While deleting caught error'};
				}
			}
		} catch (error) {
			return {error: true, message: error.message || 'While deleting caught error'};
		}
		return false;
	},
	deleteUser: async (agentId) => {
		try {
			let postData = {
				url: Config.KONG_URL + 'consumers/agent_' + agentId,
				method: 'DELETE'
			};
			let data = await networkCall(postData);
			if (data) {
				return {error: false, message: 'User Deleted in Kong successfully!'};
			}
		} catch (error) {
			return {error: true, message: error.message || 'While deleting caught error'};
		}
		return false;
	}
};
module.exports = KongUtils;
