const {networkCall, isEmpty} = require('../Helpers/Utils');
const CONFIG = require('../App/Config');
const {app_error, app_warning} = require('../Helpers/Logger');

const ProductController = {
	/**
	 * product list
	 * @param {*} query - query's is string or object
	 * @param loggedUser
	 */
	list: async (query, loggedUser) => {
		let queryString = '';
		if (query.limit) {
			queryString += 'limit=' + query?.limit + '&';
		}
		if (query.page) {
			queryString += 'page=' + query?.page + '&';
		}
		if (query.product_id) {
			queryString += 'product_id=' + query?.product_id + '&';
		}
		if (query.name) {
			queryString += 'name=' + query?.name;
		}
		let options = {
			method: 'GET',
			url: CONFIG.SERVICE.POS_SERVICE_URL + '/product/list?' + queryString
		};
		try {
			let productData = await networkCall(options);
			if (productData?.error) app_error(productData?.error, {}, 'Product List', loggedUser);
			let result = JSON.parse(productData.body);
			if (!result.success) {
				app_warning('There is no product list', result, loggedUser, 'Product List');
				return {error: true, message: 'There is no product list'};
			}
			return {error: false, message: result.message, data: result.data};
		} catch (error) {
			app_error(error, {}, 'Product List', loggedUser);
			return {error: true, message: 'Somthing went wrong! please try again'};
		}
	},
	/**
	 *create product
	 * @param {*} requestData
	 * @returns {*}
	 */
	create: async (requestData) => {
		if (isEmpty(requestData.name && requestData.price && requestData.tax)) {
			return {error: true, message: 'please check insert value'};
		}
		let productInfo = {
			name: requestData.name ?? '',
			price: requestData.price ?? '',
			tax: requestData.tax ?? '',
			image: requestData.image ?? '',
			mmc: requestData.mcc ?? ''
		};
		let options = {
			method: 'POST',
			url: CONFIG.SERVICE.POS_SERVICE_URL + '/product/create',
			body: productInfo
		};
		try {
			let productResult = await networkCall(options);
			if (productResult?.error) app_error(productResult?.error, {}, 'Create Product', requestData?.loggedUser);
			let result = JSON.parse(productResult.body);
			if (!result.success) {
				app_warning('Could not create product', result, requestData?.loggedUser, 'Create Product');
				return {error: true, message: 'Could not create product'};
			}
			return {error: false, message: result.message, data: result.data};
		} catch (error) {
			app_error(error, {}, 'Create Product', requestData?.loggedUser);
			return {error: true, message: 'Somthing went worng! Please try again'};
		}
	},
	/**
	 *To product details
	 * @param {*} productId
	 * @param loggedUser
	 * @returns {*}
	 */
	detail: async (productId, loggedUser) => {
		if (isEmpty(productId)) {
			return {error: true, message: 'product id is not fount'};
		}
		let options = {
			method: 'GET',
			url: CONFIG.SERVICE.POS_SERVICE_URL + '/product/detail/' + productId
		};
		try {
			let productData = await networkCall(options);
			let result = JSON.parse(productData.body);
			if (!result.success) {
				app_warning('There is no product detail', result, loggedUser, 'Product Details');
				return {error: true, message: 'There is no product detail'};
			}
			return {error: false, message: result.message, data: result.data};
		} catch (error) {
			app_error(error, {}, 'Product Details', loggedUser);
			return {error: true, message: 'Somthing went worng! Please try again'};
		}
	},
	/**
	 *To update product
	 * @param {*} requestData
	 * @param {*} productId
	 * @returns {*}
	 */
	update: async (requestData, productId) => {
		if (isEmpty(productId)) {
			return {error: true, message: 'product id is not found'};
		}
		if (isEmpty(requestData.name && requestData.price && requestData.tax && requestData.image && requestData.mcc)) {
			app_warning(
				'please check update value',
				{
					name: requestData?.name,
					price: requestData?.price,
					tax: requestData.tax,
					image: requestData.image,
					mcc: requestData.mcc
				},
				requestData?.loggedUser,
				'Product Update'
			);
			return {error: true, message: 'please check update value'};
		}
		let productData = {
			name: requestData.name,
			price: requestData.price,
			tax: requestData.tax,
			image: requestData.image,
			mcc: requestData.mcc
		};
		let options = {
			method: 'POST',
			url: CONFIG.SERVICE.POS_SERVICE_URL + '/product/update/' + productId,
			body: productData
		};
		try {
			let productResult = await networkCall(options);
			if (productResult?.error) app_error(productResult?.error, {}, 'Product Update', requestData?.loggedUser);
			let result = JSON.parse(productResult.body);
			if (!result.success) {
				app_warning('product detail is not update', result, requestData?.loggedUser, 'Product Update');
				return {error: true, message: 'product detail is not update'};
			}
			return {error: false, message: result.message, data: result.data};
		} catch (error) {
			app_error(error, {}, 'Product Update', requestData?.loggedUser);
			return {error: true, message: 'Somthing went worng! Please try again'};
		}
	},
	/**
	 *To change the status of the product
	 * @param {*} productId
	 * @param loggedUser
	 * @returns {*}
	 */
	changeStatus: async (productId, loggedUser) => {
		if (isEmpty(productId)) {
			return {error: true, message: 'product id is not found'};
		}
		let options = {
			method: 'PATCH',
			url: CONFIG.SERVICE.POS_SERVICE_URL + '/product/changeStatus/' + productId
		};
		try {
			let productData = await networkCall(options);
			if (productData?.error) app_error(productData?.error, {}, 'Change Status Product', loggedUser);
			let result = JSON.parse(productData.body);
			if (!result.success) {
				app_warning('product status is not update', result, loggedUser, 'Change Status Product');
				return {error: true, message: 'product status is not update'};
			}
			return {error: false, message: result.message, data: result.data};
		} catch (error) {
			app_error(error, {}, 'Change Status Product', loggedUser);
			return {error: true, message: 'Somthing went worng! Please try again'};
		}
	}
};
module.exports = ProductController;
