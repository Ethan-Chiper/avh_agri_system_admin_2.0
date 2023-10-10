const {isEmpty, networkCall} = require('../Helpers/Utils');
const CONFIG = require('../App/Config');
const {app_error, app_warning} = require('../Helpers/Logger');

const CategoryController = {
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
		if (query.category_id) {
			queryString += 'category_id=' + query.category_id + '&';
		}
		if (query.sortBy) {
			queryString += 'sortBy=' + query.sortBy + '&';
		}
		if (query.name) {
			queryString += 'name=' + query.name;
		}

		let options = {
			method: 'GET',
			url: CONFIG.SERVICE.POS_SERVICE_URL + '/category/list?' + queryString
		};
		try {
			let categorylist = await networkCall(options);
			if (categorylist?.error) app_error(categorylist?.error, {}, 'Category List', loggedUser);
			let result = JSON.parse(categorylist?.body);
			if (!result?.success) {
				app_warning('There is no category list', result, loggedUser, 'Category List');
				return {
					error: true,
					message: 'There is no category list'
				};
			}
			return {error: false, message: result?.message, data: result?.data};
		} catch (error) {
			app_error(error, {}, 'Category List', loggedUser);
			return {error: true, message: 'Something went wrong! Please try again'};
		}
	},
	/**
	 * create
	 * @param {*} requestData
	 */
	create: async (requestData) => {
		let categoryInfo = {
			name: requestData.name ?? '',
			mcc: requestData.mcc ?? '',
			mdr: requestData.mdr ?? ''
		};
		let options = {
			method: 'POST',
			url: CONFIG.SERVICE.POS_SERVICE_URL + '/category/create',
			headers: {
				'Content-Type': 'application/json'
			},
			body: categoryInfo
		};
		try {
			let categoryData = await networkCall(options);
			if (categoryData?.error) app_error(categoryData?.error, {}, 'Category Create', requestData?.loggedUser);
			let result = JSON.parse(categoryData?.body);
			if (!result?.success) {
				app_warning('Could not create category', result, requestData?.loggedUser, 'Category Create');
				return {error: true, message: 'Could not create category'};
			}
			return {error: false, message: result?.message, data: result?.data};
		} catch (error) {
			app_error(error, {}, 'Category Create', requestData?.loggedUser);
			return {error: true, message: 'Something went wrong! Please try again'};
		}
	},
	/**
	 * category detail
	 * @param {*} categoryid
	 * @param loggedUser
	 * @returns {*}
	 */
	detail: async (categoryid, loggedUser) => {
		if (isEmpty(categoryid)) {
			app_warning('category id is not found', {category_id: categoryid}, loggedUser, 'Category Details');
			return {error: true, message: 'category id is not found'};
		}
		let options = {
			method: 'GET',
			url: CONFIG.SERVICE.POS_SERVICE_URL + '/category/detail/' + categoryid
		};

		try {
			let categoryData = await networkCall(options);
			if (categoryData?.error) app_error(categoryData?.error, {}, 'Category Details', loggedUser);
			let result = JSON.parse(categoryData?.body);
			if (!result?.success) {
				app_warning('There is no category details', result, loggedUser, 'Category Details');
				return {
					error: true,
					message: 'There is no category details'
				};
			}
			return {error: false, message: result?.message, data: result?.data};
		} catch (error) {
			app_error(error, {}, 'Category Details', loggedUser);
			return {error: false, message: 'Something went wrong! Please try again'};
		}
	},
	/**
	 *category update
	 * @param {*} requestData
	 * @param {*} categoryId
	 * @returns {*}
	 */
	update: async (requestData, categoryId) => {
		let categoryData;
		if (isEmpty(categoryId)) {
			app_warning(
				'category id is not empty',
				{categoryId, requestData},
				requestData?.loggedUser,
				'Category Update'
			);
			return {error: true, message: 'category id is not empty'};
		}
		if (!isEmpty(requestData)) {
			categoryData = {
				name: requestData.name,
				mcc: requestData.mcc,
				mdr: requestData.mdr
			};
		}
		let options = {
			method: 'POST',
			url: CONFIG.SERVICE.POS_SERVICE_URL + '/category/update/' + categoryId,
			body: categoryData
		};
		try {
			let categoryData = await networkCall(options);
			if (categoryData?.error) app_error(categoryData?.error, {}, 'Category Update', requestData?.loggedUser);
			let result = JSON.parse(categoryData.body);
			if (!result?.success) {
				app_warning('category is not update', result, requestData?.loggedUser, 'Category Update');
				return {error: true, message: 'category is not update'};
			}
			return {error: false, message: result.message, data: result.data};
		} catch (error) {
			app_error(error, {}, 'Category Update', requestData?.loggedUser);
			return {error: true, message: 'Something went wrong! Please try again'};
		}
	},
	/**
	 * update status
	 * @param {*} categoryId
	 * @param loggedUser
	 * @returns {*}
	 */
	changeStatus: async (categoryId, loggedUser) => {
		if (isEmpty(categoryId)) {
			return {error: true, message: 'category id is not empty'};
		}
		let options = {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json'
			},
			url: CONFIG.SERVICE.POS_SERVICE_URL + '/category/changeStatus/' + categoryId
		};
		try {
			let categoryData = await networkCall(options);
			if (categoryData?.error) app_error(categoryData?.error, {}, 'Category Update', loggedUser);
			let result = JSON.parse(categoryData.body);
			if (!result.success) {
				app_warning('status is not update', result, loggedUser, 'Category Update');
				return {error: true, message: 'status is not update'};
			}
			return {error: false, message: result.message, data: result.data};
		} catch (error) {
			app_error(error, {}, 'Category Update', loggedUser);
			return {error: true, message: 'Something went wrong! Please try again'};
		}
	}
};

module.exports = CategoryController;
