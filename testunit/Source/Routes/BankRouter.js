const Express = require('express');
const Router = Express.Router();
const BankController = require('../Controller/BankController');
const Responder = require('../App/Responder');
const {isEmpty} = require('../Helpers/Utils');
const {createBankAccountValidator, bankListValidation} = require('../Validators/BankValidation');
const {validationResult} = require('express-validator');
const {app_notice, app_error} = require('../Helpers/Logger');
const Authentication = require('../Helpers/Authentication');

const BankRouter = Express.Router();

BankRouter.use(Authentication());

BankRouter.get('/list/:merchantId?', bankListValidation(), async (request, response) => {
	try {
		let hasErrors = validationResult(request);
		if (hasErrors.isEmpty()) {
			let {error, message, data} = await BankController.list(
				request?.body?.loggedUser,
				request?.query,
				request?.params?.merchantId
			);
			if (data && error === false) {
				return Responder.sendSuccessData(response, message, data);
			}
			return Responder.sendFailureMessage(response, message, 400);
		} else {
			app_notice(hasErrors.errors[0], request?.body?.loggedUser, 'Get Bank List');
			return Responder.sendFailureMessage(response, hasErrors?.errors[0].msg, 422);
		}
	} catch (error) {
		app_error(error, request, 'Get Bank List');
		return Responder.sendFailureMessage(response, error, 500);
	}
});

BankRouter.post('/create/:merchantId', createBankAccountValidator(), async (request, response) => {
	try {
		let hasErrors = validationResult(request);
		if (hasErrors.isEmpty()) {
			let {error, message, data} = await BankController.create(
				request?.body?.loggedUser,
				request?.body,
				request?.params?.merchantId
			);
			if (!isEmpty(data) && error === false) {
				return Responder.sendSuccessData(response, message, data);
			}
			return Responder.sendFailureMessage(response, message, 400);
		} else {
			app_notice(hasErrors.errors[0], request?.body?.loggedUser, 'Create Beneficiary');
			return Responder.sendFailureMessage(response, hasErrors?.errors[0].msg, 422);
		}
	} catch (error) {
		app_error(error, request, 'Create Beneficiary');
		return Responder.sendFailureMessage(response, error, 500);
	}
});

BankRouter.get('/fetch-ifsc-details/:ifscCode', async (request, response) => {
	try {
		let {error, message, data} = await BankController.fetchIfscDetails(
			request?.params?.ifscCode,
			request?.body?.loggedUser
		);
		if (!isEmpty(data) && error === false) {
			return Responder.sendSuccessData(response, message, data);
		}
		return Responder.sendFailureMessage(response, message, 400);
	} catch (error) {
		app_error(error, request, 'IFSC Details');
		return Responder.sendFailureMessage(response, error, 500);
	}
});

Router.use('/', BankRouter);

module.exports = Router;
