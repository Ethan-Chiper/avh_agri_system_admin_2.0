const {isEmpty, getShortId, createHashPwd, dateFinder, networkCall} = require('../Helpers/Utils');
const {findOneAdmin, createAdmin} = require('../Repository/AdminRepository');
const {requestTermination, activateTermination} = require('../Helpers/KongUtils');
const {validateRoutes, createUserAndTokenInKong, getUserGroup, deleteAclGroups} = require('../Helpers/KongUtils');
const RouteList = require('../Helpers/RouterList');
const CONFIG = require('../App/Config');
const {app_error, app_warning} = require('../Helpers/Logger');

const AdminController = {
	/**
	 * to fetch admin details
	 * @param requestData
	 * @param adminId
	 * @returns {Promise<{error: boolean, message: string}|{error: boolean, message: string}|{data: *, error: boolean, message: string}>}
	 */
	getDetails: async (requestData, adminId) => {
		try {
			let admin_Id = adminId || requestData?.loggedUser?.id;
			let queryOptions = {
				condition: {admin_id: admin_Id, status: 'active'},
				projection: {
					email: 1,
					role: 1,
					admin_id: 1,
					status: 1,
					createdAt: 1,
					acc_type: 1,
					'phone.national_number': 1,
					'name.full': 1,
					whitelisted_routes: 1
				}
			};
			let admin = await findOneAdmin(queryOptions);

			if (isEmpty(admin)) {
				app_warning(
					'Invalid Credentials!',
					{admin_id: admin_Id, status: 'active'},
					requestData?.loggedUser,
					'Admin Details'
				);
				return {error: true, message: 'Invalid Credentials!'};
			}

			return {error: false, message: 'Admin Details:', data: admin};
		} catch (error) {
			app_error(error, {}, 'Admin Details', requestData?.loggedUser);
			return {error: true, message: 'Something went Wrong!'};
		}
	},

	list: async (loggedUser, queryData) => {
		try {
			let limit = 20;
			let page = 1;
			let query = {};

			if (queryData?.limit)
				limit = queryData?.limit === 'all' ? queryData?.limit : Number.parseInt(queryData?.limit);
			if (queryData?.page) page = Number.parseInt(queryData?.page);
			if (queryData?.from_time || queryData?.to_time || queryData?.date_option)
				query['createdAt'] = dateFinder(queryData);
			if (queryData?.phone) query['phone.national_number'] = queryData?.phone;
			if (queryData?.email) query['email'] = queryData?.email;
			if (queryData?.admin_id) query['admin_id'] = queryData?.admin_id;
			if (queryData?.status) query['status'] = queryData?.status;
			if (queryData?.name) query['name.full'] = queryData?.name;
			let options = {lean: true};
			if (queryData?.limit !== 'all') {
				options = {limit: limit, skip: limit * (page - 1) || 0, sort: {_id: -1}, lean: true};
			}
			let queryOptions = {
				method: 'find',
				condition: query,
				projection: {
					createdAt: 1,
					email: 1,
					role: 1,
					admin_id: 1,
					status: 1,
					acc_type: 1,
					is_verified: 1,
					'phone.national_number': 1,
					'name.full': 1
				},
				options: options
			};
			let admins = await findOneAdmin(queryOptions);

			if (isEmpty(admins)) {
				return {error: false, message: 'Sub Admins List', data: {Sub_Admins: [], total: 0}};
			}
			return {error: false, message: 'Sub Admins List', data: {Sub_Admins: admins, total: admins.length}};
		} catch (error) {
			app_error(error, {}, 'Sub Admin List', loggedUser);
			return {error: true, message: 'Something went wrong! Please try again.'};
		}
	},

	/**
	 * To create Admin
	 * @param data
	 * @returns {Promise<{error: boolean, message: string}|{data: {admin: *}, error: boolean, message: string}|{error: boolean, message: *}>}
	 */
	createAdmin: async (data) => {
		try {
			let isValidRoute = validateRoutes(data?.whitelisted_routes);

			if (!isEmpty(isValidRoute)) {
				app_warning(
					isValidRoute?.error,
					{whitelisted_routes: data?.whitelisted_routes},
					data?.loggedUser,
					'Create Sub Admin'
				);
				return {error: true, message: isValidRoute?.error};
			}

			let exAdminEmail = await findOneAdmin({
				condition: {email: data?.email}
			});

			if (!isEmpty(exAdminEmail)) {
				app_warning('Email already exists!', {email: data?.email}, data?.loggedUser, 'Create Sub Admin');
				return {error: true, message: 'Email already exists!'};
			}

			let exAdminPhone = await findOneAdmin({
				condition: {'phone.national_number': data?.phone_number}
			});

			if (!isEmpty(exAdminPhone)) {
				app_warning(
					'Phone number already exists!',
					{'phone.national_number': data?.phone_number},
					data?.loggedUser,
					'Create Sub Admin'
				);
				return {error: true, message: 'Phone number already exists!'};
			}
			let password = createHashPwd(data?.password);
			let adminCreationData = {
				admin_id: getShortId(),
				email: data?.email,
				password: password,
				name: {
					full: data?.name
				},
				phone: {
					national_number: data?.phone_number
				}
			};
			let admin = await createAdmin({document: adminCreationData, options: {lean: false}});

			if (!isEmpty(admin)) {
				let createKongUser = await createUserAndTokenInKong({
					id: 'admin_' + admin?.admin_id,
					whitelisted_routes: data?.whitelisted_routes
				});

				if (createKongUser?.error) {
					app_warning(
						'Please provide valid data',
						{
							id: 'admin_' + admin?.admin_id,
							whitelisted_routes: data?.whitelisted_routes
						},
						data?.loggedUser,
						'Create Sub Admin'
					);
					return {error: true, message: 'Please provide valid data'};
				} else {
					admin.whitelisted_routes = data?.whitelisted_routes;
					admin.markModified('whitelisted_routes');
					admin.save();
					return {
						error: false,
						message: 'Admin created',
						data: {
							admin: admin
						}
					};
				}
			}
		} catch (error) {
			app_error(error, {}, 'Create Sub Admin', data?.loggedUser);
			return {error: true, message: 'Something went wrong!'};
		}
	},
	/**
	 * CSRF TOKEN Generation
	 * @param token
	 * @returns {{data: {csrfToken: *}, message: string, error: boolean}}
	 */
	getCsrfToken: (token) => {
		return {error: false, message: 'Csrf token sent!', data: {csrfToken: token}};
	},
	/**
	 * Route list for acl
	 * @param request
	 * @returns {{data: {csrfToken: *}, message: string, error: boolean}}
	 */
	routesList: async (request) => {
		let userId = request?.params?.adminId;
		let admin = await findOneAdmin({
			condition: {admin_id: userId},
			projection: {
				admin_id: 1,
				whitelisted_routes: 1,
				createdAt: 1
			}
		});
		if (isEmpty(admin)) {
			for (let mainRoute in RouteList) {
				let mainRouteObject = RouteList[mainRoute];
				mainRouteObject.is_enabled = false;
				for (let routeKey in mainRouteObject?.route_list) {
					let route = mainRouteObject?.route_list[routeKey];
					route.is_enabled = false;
				}
			}
			return {error: false, message: 'Route list for acl', data: RouteList};
		} else {
			for (let mainRoute in RouteList) {
				let mainRouteObject = RouteList[mainRoute];
				if (admin?.whitelisted_routes.includes(mainRouteObject.group)) {
					mainRouteObject.is_enabled = true;
				}
				for (let routeKey in mainRouteObject.route_list) {
					let route = mainRouteObject?.route_list[routeKey];
					if (admin?.whitelisted_routes.includes(route.group)) {
						route.is_enabled = true;
					}
				}
			}
			return {error: false, message: 'Route list for acl', data: RouteList};
		}
	},
	/**
	 * Modify
	 * @param data
	 * @returns {Promise<{error: boolean, message: string}|{error: boolean, message: *}>}
	 */
	modifyGroupNames: async (data) => {
		try {
			let isValidRoute = validateRoutes(data?.whitelisted_routes);

			if (!isEmpty(isValidRoute)) {
				app_warning(
					'' + isValidRoute?.error,
					{whitelisted_routes: data?.whitelisted_routes},
					data?.loggedUser,
					'Modify ACL Group Names'
				);
				return {error: true, message: isValidRoute?.error};
			}

			let queryOptions = {
				condition: {admin_id: data?.admin_id},
				projection: {
					whitelisted_routes: 1,
					createdAt: 1,
					admin_id: 1
				},
				options: {lean: false}
			};
			let adminData = await findOneAdmin(queryOptions);

			if (isEmpty(adminData)) {
				app_warning(
					'Unable to find admin data',
					{admin_id: data?.admin_id},
					data?.loggedUser,
					'Modify ACL Group Names'
				);
				return {error: false, message: 'Unable to find admin data'};
			} else {
				adminData.whitelisted_routes = data?.whitelisted_routes || [];
				adminData.markModified('whitelisted_routes');

				let {error, message, aclGroups} = await getUserGroup({
					id: 'admin_' + adminData?.admin_id,
					whitelisted_routes: data?.whitelisted_routes
				});

				if (error && message) {
					app_warning(
						'While getting acl caught error!',
						{
							id: 'admin_' + adminData?.admin_id,
							whitelisted_routes: data?.whitelisted_routes
						},
						data?.loggedUser,
						'Modify ACL Group Names'
					);
					return {error: true, message: 'While getting acl caught error!'};
				}
				let groupDetails = await aclGroups?.data;
				let aclError = await deleteAclGroups({...data, groupDetails});
				if (!aclError) adminData?.save();
				return {error: false, message: 'Modified successfully'};
			}
		} catch (error) {
			app_error(error, {}, 'Modify ACL Group', data?.loggedUser);
			return {error: true, message: 'Something went wrong', data: error};
		}
	},

	/**
	 * To call presigned api
	 * @param requestData
	 * @returns {Promise<{data: *, error: boolean, message: *}|{error: boolean, message: string}|{error: boolean, message: (*|string)}>}
	 */
	callPreSignedAPI: async (requestData) => {
		try {
			let options = {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				url: CONFIG?.SERVICE?.COMMON_SERVICE_URL + '/s3/get/pre-signed-url',
				body: {
					base_url: requestData
				}
			};
			let merchantDetails = await networkCall(options);
			if (merchantDetails?.error) app_error(merchantDetails?.error, {}, 'Call Pre-signed API', '');
			let resultData = JSON.parse(merchantDetails?.body);
			let valid = resultData?.success;
			if (!valid) {
				return {
					error: true,
					message:
						resultData?.message ||
						'Something went wrong while getting pre signed url. Please try again after sometimes.'
				};
			}
			let result = resultData?.data?.url;
			let replaceResultUrl = result.replace(CONFIG?.PRE_SIGNED_URL, CONFIG?.PRE_SIGNED_CHANGE_URL);
			return {error: false, message: resultData?.message, data: replaceResultUrl};
		} catch (error) {
			app_error(error, {}, 'Call Pre-signed API', '');
			return {error: true, message: 'Something Went Wrong! Please try again.'};
		}
	},
	/**
	 * To get presigned
	 * @param requestData
	 * @returns {Promise<{data: *, error: boolean, message: *}|{error: boolean, message: string}|{error: boolean, message: (*|string)}>}
	 */
	getPreSignedUrl: async (requestData) => {
		const isNotempty = !isEmpty(requestData.front) || !isEmpty(requestData.back) || !isEmpty(requestData.base_url);
		if (!isNotempty) {
			app_warning(
				'Required fields are missing!',
				{front: requestData?.front, back: requestData?.back, base_url: requestData?.base_url},
				requestData?.loggedUser,
				'Get Pre-Signed URL API'
			);
			return {error: true, message: 'Required fields are missing!'};
		}
		try {
			let frontPresigned = '',
				backPresigned = '',
				baseurlPresigned = '',
				data = {};

			if (!isEmpty(requestData.front)) {
				frontPresigned = await AdminController.callPreSignedAPI(requestData.front);
				data.front = frontPresigned?.data;
			}
			if (!isEmpty(requestData.back)) {
				backPresigned = await AdminController.callPreSignedAPI(requestData.back);
				data.back = backPresigned?.data;
			}
			if (!isEmpty(requestData.base_url)) {
				baseurlPresigned = await AdminController.callPreSignedAPI(requestData.base_url);
				data.base_url = baseurlPresigned?.data;
			}
			if (!isEmpty(data)) {
				return {error: false, message: 'Presigned url generated', data: data};
			}
			app_warning(
				frontPresigned?.message ||
					backPresigned?.message ||
					baseurlPresigned?.message ||
					'Something went wrong! Please try again',
				{front: requestData?.front, back: requestData?.back, base_url: requestData?.base_url},
				requestData?.loggedUser,
				'Get Pre-Signed URL API'
			);
			return {error: true, message: 'Something went wrong! Please try again'};
		} catch (error) {
			app_error(error, {}, 'Get Pre-Signed URL API', requestData?.loggedUser);
			return {error: true, message: 'Something went wrong! Please try again'};
		}
	},
	/**
	 * Change Status
	 * @param requestData
	 * @param admin_id
	 */
	changeStatus: async (requestData, admin_id) => {
		try {
			if (requestData?.id === admin_id) {
				app_warning(
					'User cannot switch status of their own account',
					{admin_id: requestData?.id},
					requestData,
					'Sub Admin Change Status'
				);
				return {error: true, message: 'User cannot switch status of their own account'};
			}
			let queryOptions = {
				condition: {admin_id: admin_id},
				projection: {
					role: 1,
					admin_id: 1,
					status: 1,
					kong_termination_id: 1
				},
				options: {
					lean: false
				}
			};
			let admin = await findOneAdmin(queryOptions);
			if (isEmpty(admin)) {
				app_warning('Invalid admin!', {admin_id}, requestData, 'Sub Admin Change Status');
				return {error: false, message: 'Invalid admin!'};
			} else {
				let status = admin['status'] === 'active' ? 'deactive' : 'active';
				admin.status = status;
				admin.markModified('status');
				let response;
				if (status === 'deactive') {
					response = await requestTermination(admin_id, 'admin');
					admin.kong_termination_id = response.data;
				} else {
					let id = admin?.kong_termination_id;
					response = await activateTermination(admin_id, id, 'admin');
					admin.kong_termination_id = '';
				}
				admin.markModified('kong_termination_id');
				if (!response.error) {
					await admin.save();
					return {error: false, data: response, message: 'Status changed successfully!'};
				}
				app_warning('Something went to wrong!', {response}, requestData, 'Sub Admin Change Status');
				return {error: true, message: response || 'Something went to wrong!'};
			}
		} catch (error) {
			app_error(error, {}, 'Sub Admin Change Status', requestData);
			return {
				error: true,
				message: error?.message
			};
		}
	}
};

module.exports = AdminController;
