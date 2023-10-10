const Express = require('express');
const Router = Express.Router();
const ProductRouter = Express.Router();
const {isEmpty} = require('../Helpers/Utils');
const ProductController = require('../Controller/ProductController');
const Authentication = require('../Helpers/Authentication');
const {sendFailureMessage, sendSuccessData} = require('../App/Responder');
const {app_error} = require('../Helpers/Logger');

ProductRouter.use(Authentication());

ProductRouter.get('/list', async (request, responce) => {
	try {
		let {error, message, data} = await ProductController.list(request?.query, request?.body?.loggedUser);
		if (!isEmpty(data) && error === false) {
			return sendSuccessData(responce, message, data);
		}
		return sendFailureMessage(responce, message, 400);
	} catch (error) {
		app_error(error, request, 'Product List');
		return sendFailureMessage(responce, error, 500);
	}
});

ProductRouter.post('/create', async (request, responce) => {
	try {
		let {error, message, data} = await ProductController.create(request?.body);
		if (!isEmpty(data) && error === false) {
			return sendSuccessData(responce, message, data);
		}
		return sendFailureMessage(responce, message, 400);
	} catch (error) {
		app_error(error, request, 'Create Product');
		return sendFailureMessage(responce, error, 500);
	}
});

ProductRouter.get('/detail/:productId', async (request, responce) => {
	try {
		let {error, message, data} = await ProductController.detail(
			request?.params?.productId,
			request?.body?.loggedUser
		);
		if (!isEmpty(data) && error === false) {
			return sendSuccessData(responce, message, data);
		}
		return sendFailureMessage(responce, message, 400);
	} catch (error) {
		app_error(error, request, 'Product Details');
		return sendFailureMessage(responce, error, 500);
	}
});

ProductRouter.post('/update/:productId', async (request, responce) => {
	try {
		let {error, message, data} = await ProductController.update(request?.body, request?.params?.productId);
		if (!isEmpty(data) && error === false) {
			return sendSuccessData(responce, message, data);
		}
		return sendFailureMessage(responce, message, 400);
	} catch (error) {
		app_error(error, request, 'Edit Product');
		return sendFailureMessage(responce, error, 500);
	}
});

ProductRouter.post('/change-status/:productId', async (request, responce) => {
	try {
		let {error, message, data} = await ProductController.changeStatus(
			request?.params?.productId,
			request?.body?.loggedUser
		);
		if (!isEmpty(data) && error === false) {
			return sendSuccessData(responce, message, data);
		}
		return sendFailureMessage(responce, message, 400);
	} catch (error) {
		app_error(error, request, 'Product Change Status');
		return sendFailureMessage(responce, error, 500);
	}
});

Router.use('/', ProductRouter);

module.exports = Router;
