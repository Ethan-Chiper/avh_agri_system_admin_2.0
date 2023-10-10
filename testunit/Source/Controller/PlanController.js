const {isEmpty, networkCall} = require('../Helpers/Utils');
const CONFIG = require('../App/Config');
const {app_warning, app_error} = require('../Helpers/Logger');

const PlanController = {
	/**
	 * list
	 * @param {*} query - query's is string or object
	 * @param loggedUser
	 * @return {*}
	 */
	list: async (query, loggedUser) => {
		let queryString = '';
		if (query.limit) {
			queryString += 'limit=' + query.limit + '&';
		}
		if (query.page) {
			queryString += 'page=' + query.page + '&';
		}
		if (query.plan_id) {
			queryString += 'plan_id=' + query.plan_id + '&';
		}
		if (query.sortBy) {
			queryString += 'sortBy=' + query.sortBy + '&';
		}
		if (query.plan_name) {
			queryString += 'plan_name=' + query.plan_name;
		}

		let options = {
			method: 'GET',
			url: CONFIG.SERVICE.SOUNDBOX_SERVICE + '/plan/list?' + queryString
		};
		// eslint-disable-next-line no-console
		console.log(options);
		try {
			let planList = await networkCall(options);
			if (planList?.error) app_error(planList?.error, {}, 'Plan List', loggedUser);
			let result = JSON.parse(planList?.body);
			if (!result?.success) {
				app_warning('There is no plan list', result, loggedUser, 'Plan List');
				return {
					error: true,
					message: 'There is no plan list'
				};
			}
			if (query.dropdown_for === 'sound_box') {
				let planListData = [];
				for (let plan of result.data) {
					planListData.push({plan_id: plan?.plan_id, plan_name: plan?.plan_name});
				}
				return {error: false, message: 'Plan Dropdown List', data: planListData};
			}
			return {error: false, message: result?.message, data: result?.data};
		} catch (error) {
			app_error(error, {}, 'Plan List', loggedUser);
			return {error: true, message: 'Something went wrong! Please try again'};
		}
	},
	/**
	 * create
	 * @param {*} requestData
	 */
	create: async (requestData) => {
		let planInfo = {
			plan_name: requestData?.plan_name || '',
			registration_fees: requestData?.registration_fees || '',
			subscription_fees: requestData?.subscription_fees || '',
			emi_start: requestData?.emi_start || 'month',
			description: requestData?.description || ''
		};
		let options = {
			method: 'POST',
			url: CONFIG.SERVICE.SOUNDBOX_SERVICE + '/plan/create',
			headers: {
				'Content-Type': 'application/json'
			},
			body: planInfo
		};
		try {
			let planData = await networkCall(options);
			if (planData?.error) app_error(planData?.error, {}, 'Plan Create', requestData?.loggedUser);
			let result = JSON.parse(planData?.body);
			if (!result?.success) {
				app_warning('Could not create plan', result, requestData?.loggedUser, 'Plan Create');
				return {error: true, message: 'Could not create plan'};
			}
			return {error: false, message: result?.message, data: result?.data};
		} catch (error) {
			app_error(error, {}, 'Plan Create', requestData?.loggedUser);
			return {error: true, message: 'Something went wrong! Please try again'};
		}
	},
	/**
	 * plan detail
	 * @param {*} planid
	 * @param loggedUser
	 * @returns {*}
	 */
	detail: async (planid, loggedUser) => {
		if (isEmpty(planid)) {
			app_warning('plan id is not found', {planid}, loggedUser, 'Plan Details');
			return {error: true, message: 'plan id is not found'};
		}
		let options = {
			method: 'GET',
			url: CONFIG.SERVICE.SOUNDBOX_SERVICE + '/plan/detail/' + planid
		};
		// eslint-disable-next-line no-console
		console.log(options);
		try {
			let planData = await networkCall(options);
			if (planData?.error) app_error(planData?.error, {}, 'Plan Details', loggedUser);
			let result = JSON.parse(planData?.body);
			if (!result?.success) {
				app_warning('There is no plan details', result, loggedUser, 'Plan Details');
				return {
					error: true,
					message: 'There is no plan details'
				};
			}
			return {error: false, message: result?.message, data: result?.data};
		} catch (error) {
			app_error(error, {}, 'Plan Details', loggedUser);
			return {error: false, message: 'Something went wrong! Please try again'};
		}
	},
	/**
	 *plan update
	 * @param {*} requestData
	 * @param {*} planId
	 * @returns {*}
	 */
	update: async (requestData, planId) => {
		let planData;
		if (isEmpty(planId)) {
			return {error: true, message: 'plan id is not empty'};
		}
		if (!isEmpty(requestData)) {
			planData = {
				plan_name: requestData?.plan_name,
				registration_fees: requestData?.registration_fees,
				subscription_fees: requestData?.subscription_fees,
				emi_start: requestData?.emi_start,
				description: requestData?.description
			};
		}
		let options = {
			method: 'POST',
			url: CONFIG.SERVICE.SOUNDBOX_SERVICE + '/plan/update/' + planId,
			body: planData
		};
		try {
			let planData = await networkCall(options);
			if (planData?.error) app_error(planData?.error, {}, 'Plan Update', requestData?.loggedUser);
			let result = JSON.parse(planData.body);
			if (!result?.success) {
				app_warning('plan is not update', result, requestData?.loggedUser, 'Plan Update');
				return {error: true, message: 'plan is not update'};
			}
			return {error: false, message: result.message, data: result.data};
		} catch (error) {
			app_error(error, {}, 'Plan Update', requestData?.loggedUser);
			return {error: true, message: 'Something went wrong! Please try again'};
		}
	},
	/**
	 * update status
	 * @param {*} planId
	 * @param loggedUser
	 * @returns {*}
	 */
	changeStatus: async (planId, loggedUser) => {
		if (isEmpty(planId)) {
			return {error: true, message: 'plan id is not empty'};
		}
		let options = {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json'
			},
			url: CONFIG.SERVICE.SOUNDBOX_SERVICE + '/plan/changeStatus/' + planId
		};
		try {
			let planData = await networkCall(options);
			if (planData?.error) app_error(planData?.error, {}, 'Plan Change Status', loggedUser);
			let result = JSON.parse(planData.body);
			if (!result.success) {
				app_warning('status is not update', result, loggedUser, 'Plan Change Status');
				return {error: true, message: 'status is not update'};
			}
			return {error: false, message: result.message, data: result.data};
		} catch (error) {
			app_error(error, {}, 'Plan Change Status', loggedUser);
			return {error: true, message: 'Something went wrong! Please try again'};
		}
	}
};

module.exports = PlanController;
