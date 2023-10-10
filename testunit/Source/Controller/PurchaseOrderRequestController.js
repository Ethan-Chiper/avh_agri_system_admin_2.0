const {app_error, app_warning} = require('../Helpers/Logger');
const {isEmpty, networkCall, getIdAndRole} = require('../Helpers/Utils');
const CONFIG = require('../App/Config');
const {findOneAdmin} = require('../Repository/AdminRepository');
const PurchaseOrderRequestController = {
	/**
	 * list
	 * @param {*} query - query's is string or object
	 * @param request
	 * @param loggedUser
	 * @param userId
	 * @return {*}
	 */
	list: async (request, loggedUser, userId) => {
		try {
			let queryData = request?.query;
			let userData = getIdAndRole(userId)[1];

			if (isEmpty(userData)) {
				return {error: true, message: 'Unauthorized access'};
			} else {
				let queryString = 'request_from=panel' + '&';
				if (queryData?.limit) {
					queryString += 'limit=' + queryData?.limit + '&';
				}
				if (queryData?.page) {
					queryString += 'page=' + queryData?.page + '&';
				}
				if (queryData.status) {
					queryString += 'status=' + queryData?.status + '&';
				}
				if (queryData?.delivery_status) {
					queryString += 'delivery_status=' + queryData?.delivery_status + '&';
				}
				if (queryData?.refund_status) {
					queryString += 'refund_status=' + queryData?.refund_status + '&';
				}
				if (queryData?.purchase_request_id) {
					queryString += 'purchase_request_id=' + queryData?.purchase_request_id + '&';
				}
				if (queryData?.merchant_id) {
					queryString += 'merchant_id=' + queryData?.merchant_id + '&';
				}
				if (queryData?.store_id) {
					queryString += 'store_id=' + queryData?.store_id + '&';
				}
				if (queryData?.phone) {
					queryString += 'phone=' + queryData?.phone + '&';
				}
				if (queryData?.from_date) {
					queryString += 'from_date=' + queryData?.from_date + '&';
				}
				if (queryData?.to_date) {
					queryString += 'to_date=' + queryData?.to_date + '&';
				}
				if (queryData?.date_option) {
					queryString += 'date_option=' + queryData?.date_option + '&';
				}
				if (queryData?.order_for) {
					queryString += 'order_for=' + 'sound_box';
				}

				let options = {
					method: 'GET',
					url: CONFIG.SERVICE.SOUNDBOX_SERVICE + '/order/list?' + queryString
				};

				let orderList = await networkCall(options);
				if (orderList?.error) app_error(orderList?.error, {}, 'Order List', loggedUser);
				let result = JSON.parse(orderList?.body);
				if (result?.success) {
					return {error: false, message: result?.message, data: result?.data};
				} else {
					app_warning('There is no order list', result, loggedUser, 'Order List');
					return {
						error: true,
						message: result?.message
					};
				}
			}
		} catch (error) {
			app_error(error, {}, 'Order List', loggedUser);
			return {error: true, message: 'Something went wrong! Please try again'};
		}
	},

	/**
	 * Details api
	 * @param planid
	 * @param orderId
	 * @param loggedUser
	 * @param userId
	 * @returns {Promise<{data: *, error: boolean, message: *}|{error: boolean, message: string}>}
	 */
	detail: async (orderId, loggedUser, userId) => {
		try {
			let userData = getIdAndRole(userId)[1];

			if (isEmpty(userData)) {
				return {error: true, message: 'Unauthorized access'};
			} else {
				if (isEmpty(orderId)) {
					app_warning('Order id is not found', {orderId}, loggedUser, 'Order Details');
					return {error: true, message: 'Order id is not found'};
				}
				let options = {
					method: 'GET',
					url: CONFIG.SERVICE.SOUNDBOX_SERVICE + '/order/detail/' + orderId
				};

				let orderData = await networkCall(options);
				if (orderData?.error) app_error(orderData?.error, {}, 'Order Details', loggedUser);
				let result = JSON.parse(orderData?.body);
				if (result?.success) {
					return {error: false, message: result?.message, data: result?.data};
				} else {
					app_warning('There is no order details', result, loggedUser, 'Order Details');
					return {
						error: true,
						message: 'There is no order details'
					};
				}
			}
		} catch (error) {
			app_error(error, {}, 'Order Details', loggedUser);
			return {error: true, message: 'Something went wrong! Please try again'};
		}
	},
	/**
	 * Mapping dsn with vpa
	 * @param orderId
	 * @param requestData
	 * @param loggedUser
	 * @param userId
	 * @returns {Promise<{error: boolean, message: string}>}
	 */
	mapDsnWithVpa: async (orderId, requestData, loggedUser, userId) => {
		try {
			let userData = getIdAndRole(userId)[1];

			if (isEmpty(userData)) {
				return {error: true, message: 'Unauthorized access'};
			} else {
				let queryOptions = {
					condition: {admin_id: userData, status: 'active'},
					projection: {
						role: 1,
						admin_id: 1,
						createdAt: 1,
						name: 1
					}
				};
				let adminData = await findOneAdmin(queryOptions);

				if (isEmpty(adminData)) {
					return {error: true, message: 'Select the valid user to process further'};
				}

				let postData = {
					order_id: orderId,
					serial_number: requestData?.serial_number,
					vpa_id: requestData?.vpa_id,
					language: requestData?.language,
					processed_by: {
						user_id: adminData?.admin_id,
						role: adminData?.role,
						name: adminData?.name?.full
					}
				};

				let options = {
					method: 'POST',
					url: CONFIG.SERVICE.SOUNDBOX_SERVICE + '/map-dsn-vpa',
					body: postData
				};

				let orderData = await networkCall(options);
				if (orderData?.error) {
					app_error(orderData?.error, {}, 'Dsn mapping with vpa', loggedUser);
					return {error: true, message: 'Error while Dsn mapping with vpa!'};
				}
				let result = JSON.parse(orderData?.body);
				return result?.success
					? {error: false, message: result?.message, data: result?.data}
					: {error: true, message: result?.message};
			}
		} catch (error) {
			app_error(error, {}, 'Mapping DSN with Vpa', loggedUser);
			return {error: true, message: 'Something went wrong! Please try again'};
		}
	},
	/**
	 * Sound box mapping test api
	 * @param dsnId
	 * @param orderId
	 * @param data
	 * @param loggedUser
	 * @param userId
	 * @returns {Promise<{error: boolean, message: string}|{data: *, error: boolean, message: *}|{error: boolean, message: *}>}
	 */
	changeDeliveryStatusOfSoundbox: async (orderId, data, loggedUser, userId) => {
		try {
			let userData = getIdAndRole(userId)[1];

			if (isEmpty(userData)) {
				return {error: true, message: 'Unauthorized access'};
			} else {
				let postData =
					data?.status === 'dispatched'
						? {
								status: data?.status,
								tracking_id: data?.tracking_id,
								tracking_link: data?.tracking_link,
								courier_no: data?.courier_no,
								courier_status: data?.courier_status,
								expected_delivery_date: data?.expected_delivery_date,
								delivery_partner_id: data?.delivery_partner_id,
								delivery_partner_name: data?.delivery_partner_name
						  }
						: {
								status: data?.status
						  };

				let options = {
					method: 'POST',
					url: CONFIG.SERVICE.SOUNDBOX_SERVICE + '/order/change-delivery-status/' + orderId,
					body: postData
				};
				let orderData = await networkCall(options);
				if (orderData?.error) {
					app_error(orderData?.error, {}, 'Changing delivery status of sound box', loggedUser);
					return {error: true, message: 'Error while Changing delivery status of sound box!'};
				}
				let result = JSON.parse(orderData?.body);
				return result?.success
					? {error: false, message: result?.message, data: result?.data}
					: {error: true, message: result?.message};
			}
		} catch (error) {
			app_error(error, {}, 'Changing delivery status of Sound box', loggedUser);
			return {error: true, message: 'Something went wrong! Please try again'};
		}
	},

	assignUserForProcessOrder: async (orderId, data, loggedUser, userId) => {
		try {
			let userData = getIdAndRole(userId)[1];

			if (isEmpty(userData)) {
				return {error: true, message: 'Unauthorized access'};
			} else {
				let queryOptions = {
					condition: {admin_id: data?.user_id, status: 'active'},
					projection: {
						role: 1,
						admin_id: 1,
						createdAt: 1,
						name: 1
					}
				};
				let userDetails = await findOneAdmin(queryOptions);

				if (isEmpty(userDetails)) {
					return {error: true, message: 'Select the valid user to proccess further'};
				}

				let postData = {
					user_id: userDetails?.admin_id,
					role: userDetails?.role,
					name: userDetails?.name?.full
				};

				let options = {
					method: 'POST',
					url: CONFIG.SERVICE.SOUNDBOX_SERVICE + '/order/assign-user-for-process-order/' + orderId,
					body: postData
				};

				let orderData = await networkCall(options);
				if (orderData?.error) {
					app_error(orderData?.error, {}, 'Assign user for sound box mapping completion', loggedUser);
					return {error: true, message: 'Error while assigning user for sound box mapping completion!'};
				}
				let result = JSON.parse(orderData?.body);
				return result?.success
					? {error: false, message: result?.message, data: result?.data}
					: {error: true, message: result?.message};
			}
		} catch (error) {
			app_error(error, {}, 'Assign user for sound box mapping completion', loggedUser);
			return {error: true, message: 'Something went wrong! Please try again'};
		}
	},
	/**
	 * Order Cancellation request
	 * @param orderId
	 * @param data
	 * @param loggedUser
	 * @param userId
	 */
	orderCancellationRequest: async (orderId, data, loggedUser, userId) => {
		try {
			let userData = getIdAndRole(userId)[1];

			if (isEmpty(userData)) {
				return {error: true, message: 'Unauthorized access'};
			} else {
				let queryOptions = {
					condition: {admin_id: userData, status: 'active'},
					projection: {
						role: 1,
						admin_id: 1,
						createdAt: 1,
						name: 1
					}
				};
				let userDetails = await findOneAdmin(queryOptions);

				if (isEmpty(userDetails)) {
					return {error: true, message: 'Select the valid user to proccess further'};
				}

				let postData = {
					user_id: userDetails?.admin_id,
					role: userDetails?.role,
					name: userDetails?.name?.full,
					reason: data?.reason
				};

				let options = {
					method: 'POST',
					url: CONFIG.SERVICE.SOUNDBOX_SERVICE + '/order/cancel-order/' + orderId,
					body: postData
				};

				let orderData = await networkCall(options);
				if (orderData?.error) {
					app_error(orderData?.error, {}, 'Order cancellation of sound box', loggedUser);
					return {error: true, message: 'Error while order cancellation of sound box!'};
				}
				let result = JSON.parse(orderData?.body);
				return result?.success
					? {error: false, message: result?.message, data: result?.data}
					: {error: true, message: result?.message};
			}
		} catch (error) {
			app_error(error, {}, 'Order cancellation of sound box', loggedUser);
			return {error: true, message: 'Something went wrong! Please try again'};
		}
	},

	/**
	 * Updating refund status of order
	 * @param orderId
	 * @param data
	 * @param loggedUser
	 * @param userId
	 * @returns {Promise<{error: boolean, message: string}|{data: *, error: boolean, message: *}|{error: boolean, message: *}>}
	 */
	updateRefundStatus: async (orderId, data, loggedUser, userId) => {
		try {
			let userData = getIdAndRole(userId)[1];

			if (isEmpty(userData)) {
				return {error: true, message: 'Unauthorized access'};
			} else {
				let queryOptions = {
					condition: {admin_id: userData, status: 'active'},
					projection: {
						role: 1,
						admin_id: 1,
						createdAt: 1,
						name: 1
					}
				};
				let userDetails = await findOneAdmin(queryOptions);

				if (isEmpty(userDetails)) {
					return {error: true, message: 'Select the valid user to proccess further'};
				}

				let postData = {
					user_id: userDetails?.admin_id,
					role: userDetails?.role,
					name: userDetails?.name?.full,
					utr_no: data?.utr_no
				};

				let options = {
					method: 'POST',
					url: CONFIG.SERVICE.SOUNDBOX_SERVICE + '/order/update-order-refund-status/' + orderId,
					body: postData
				};

				let orderData = await networkCall(options);
				if (orderData?.error) {
					app_error(orderData?.error, {}, 'Order refund status updation of sound box', loggedUser);
					return {error: true, message: 'Error while order refund status updation!'};
				}
				let result = JSON.parse(orderData?.body);
				return result?.success
					? {error: false, message: result?.message, data: result?.data}
					: {error: true, message: result?.message};
			}
		} catch (error) {
			app_error(error, {}, 'Order refund status updation of sound box', loggedUser);
			return {error: true, message: 'Something went wrong! Please try again'};
		}
	},

	/**
	 * Approving order
	 * @param orderId
	 * @param loggedUser
	 * @param userId
	 * @returns {Promise<{error: boolean, message: string}|{data: *, error: boolean, message: *}|{error: boolean, message: *}>}
	 */
	updateApprovalStatus: async (orderId, loggedUser, userId) => {
		try {
			let userData = getIdAndRole(userId)[1];

			if (isEmpty(userData)) {
				return {error: true, message: 'Unauthorized access'};
			} else {
				let queryOptions = {
					condition: {admin_id: userData, status: 'active'},
					projection: {
						role: 1,
						admin_id: 1,
						createdAt: 1,
						name: 1
					}
				};
				let userDetails = await findOneAdmin(queryOptions);

				if (isEmpty(userDetails)) {
					return {error: true, message: 'Select the valid user to proccess further'};
				}

				let postData = {
					user_id: userDetails?.admin_id,
					role: userDetails?.role,
					name: userDetails?.name?.full
				};

				let options = {
					method: 'POST',
					url: CONFIG.SERVICE.SOUNDBOX_SERVICE + '/order/update-order-approval-status/' + orderId,
					body: postData
				};

				let orderData = await networkCall(options);
				if (orderData?.error) {
					app_error(orderData?.error, {}, 'Order approve status updation of sound box', loggedUser);
					return {error: true, message: 'Error while order approval status updation!'};
				}
				let result = JSON.parse(orderData?.body);
				return result?.success
					? {error: false, message: result?.message, data: result?.data}
					: {error: true, message: result?.message};
			}
		} catch (error) {
			app_error(error, {}, 'Order approve status updation of sound box', loggedUser);
			return {error: true, message: 'Something went wrong! Please try again'};
		}
	},
	getCourierPartners: async (request, loggedUser) => {
		try {
			let options = {
				url: CONFIG.SERVICE.PROPERTIES_SERVICE_URL + '/category/courierPartnerList',
				method: 'GET',
				admin: loggedUser
			};
			let courierPartnerList = await networkCall(options);
			if (courierPartnerList?.error) app_error(courierPartnerList?.error, {}, 'Courier Partner List', loggedUser);
			let resultData = JSON.parse(courierPartnerList?.body);
			let valid = resultData?.success;
			if (!valid) {
				app_warning(
					resultData?.message || 'Could not list categories. Please try again after sometimes.',
					resultData,
					loggedUser,
					'Courier Partner List'
				);
				return {
					error: true,
					message: resultData?.message || 'Could not list courier partners. Please try again after sometimes.'
				};
			}
			return {error: false, message: resultData?.message, data: resultData?.data};
		} catch (error) {
			app_error(error, {}, 'Courier Partner List', loggedUser);
			return {error: true, message: 'Something went wrong!'};
		}
	}
};
module.exports = PurchaseOrderRequestController;
