const Express = require('express');
const Router = Express.Router();
const {sendFailureMessage, sendSuccessData} = require('../App/Responder');
const Authentication = require('../Helpers/Authentication');
const {app_info, app_warning, app_error} = require('../Helpers/Logger');
const TransactionController = require('../Controller/TransactionController');

const TransactionRouter = Express.Router();

TransactionRouter.use(Authentication());
TransactionRouter.get('/list/:merchantId?/:storeId?', async (request, response) => {
	try {
		let {error, message, data} = await TransactionController.list(request);
		if (data !== undefined && error === false) {
			app_info(request, data);
			return sendSuccessData(response, message, data);
		}
		app_warning(error, request, message, 'TransactionList');
		return sendFailureMessage(response, message, 400);
	} catch (error) {
		app_error(error, request, 'TransactionList');
		return sendFailureMessage(response, error, 500);
	}
});

TransactionRouter.get('/detail/:merchantId/:transactionId', async (request, response) => {
	try {
		let {error, message, data} = await TransactionController.detail(request);
		if (data !== undefined && error === false) {
			app_info(request, data);
			return sendSuccessData(response, message, data);
		}
		app_warning(error, request, message, 'TransactionDetail');
		return sendFailureMessage(response, message, 400);
	} catch (error) {
		app_error(error, request, 'TransactionDetail');
		return sendFailureMessage(response, error, 500);
	}
});

TransactionRouter.get('/export', async (request, response) => {
	try {
		let {error, message, data} = await TransactionController.export(request?.query);
		if (data !== undefined && error === false) {
			return sendSuccessData(response, message, data);
		}
		return sendFailureMessage(response, message, 400);
	} catch (error) {
		return sendFailureMessage(response, error, 500);
	}
});

Router.use('/', TransactionRouter);

module.exports = Router;
