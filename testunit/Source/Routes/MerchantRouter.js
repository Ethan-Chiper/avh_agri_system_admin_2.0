const Express = require('express');
const Router = Express.Router();
const {isEmpty} = require('../Helpers/Utils');
const Responder = require('../App/Responder');
const Authentication = require('../Helpers/Authentication');
const {app_notice, app_error} = require('../Helpers/Logger');
const {createValidator, listValidator, exportValidator} = require('../Validators/MerchantValidator');
const MerchantController = require('../Controller/MerchantController');
const {validationResult} = require('express-validator');

const MerchantRouter = Express.Router();

MerchantRouter.use(Authentication());

MerchantRouter.post('/create', createValidator(), async (request, response) => {
	try {
		let hasErrors = validationResult(request);
		if (hasErrors.isEmpty()) {
			let {error, message, data} = await MerchantController.createMerchant(request?.body, '');
			if (!isEmpty(data) && error === false) {
				return Responder.sendSuccessData(response, message, data);
			}
			return Responder.sendFailureMessage(response, message, 400);
		} else {
			app_notice(hasErrors?.errors[0], request?.body?.loggedUser, 'Create Merchant');
			return Responder.sendFailureMessage(response, hasErrors?.errors[0]?.msg, 422);
		}
	} catch (error) {
		app_error(error, request, 'Create Merchant');
		return Responder.sendFailureMessage(response, error, 500);
	}
});

MerchantRouter.patch('/update/:merchantId', async (request, response) => {
	try {
		let hasErrors = validationResult(request);
		if (hasErrors.isEmpty()) {
			let {error, message, data} = await MerchantController.updateMerchant(
				request?.body,
				request?.params?.merchantId
			);
			if (!isEmpty(data) && error === false) {
				return Responder.sendSuccessData(response, message, data);
			}
			return Responder.sendFailureMessage(response, message, 400);
		} else {
			app_notice(hasErrors?.errors[0], request?.body?.loggedUser, 'Update Merchant');
			return Responder.sendFailureMessage(response, hasErrors?.errors[0]?.msg, 422);
		}
	} catch (error) {
		app_error(error, request, 'Update Merchant');
		return Responder.sendFailureMessage(response, error, 500);
	}
});

MerchantRouter.patch('/change-status/:merchantId', async (request, response) => {
	try {
		let {error, message, data} = await MerchantController.changeStatus(
			request?.body?.loggedUser,
			request?.params?.merchantId
		);
		if (!isEmpty(data) && error === false) {
			return Responder.sendSuccessData(response, message, data);
		}
		return Responder.sendFailureMessage(response, message, 400);
	} catch (error) {
		app_error(error, request, 'Update Status Merchant');
		return Responder.sendFailureMessage(response, error, 500);
	}
});

MerchantRouter.get('/details/:merchantId', async (request, response) => {
	try {
		let {error, message, data} = await MerchantController.merchantDetails(
			request?.body?.loggedUser,
			request?.params?.merchantId
		);
		if (!isEmpty(data) && error === false) {
			return Responder.sendSuccessData(response, message, data);
		}
		return Responder.sendFailureMessage(response, message, 400);
	} catch (error) {
		app_error(error, request, 'Merchant Details');
		return Responder.sendFailureMessage(response, error, 500);
	}
});
MerchantRouter.get('/merchant-export', exportValidator(), async (request, response) => {
	try {
		let hasErrors = validationResult(request);
		return hasErrors.isEmpty()
			? await MerchantController.exportMerchant(request?.query, response)
			: Responder.sendFailureMessage(response, hasErrors?.errors[0]?.msg, 422);
	} catch (error) {
		return Responder.sendFailureMessage(response, error, 500);
	}
});

MerchantRouter.get('/list', listValidator(), async (request, response) => {
	try {
		let hasErrors = validationResult(request);
		if (hasErrors.isEmpty()) {
			let {error, message, data} = await MerchantController.merchantList(
				request?.query,
				request?.body?.loggedUser
			);
			if (data !== undefined && error === false) {
				return Responder.sendSuccessData(response, message, data);
			}
			return Responder.sendFailureMessage(response, message, 400);
		} else {
			app_notice(hasErrors.errors[0], request?.body?.loggedUser, 'Get Merchant List');
			return Responder.sendFailureMessage(response, hasErrors?.errors[0]?.msg, 422);
		}
	} catch (error) {
		app_error(error, request, 'Get Merchant List');
		return Responder.sendFailureMessage(response, error, 500);
	}
});

Router.use('/', MerchantRouter);

module.exports = Router;
