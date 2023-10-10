const Express = require('express');
const Router = Express.Router();
const {isEmpty} = require('../Helpers/Utils');
const Responder = require('../App/Responder');
const Authentication = require('../Helpers/Authentication');
const {app_error, app_notice} = require('../Helpers/Logger');
const {validationResult} = require('express-validator');
const InsuranceController = require('../Controller/InsuranceController');

const InsuranceRouter = Express.Router();

InsuranceRouter.use(Authentication());

InsuranceRouter.get('/create', async (request, response) => {
	try {
		let hasErrors = validationResult(request);
		if (hasErrors.isEmpty()) {
			let {error, message, data} = await InsuranceController.dekhoCreate(request?.body?.loggedUser);
			if (!isEmpty(data) && error === false) {
				return Responder.sendSuccessData(response, message, data);
			}
			return Responder.sendFailureMessage(response, message, 400);
		} else {
			app_notice(hasErrors?.errors[0], request?.body?.loggedUser, 'Insurance Create');
			return Responder.sendFailureMessage(response, hasErrors?.errors[0]?.msg, 400);
		}
	} catch (error) {
		app_error(error, request, 'Insurance Create');
		return Responder.sendFailureMessage(response, error, 500);
	}
});
InsuranceRouter.get('/dekho/payout/list', async (request, response) => {
	try {
		let hasErrors = validationResult(request);
		if (hasErrors.isEmpty()) {
			let {error, message, data} = await InsuranceController.dekhoPayoutList(
				request?.query,
				request?.body?.loggedUser
			);
			if (!isEmpty(data) && error === false) {
				return Responder.sendSuccessData(response, message, data);
			}
			return Responder.sendFailureMessage(response, message, 400);
		} else {
			app_notice(hasErrors?.errors[0], request?.body?.loggedUser, 'Payout List');
			return Responder.sendFailureMessage(response, hasErrors?.errors[0]?.msg, 400);
		}
	} catch (error) {
		app_error(error, request, 'Payout List');
		return Responder.sendFailureMessage(response, error, 500);
	}
});
Router.use('/', InsuranceRouter);
module.exports = Router;
