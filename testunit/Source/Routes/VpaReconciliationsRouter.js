const Express = require('express');
const {validationResult} = require('express-validator');
const Responder = require('../App/Responder');
const VpaReconciliationsController = require('../Controller/VpaReconciliationsController');
const Authentication = require('../Helpers/Authentication');
const Logger = require('../Helpers/Logger');
const {listValidation, reportValidation, detailValidation} = require('../Validators/VpaReconciliationsValidator');
const Router = Express.Router();

const VpaReconciliationsRouter = Express.Router();

VpaReconciliationsRouter.use(Authentication());

VpaReconciliationsRouter.get('/report', reportValidation(), async (request, response) => {
	try {
		let hasErrors = validationResult(request);
		return hasErrors.isEmpty()
			? await VpaReconciliationsController.exportStoreTransactionsList(request, response)
			: Responder.sendFailureMessage(response, hasErrors?.errors[0]?.msg, 422);
	} catch (error) {
		return Responder.sendFailureMessage(response, error, 500);
	}
});
VpaReconciliationsRouter.get('/report/:reconId', detailValidation(), async (request, response) => {
	try {
		let hasErrors = validationResult(request);
		return hasErrors.isEmpty()
			? await VpaReconciliationsController.exportStoreTransactionsDetail(request?.params?.reconId, response)
			: Responder.sendFailureMessage(response, hasErrors?.errors[0]?.msg, 422);
	} catch (error) {
		return Responder.sendFailureMessage(response, error, 500);
	}
});
VpaReconciliationsRouter.get('/list', listValidation(), async (request, response) => {
	try {
		let hasErrors = validationResult(request);
		if (hasErrors.isEmpty()) {
			let {error, message, data} = await VpaReconciliationsController.storeTransactionList(request?.query);
			if (data !== undefined && error === false) {
				Logger.app_info(request, message, data);
				return Responder.sendSuccessData(response, message, data);
			}
			Logger.app_warning(error, request, message, 'Get Store Transactions List');
			return Responder.sendFailureMessage(response, message, 400);
		} else {
			Logger.app_notice(hasErrors, request, 'Get Store Transactions List');
			return Responder.sendFailureMessage(response, hasErrors?.errors[0]?.msg, 422);
		}
	} catch (error) {
		Logger.app_error(error, request, 'Get Store Transactions List');
		return Responder.sendFailureMessage(response, error, 500);
	}
});

VpaReconciliationsRouter.get('/detail/:reconId', detailValidation(), async (request, response) => {
	try {
		let hasErrors = validationResult(request);
		if (hasErrors.isEmpty()) {
			let {error, message, data} = await VpaReconciliationsController.storeTransactionDetail(request);
			if (data !== undefined && error === false) {
				Logger.app_info(request, message, data);
				return Responder.sendSuccessData(response, message, data);
			}
			Logger.app_warning(error, request, message, 'Get Store transaction detail');
			return Responder.sendFailureMessage(response, message, 400);
		} else {
			Logger.app_notice(hasErrors, request, 'Get Store transaction detail');
			return Responder.sendFailureMessage(response, hasErrors?.errors[0]?.msg, 422);
		}
	} catch (error) {
		Logger.app_error(error, request, 'Get Store transaction detail');
		return Responder.sendFailureMessage(response, error, 500);
	}
});
Router.use('/', VpaReconciliationsRouter);

module.exports = Router;
