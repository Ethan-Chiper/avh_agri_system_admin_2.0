const Express = require('express');
const Router = Express.Router();
const Responder = require('../App/Responder');
const Authentication = require('../Helpers/Authentication');
const {app_error} = require('../Helpers/Logger');
const SettlementController = require('../Controller/SettlementController');
const {isEmpty} = require('../Helpers/Utils');

const SettlementRouter = Express.Router();

SettlementRouter.use(Authentication());

SettlementRouter.get('/list', async (request, response) => {
	try {
		let {error, message, data} = await SettlementController.list(request?.body?.loggedUser, request?.query);
		if (!isEmpty(data) && error === false) {
			return Responder.sendSuccessData(response, message, data);
		}
		return Responder.sendFailureMessage(response, message, 400);
	} catch (error) {
		app_error(error, request, 'Settlement list');
		return Responder.sendFailureMessage(response, error, 500);
	}
});

SettlementRouter.get('/detail/:settlementId', async (request, response) => {
	try {
		let {error, message, data} = await SettlementController.SettlemtDetails(
			request?.body?.loggedUser,
			request.params.settlementId
		);
		if (!isEmpty(data) && error === false) {
			return Responder.sendSuccessData(response, message, data);
		}
		return Responder.sendFailureMessage(response, message, 400);
	} catch (error) {
		app_error(error, request, 'Settlement Details');
		return Responder.sendFailureMessage(response, error, 500);
	}
});

Router.use('/', SettlementRouter);

module.exports = Router;
