const Express = require('express');
const Router = Express.Router();
const VpaController = require('../Controller/VpaController');
const Responder = require('../App/Responder');
const Authentication = require('../Helpers/Authentication');
const {isEmpty} = require('../Helpers/Utils');
const {app_notice, app_error} = require('../Helpers/Logger');
const {validationResult} = require('express-validator');
const {createValidation, updateValidator, changeStatus} = require('../Validators/VpaValidation');

const VpaRouter = Express.Router();

VpaRouter.use(Authentication());

VpaRouter.get('/list/:merchantId?/:storeId?', async (request, response) => {
	try {
		let {error, message, data} = await VpaController.list(
			request?.body?.loggedUser,
			request?.query,
			request?.params
		);
		if (data && error === false) {
			return Responder.sendSuccessData(response, message, data);
		}
		return Responder.sendFailureMessage(response, message, 400);
	} catch (error) {
		app_error(error, request, 'Get VPA List');
		return Responder.sendFailureMessage(response, error, 500);
	}
});

VpaRouter.get('/details/:vpaId', async (request, response) => {
	try {
		let {error, message, data} = await VpaController.details(request?.body?.loggedUser, request?.params?.vpaId);
		if (!isEmpty(data) && error === false) {
			return Responder.sendSuccessData(response, message, data);
		}
		return Responder.sendFailureMessage(response, message, 400);
	} catch (error) {
		app_error(error, request, 'Get VPA Details');
		return Responder.sendFailureMessage(response, error, 500);
	}
});

VpaRouter.post('/create/:merchantId', createValidation(), async (request, response) => {
	try {
		let hasErrors = validationResult(request);
		if (hasErrors.isEmpty()) {
			let {error, message, data} = await VpaController.create(
				request?.body?.loggedUser,
				request?.body,
				request?.params.merchantId
			);
			if (!isEmpty(data) && error === false) {
				return Responder.sendSuccessData(response, message, data);
			}
			return Responder.sendFailureMessage(response, message, 400);
		} else {
			app_notice(hasErrors?.errors[0], request?.body?.loggedUser, 'Create VPA');
			return Responder.sendFailureMessage(response, hasErrors?.errors[0].msg, 422);
		}
	} catch (error) {
		app_error(error, request, 'Create VPA');
		return Responder.sendFailureMessage(response, error, 500);
	}
});

VpaRouter.post('/update/:vpaId', updateValidator(), async (request, response) => {
	try {
		let hasErrors = validationResult(request);
		if (hasErrors.isEmpty()) {
			let {error, message, data} = await VpaController.update(
				request?.body?.loggedUser,
				request?.body,
				request?.params?.vpaId
			);
			if (!isEmpty(data) && error === false) {
				return Responder.sendSuccessData(response, message, data);
			}
			return Responder.sendFailureMessage(response, message, 400);
		} else {
			app_notice(hasErrors?.errors[0], request?.body?.loggedUser, 'Update VPA');
			return Responder.sendFailureMessage(response, hasErrors?.errors[0].msg, 422);
		}
	} catch (error) {
		app_error(error, request, 'Update VPA');
		return Responder.sendFailureMessage(response, error, 500);
	}
});

VpaRouter.patch('/status-change/:merchantId/:storeId?', changeStatus(), async (request, response) => {
	try {
		let hasErrors = validationResult(request);
		if (hasErrors.isEmpty()) {
			let {error, message, data} = await VpaController.statusChange(
				request?.body?.loggedUser,
				request?.body,
				request?.params
			);
			if (!isEmpty(data) && error === false) {
				return Responder.sendSuccessData(response, message, data);
			}
			return Responder.sendFailureMessage(response, message, 400);
		} else {
			app_notice(hasErrors?.errors[0], request?.body?.loggedUser, 'Update VPA Status');
			return Responder.sendFailureMessage(response, hasErrors?.errors[0].msg, 422);
		}
	} catch (error) {
		app_error(error, request, 'Update VPA Status');
		return Responder.sendFailureMessage(response, error, 500);
	}
});

Router.use('/', VpaRouter);

module.exports = Router;
