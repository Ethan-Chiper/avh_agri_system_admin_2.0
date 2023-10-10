const Express = require('express');
const PosRequestRouter = Express.Router();
const Router = Express.Router();
const Authentication = require('../Helpers/Authentication');
const {isEmpty} = require('../Helpers/Utils');
const {sendFailureMessage, sendSuccessData} = require('../App/Responder');
const PosRequestController = require('../Controller/PosRequestController');
const {app_error} = require('../Helpers/Logger');

PosRequestRouter.use(Authentication());

PosRequestRouter.get('/list/:merchantId?/:storeId?', async (request, response) => {
	try {
		let {error, message, data} = await PosRequestController.list(
			request?.query,
			request?.params?.merchantId,
			request?.params?.storeId,
			request?.body?.loggedUser
		);

		if (data !== undefined && error === false) {
			return sendSuccessData(response, message, data);
		}
		return sendFailureMessage(response, message, 400);
	} catch (error) {
		app_error(error, request, 'POS List');
		return sendFailureMessage(response, error, 500);
	}
});

PosRequestRouter.get('/detail/:requestId?', async (request, response) => {
	try {
		let {error, message, data} = await PosRequestController.detail(
			request?.params?.requestId,
			request?.body?.loggedUser
		);
		if (!isEmpty(data) && error === false) {
			return sendSuccessData(response, message, data);
		}
		return sendFailureMessage(response, message, 400);
	} catch (error) {
		app_error(error, request, 'POS Details');
		return sendFailureMessage(response, error, 500);
	}
});

PosRequestRouter.patch('/pos-status/change/:requestId', async (request, response) => {
	try {
		let {error, message, data} = await PosRequestController.changePosStatus(
			request?.body,
			request?.params?.requestId
		);
		if (!isEmpty(data) && error === false) {
			return sendSuccessData(response, message, data);
		}
		return sendFailureMessage(response, message, 400);
	} catch (error) {
		app_error(error, request, 'POS Change Status');
		return sendFailureMessage(response, error, 500);
	}
});

PosRequestRouter.patch('/reject/reason/:requestId', async (request, response) => {
	try {
		let {error, message, data} = await PosRequestController.RejectReason(request?.body, request?.params?.requestId);
		if (!isEmpty(data) && error === false) {
			return sendSuccessData(response, message, data);
		}
		return sendFailureMessage(response, message, 400);
	} catch (error) {
		app_error(error, request, 'POS Reject Reason');
		return sendFailureMessage(response, error, 500);
	}
});

PosRequestRouter.get('/plan-list', async (request, response) => {
	try {
		let {error, message, data} = await PosRequestController.planList(request?.query, request?.body?.loggedUser);
		if (!isEmpty(data) && error === false) {
			return sendSuccessData(response, message, data);
		}
		return sendFailureMessage(response, message, 400);
	} catch (error) {
		app_error(error, request, 'Plan dropdown List');
		return sendFailureMessage(response, error, 500);
	}
});

Router.use('/', PosRequestRouter);

module.exports = Router;
