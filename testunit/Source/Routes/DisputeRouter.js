const Express = require('express');
const Router = Express.Router();
const Responder = require('../App/Responder');
const Authentication = require('../Helpers/Authentication');
const {app_error, app_notice} = require('../Helpers/Logger');
const DisputeController = require('../Controller/DisputeController');
const {listValidator, statusChangeValidator} = require('../Validators/DisputeValidator');
const {validationResult} = require('express-validator');
const {isEmpty} = require('../Helpers/Utils');

const DisputeRouter = Express.Router();

DisputeRouter.use(Authentication());

DisputeRouter.get('/list', listValidator(), async (request, response) => {
	try {
		let hasErrors = validationResult(request);
		if (hasErrors.isEmpty()) {
			let {error, message, data} = await DisputeController.disputeList(request?.query, request?.body?.loggedUser);
			if (data !== undefined && error === false) {
				return Responder.sendSuccessData(response, message, data);
			}
			return Responder.sendFailureMessage(response, message, 400);
		} else {
			app_notice(hasErrors.errors[0], request?.body?.loggedUser, 'Get Dispute List');
			return Responder.sendFailureMessage(response, hasErrors?.errors[0]?.msg, 422);
		}
	} catch (error) {
		app_error(error, request, 'Get Dispute List');
		return Responder.sendFailureMessage(response, error, 500);
	}
});

DisputeRouter.patch('/change-status/:disputeId', statusChangeValidator(), async (request, response) => {
	try {
		let hasErrors = validationResult(request);
		if (hasErrors.isEmpty()) {
			let {error, message, data} = await DisputeController.changeStatus(
				request?.body,
				request?.params?.disputeId
			);
			if (!isEmpty(data) && error === false) {
				return Responder.sendSuccessData(response, message, data);
			}
			return Responder.sendFailureMessage(response, message, 400);
		} else {
			app_notice(hasErrors.errors[0], request?.body?.loggedUser, 'Update Status Dispute');
			return Responder.sendFailureMessage(response, hasErrors?.errors[0]?.msg, 422);
		}
	} catch (error) {
		app_error(error, request, 'Update Status Dispute');
		return Responder.sendFailureMessage(response, error, 500);
	}
});

DisputeRouter.get('/details/:disputeId', async (request, response) => {
	try {
		let {error, message, data} = await DisputeController.disputeDetails(
			request?.body?.loggedUser,
			request?.params?.disputeId
		);
		if (!isEmpty(data) && error === false) {
			return Responder.sendSuccessData(response, message, data);
		}
		return Responder.sendFailureMessage(response, message, 400);
	} catch (error) {
		app_error(error, request, 'Dispute Details');
		return Responder.sendFailureMessage(response, error, 500);
	}
});

Router.use('/', DisputeRouter);

module.exports = Router;
