const Express = require('express');
const Router = Express.Router();
const Responder = require('../App/Responder');
const Authentication = require('../Helpers/Authentication');
const {app_error} = require('../Helpers/Logger');
const PropertiesController = require('../Controller/PropertiesController');

const PropertiesRouter = Express.Router();

PropertiesRouter.use(Authentication());

PropertiesRouter.get('/category-list', async (request, response) => {
	try {
		let {error, message, data} = await PropertiesController.getCategories(request?.body?.loggedUser);
		if (data && error === false) {
			return Responder.sendSuccessData(response, message, data);
		}
		return Responder.sendFailureMessage(response, message, 400);
	} catch (error) {
		app_error(error, request, 'List categories');
		return Responder.sendFailureMessage(response, error, 500);
	}
});

PropertiesRouter.get('/sub-category-list', async (request, response) => {
	try {
		let {error, message, data} = await PropertiesController.getSubCategories(
			request?.body?.loggedUser,
			request?.query
		);
		if (data && error === false) {
			return Responder.sendSuccessData(response, message, data);
		}
		return Responder.sendFailureMessage(response, message, 400);
	} catch (error) {
		app_error(error, request, 'List sub categories');
		return Responder.sendFailureMessage(response, error, 500);
	}
});

Router.use('/', PropertiesRouter);

module.exports = Router;
