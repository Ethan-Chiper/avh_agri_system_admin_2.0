const Express = require('express');
const Router = Express.Router();
const Responder = require('../App/Responder');
const {createValidator, listValidator} = require('../Validators/StoreValidator');
const Authentication = require('../Helpers/Authentication');
const {app_error, app_notice} = require('../Helpers/Logger');
const StoreController = require('../Controller/StoreController');
const {validationResult} = require('express-validator');
const {isEmpty} = require('../Helpers/Utils');

const StoreRouter = Express.Router();

StoreRouter.use(Authentication());

StoreRouter.post('/create/:merchantId', createValidator(), async (request, response) => {
	try {
		let hasErrors = validationResult(request);
		if (hasErrors.isEmpty()) {
			let {error, message, data} = await StoreController.createStore(request?.body, request?.params?.merchantId);
			if (!isEmpty(data) && error === false) {
				return Responder.sendSuccessData(response, message, data);
			}
			return Responder.sendFailureMessage(response, message, 400);
		} else {
			app_notice(hasErrors?.errors[0], request?.body?.loggedUser, 'Create Store');
			return Responder.sendFailureMessage(response, hasErrors?.errors[0]?.msg, 422);
		}
	} catch (error) {
		app_error(error, request, 'Create Store');
		return Responder.sendFailureMessage(response, error, 500);
	}
});

StoreRouter.patch('/update/:storeId', async (request, response) => {
	try {
		let {error, message, data} = await StoreController.updateStores(request?.params?.storeId, request?.body);
		if (!isEmpty(data) && error === false) {
			return Responder.sendSuccessData(response, message, data);
		}
		return Responder.sendFailureMessage(response, message, 400);
	} catch (error) {
		app_error(error, request, 'Update Store');
		return Responder.sendFailureMessage(response, error, 500);
	}
});

StoreRouter.patch('/change-status/:storeId', async (request, response) => {
	try {
		let {error, message, data} = await StoreController.changeStatus(
			request?.body?.loggedUser,
			request?.params?.storeId
		);
		if (!isEmpty(data) && error === false) {
			return Responder.sendSuccessData(response, message, data);
		}
		return Responder.sendFailureMessage(response, message, 400);
	} catch (error) {
		app_error(error, request, 'Update Status Store');
		return Responder.sendFailureMessage(response, error, 500);
	}
});

StoreRouter.get('/details/:storeId', async (request, response) => {
	try {
		let {error, message, data} = await StoreController.storeDetails(
			request?.body?.loggedUser,
			request?.params?.storeId
		);
		if (!isEmpty(data) && error === false) {
			return Responder.sendSuccessData(response, message, data);
		}
		return Responder.sendFailureMessage(response, message, 400);
	} catch (error) {
		app_error(error, request, 'Store Details');
		return Responder.sendFailureMessage(response, error, 500);
	}
});

StoreRouter.get('/list/:merchantId?', listValidator(), async (request, response) => {
	try {
		let hasErrors = validationResult(request);
		if (hasErrors.isEmpty()) {
			let {error, message, data} = await StoreController.listStores(
				request?.query,
				request?.params?.merchantId,
				request?.body?.loggedUser
			);
			if (data !== undefined && error === false) {
				return Responder.sendSuccessData(response, message, data);
			}
			return Responder.sendFailureMessage(response, message, 400);
		} else {
			app_notice(hasErrors?.errors[0], request?.body?.loggedUser, 'Get Store List');
			return Responder.sendFailureMessage(response, hasErrors?.errors[0]?.msg, 422);
		}
	} catch (error) {
		app_error(error, request, 'Get Store List');
		return Responder.sendFailureMessage(response, error, 500);
	}
});

StoreRouter.delete('/delete/:storeId', async (request, response) => {
	try {
		let {error, message, data} = await StoreController.deleteStore(
			request?.body?.loggedUser,
			request?.params?.storeId
		);
		if (!isEmpty(data) && error === false) {
			return Responder.sendSuccessData(response, message, data);
		}
		return Responder.sendFailureMessage(response, message, 400);
	} catch (error) {
		app_error(error, request, 'Delete Store');
		return Responder.sendFailureMessage(response, error, 500);
	}
});

Router.use('/', StoreRouter);

module.exports = Router;
