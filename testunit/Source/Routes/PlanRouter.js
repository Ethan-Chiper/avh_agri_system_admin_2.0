const Express = require('express');
const Router = Express.Router();
const PlanRouter = Express.Router();
const Authentication = require('../Helpers/Authentication');
const PlanController = require('../Controller/PlanController');
const PlanValidation = require('../Validators/PlanValidator');
const {sendFailureMessage, sendSuccessData} = require('../App/Responder');
const {isEmpty} = require('../Helpers/Utils');
const {app_error} = require('../Helpers/Logger');

PlanRouter.use(Authentication());

PlanRouter.get('/list', async (request, response) => {
	try {
		let {error, message, data} = await PlanController.list(request?.query, request?.body?.loggedUser);
		if (!isEmpty(data) && error === false) {
			return sendSuccessData(response, message, data);
		}
		return sendFailureMessage(response, message, 400);
	} catch (error) {
		app_error(error, request, 'Plan List');
		return sendFailureMessage(response, error, 500);
	}
});

PlanRouter.post('/create', PlanValidation.createValidator(), async (request, response) => {
	try {
		let {error, message, data} = await PlanController.create(request?.body);
		if (!isEmpty(data) && error === false) {
			return sendSuccessData(response, message, data);
		}
		return sendFailureMessage(response, message, 400);
	} catch (error) {
		app_error(error, request, 'Plan Create');
		return sendFailureMessage(response, error, 500);
	}
});

PlanRouter.get('/detail/:planId?', async (request, response) => {
	try {
		let {error, message, data} = await PlanController.detail(request?.params?.planId, request?.body?.loggedUser);
		if (!isEmpty(data) && error === false) {
			return sendSuccessData(response, message, data);
		}
		return sendFailureMessage(response, message, 400);
	} catch (error) {
		app_error(error, request, 'Plan Details');
		return sendFailureMessage(response, error, 500);
	}
});

PlanRouter.post('/update/:planId', async (request, response) => {
	try {
		let {error, message, data} = await PlanController.update(request?.body, request?.params?.planId);
		if (!isEmpty(data) && error === false) {
			return sendSuccessData(response, message, data);
		}
		return sendFailureMessage(response, message, 400);
	} catch (error) {
		app_error(error, request, 'Edit Plan');
		return sendFailureMessage(response, error, 500);
	}
});

PlanRouter.patch('/change-status/:planId', async (request, response) => {
	try {
		let {error, message, data} = await PlanController.changeStatus(
			request?.params?.planId,
			request?.body?.loggedUser
		);
		if (!isEmpty(data) && error === false) {
			return sendSuccessData(response, message, data);
		}
		return sendFailureMessage(response, message, 400);
	} catch (error) {
		app_error(error, request, 'Plan Change Status');
		return sendFailureMessage(response, error, 500);
	}
});

Router.use('/', PlanRouter);

module.exports = Router;
