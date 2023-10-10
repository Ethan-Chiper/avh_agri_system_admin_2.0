const Express = require('express');
const Router = Express.Router();
const {isEmpty} = require('../Helpers/Utils');
const Responder = require('../App/Responder');
const Authentication = require('../Helpers/Authentication');
const {app_notice, app_error} = require('../Helpers/Logger');
const {createValidator} = require('../Validators/PartnerValidators');
const PartnerController = require('../Controller/PartnerController');
const {validationResult} = require('express-validator');

const PartnerRouter = Express.Router();

PartnerRouter.use(Authentication());

PartnerRouter.post('/create', createValidator(), async (request, response) => {
	try {
		let hasErrors = validationResult(request);
		if (hasErrors.isEmpty()) {
			let {error, message, data} = await PartnerController.createPartner(request?.body);
			if (!isEmpty(data) && error === false) {
				return Responder.sendSuccessData(response, message, data);
			}
			return Responder.sendFailureMessage(response, message, 400);
		} else {
			app_notice(hasErrors?.errors[0], request?.body?.loggedUser, 'Create Partner');
			return Responder.sendFailureMessage(response, hasErrors?.errors[0]?.msg, 422);
		}
	} catch (error) {
		app_error(error, request, 'Create Partner');
		return Responder.sendFailureMessage(response, error, 500);
	}
});

PartnerRouter.get('/list', async (request, response) => {
	try {
		let {error, message, data} = await PartnerController.list(request?.query, request?.body?.loggedUser);
		if (!isEmpty(data) && error === false) {
			return Responder.sendSuccessData(response, message, data);
		}
		return Responder.sendFailureMessage(response, message, 400);
	} catch (error) {
		app_error(error, request, 'Partner List');
		return Responder.sendFailureMessage(response, error?.message, 500);
	}
});

Router.use('/', PartnerRouter);

module.exports = Router;
