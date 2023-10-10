const Express = require('express');
const Router = Express.Router();
const {isEmpty} = require('../Helpers/Utils');
const Responder = require('../App/Responder');
const Authentication = require('../Helpers/Authentication');
const {app_notice, app_error} = require('../Helpers/Logger');
const MerchantController = require('../Controller/MerchantController');
const {validationResult} = require('express-validator');
const SubMerchantController = require('../Controller/SubMerchantController');
const {listValidation, createValidator} = require('../Validators/SubMerchantValidator');

const SubMerchantRouter = Express.Router();

SubMerchantRouter.use(Authentication());

SubMerchantRouter.post('/create/:merchantId', createValidator(), async (request, response) => {
	try {
		let hasErrors = validationResult(request);
		if (hasErrors.isEmpty()) {
			let {error, message, data} = await MerchantController.createMerchant(
				request?.body,
				request?.params?.merchantId
			);
			if (!isEmpty(data) && error === false) {
				return Responder.sendSuccessData(response, message, data);
			}
			return Responder.sendFailureMessage(response, message, 400);
		} else {
			app_notice(hasErrors?.errors[0], request?.body?.loggedUser, 'Create Sub-Merchant');
			return Responder.sendFailureMessage(response, hasErrors?.errors[0]?.msg, 422);
		}
	} catch (error) {
		app_error(error, request, 'Create Sub-Merchant');
		return Responder.sendFailureMessage(response, error, 500);
	}
});

SubMerchantRouter.get('/list/:merchantId?', listValidation(), async (request, response) => {
	try {
		let hasErrors = validationResult(request);
		if (hasErrors.isEmpty()) {
			let {error, message, data} = await SubMerchantController.list(
				request?.body?.loggedUser,
				request?.query,
				request?.params?.merchantId
			);
			if (data && error === false) {
				return Responder.sendSuccessData(response, message, data);
			}
			return Responder.sendFailureMessage(response, message, 400);
		} else {
			app_notice(hasErrors?.errors[0], request?.body?.loggedUser, 'Get Sub-Merchant List');
			return Responder.sendFailureMessage(response, hasErrors?.errors[0]?.msg, 422);
		}
	} catch (error) {
		app_error(error, request, 'Get Sub-Merchant List');
		return Responder.sendFailureMessage(response, error, 500);
	}
});

SubMerchantRouter.delete('/delete/:subMerchantId', async (request, response) => {
	try {
		let {error, message, data} = await SubMerchantController.deleteSubMerchant(
			request?.body?.loggedUser,
			request?.params?.subMerchantId
		);
		if (!isEmpty(data) && error === false) {
			return Responder.sendSuccessData(response, message, data);
		}
		return Responder.sendFailureMessage(response, message, 400);
	} catch (error) {
		app_error(error, request, 'Delete Sub-Merchant');
		return Responder.sendFailureMessage(response, error, 500);
	}
});

SubMerchantRouter.patch('/update/:subMerchantId', async (request, response) => {
	try {
		let {error, message, data} = await SubMerchantController.update(
			request?.body,
			request?.body?.loggedUser,
			request?.params?.subMerchantId
		);
		if (!isEmpty(data) && error === false) {
			return Responder.sendSuccessData(response, message, data);
		}
		return Responder.sendFailureMessage(response, message, 400);
	} catch (error) {
		app_error(error, request, 'Update Sub-Merchant');
		return Responder.sendFailureMessage(response, error, 500);
	}
});

SubMerchantRouter.patch('/status-change/:subMerchantId', async (request, response) => {
	try {
		let {error, message, data} = await SubMerchantController.changeStatus(
			request?.body?.loggedUser,
			request?.params?.subMerchantId
		);
		if (!isEmpty(data) && error === false) {
			return Responder.sendSuccessData(response, message, data);
		}
		return Responder.sendFailureMessage(response, message, 400);
	} catch (error) {
		app_error(error, request, 'Status Change Sub-Merchant');
		return Responder.sendFailureMessage(response, error, 500);
	}
});

SubMerchantRouter.get('/details/:subMerchantId', async (request, response) => {
	try {
		let {error, message, data} = await SubMerchantController.details(
			request?.body?.loggedUser,
			request?.params?.subMerchantId
		);
		if (!isEmpty(data) && error === false) {
			return Responder.sendSuccessData(response, message, data);
		}
		return Responder.sendFailureMessage(response, message, 400);
	} catch (error) {
		app_error(error, request, 'Details Sub-Merchant');
		return Responder.sendFailureMessage(response, error, 500);
	}
});

Router.use('/', SubMerchantRouter);

module.exports = Router;
