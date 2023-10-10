const CONFIG = require('../App/Config');
const {networkCall, isEmpty} = require('../Helpers/Utils');
const {app_error, app_warning} = require('../Helpers/Logger');

const PropertiesController = {
	getCategories: async (loggedUser) => {
		try {
			let options = {
				url: CONFIG.SERVICE.PROPERTIES_SERVICE_URL + '/category/list',
				method: 'GET',
				admin: loggedUser
			};

			let categoryList = await networkCall(options);
			if (categoryList?.error) app_error(categoryList?.error, {}, 'Main Category List', loggedUser);
			let resultData = JSON.parse(categoryList?.body);
			let valid = resultData?.success;
			if (!valid) {
				app_warning(
					resultData?.message || 'Could not list categories. Please try again after sometimes.',
					resultData,
					loggedUser,
					'Main Category List'
				);
				return {
					error: true,
					message: resultData?.message || 'Could not list categories. Please try again after sometimes.'
				};
			}
			return {error: false, message: resultData?.message, data: resultData?.data};
		} catch (error) {
			app_error(error, {}, 'Main Category List', loggedUser);
			return {error: true, message: 'Something went wrong!'};
		}
	},

	getSubCategories: async (loggedUser, queryData) => {
		try {
			let options = {
				url: CONFIG.SERVICE.PROPERTIES_SERVICE_URL + '/category/list',
				method: 'GET',
				admin: loggedUser
			};
			let query = {category_type: 'sub'};
			if (!isEmpty(queryData) && queryData?.parent_id) query.parent_id = queryData?.parent_id;
			let urlAppender = new URLSearchParams(query);
			options.url += '?' + urlAppender;

			let subCategoryList = await networkCall(options);
			if (subCategoryList?.error) app_error(subCategoryList?.error, {}, 'SubCategory List', loggedUser);
			let resultData = JSON.parse(subCategoryList?.body);
			let valid = resultData?.success;
			if (!valid) {
				app_warning(
					resultData?.message || 'Could not list sub-categories. Please try again after sometimes.',
					resultData,
					loggedUser,
					'SubCategory List'
				);
				return {
					error: true,
					message: resultData?.message || 'Could not list sub-categories. Please try again after sometimes.'
				};
			}
			return {error: false, message: resultData?.message, data: resultData?.data};
		} catch (error) {
			app_error(error, {}, 'SubCategory List', loggedUser);
			return {error: true, message: 'Something went wrong!'};
		}
	}
};

module.exports = PropertiesController;
