const Express = require('express');
const Router = Express.Router();
const CategoryRouter = Express.Router();
const Authentication = require('../Helpers/Authentication');
const CategoryController = require('../Controller/CategoryController');
const {sendFailureMessage, sendSuccessData} = require('../App/Responder');
const {isEmpty} = require('../Helpers/Utils');
const {app_error} = require('../Helpers/Logger');

CategoryRouter.use(Authentication());

CategoryRouter.get('/list', async (request, responce) => {
	try {
		let {error, message, data} = await CategoryController.list(request?.query, request?.body?.loggedUser);
		if (!isEmpty(data) && error === false) {
			return sendSuccessData(responce, message, data);
		}
		return sendFailureMessage(responce, message, 400);
	} catch (error) {
		app_error(error, request, 'Category List');
		return sendFailureMessage(responce, error, 500);
	}
});

CategoryRouter.post('/create', async (request, responce) => {
	try {
		let {error, message, data} = await CategoryController.create(request?.body);
		if (!isEmpty(data) && error === false) {
			return sendSuccessData(responce, message, data);
		}
		return sendFailureMessage(responce, message, 400);
	} catch (error) {
		app_error(error, request, 'Create Category');
		return sendFailureMessage(responce, error, 500);
	}
});

CategoryRouter.get('/detail/:categoryId?', async (request, responce) => {
	try {
		let {error, message, data} = await CategoryController.detail(
			request?.params?.categoryId,
			request?.body?.loggedUser
		);
		if (!isEmpty(data) && error === false) {
			return sendSuccessData(responce, message, data);
		}
		return sendFailureMessage(responce, message, 400);
	} catch (error) {
		app_error(error, request, 'Category Details');
		return sendFailureMessage(responce, error, 500);
	}
});

CategoryRouter.post('/update/:categoryId', async (request, responce) => {
	try {
		let {error, message, data} = await CategoryController.update(request?.body, request?.params?.categoryId);
		if (!isEmpty(data) && error === false) {
			return sendSuccessData(responce, message, data);
		}
		return sendFailureMessage(responce, message, 400);
	} catch (error) {
		app_error(error, request, 'Edit Category');
		return sendFailureMessage(responce, error, 500);
	}
});

CategoryRouter.patch('/change-status/:categoryId', async (request, responce) => {
	try {
		let {error, message, data} = await CategoryController.changeStatus(
			request?.params?.categoryId,
			request?.body?.loggedUser
		);
		if (!isEmpty(data) && error === false) {
			return sendSuccessData(responce, message, data);
		}
		return sendFailureMessage(responce, message, 400);
	} catch (error) {
		app_error(error, request, 'Category Change Status');
		return sendFailureMessage(responce, error, 500);
	}
});

Router.use('/', CategoryRouter);

module.exports = Router;
