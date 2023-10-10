const Express = require('express');
const Router = Express.Router();
const {isEmpty} = require('../Helpers/Utils');
const Responder = require('../App/Responder');
const Authentication = require('../Helpers/Authentication');
const {app_notice, app_error} = require('../Helpers/Logger');
const {listValidator} = require('../Validators/SurveyValidator');
const SurveyController = require('../Controller/SurveyController');
const {validationResult} = require('express-validator');

const SurveyRouter = Express.Router();

SurveyRouter.use(Authentication());

SurveyRouter.get('/list', listValidator(), async (request, response) => {
	try {
		let hasErrors = validationResult(request);
		if (hasErrors.isEmpty()) {
			let {error, message, data} = await SurveyController.surveyList(request?.query, request?.body?.loggedUser);
			if (data !== undefined && error === false) {
				return Responder.sendSuccessData(response, message, data);
			}
			return Responder.sendFailureMessage(response, message, 400);
		} else {
			app_notice(hasErrors.errors[0], request?.body?.loggedUser, 'Survey List');
			return Responder.sendFailureMessage(response, hasErrors?.errors[0]?.msg, 422);
		}
	} catch (error) {
		app_error(error, request, 'Survey List');
		return Responder.sendFailureMessage(response, error?.message, 500);
	}
});

SurveyRouter.get('/survey-view/:surveyId', async (request, response) => {
	try {
		let {error, message, data} = await SurveyController.surveyView(
			request?.params?.surveyId,
			request?.body?.loggedUser
		);
		if (!isEmpty(data) && error === false) {
			return Responder.sendSuccessData(response, message, data);
		}
		return Responder.sendFailureMessage(response, message, 400);
	} catch (error) {
		app_error(error, request, 'Survey View');
		return Responder.sendFailureMessage(response, error?.message, 500);
	}
});

SurveyRouter.get('/report', listValidator(), async (request, response) => {
	try {
		let hasErrors = validationResult(request);
		if (hasErrors.isEmpty())
			return await SurveyController.exportSurvey(request?.query, request?.body?.loggedUser, response);
		else {
			app_notice(hasErrors.errors[0], request?.body?.loggedUser, 'Survey List');
			return Responder.sendFailureMessage(response, hasErrors?.errors[0]?.msg, 422);
		}
	} catch (error) {
		app_error(error, request, 'Survey Report');
		return Responder.sendFailureMessage(response, error?.message, 500);
	}
});

Router.use('/', SurveyRouter);

module.exports = Router;
