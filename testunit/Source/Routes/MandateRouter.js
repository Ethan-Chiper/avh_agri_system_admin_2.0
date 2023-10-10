const Express = require('express');
const Router = Express.Router();
const {isEmpty} = require('../Helpers/Utils');
const Responder = require('../App/Responder');
const Authentication = require('../Helpers/Authentication');
const Logger = require('../Helpers/Logger');
const {revokeValidation, listValidation, statsValidation} = require('../Validators/MandateValidator');
const MandateController = require('../Controller/MandateController');
const {validationResult} = require('express-validator');

const Multer = require('multer')({
	dest: 'temp',
	filename: function (request, file, callback) {
		callback(undefined, file?.originalname);
	},
	fileFilter(request, file, callback) {
		if (!/\.(csv|xlsx)$/.test(file.originalname)) {
			let error = new Error('Please upload a valid file');
			error.status = 444;
			return callback(error);
		}

		if (file.size > 20_000_000) {
			let error = new Error('File size should not exceed 20 MB (20,000,000 bytes)');
			error.status = 444;
			return callback(error);
		}
		callback(undefined, true);
	}
});

const MandateRouter = Express.Router();

MandateRouter.use(Authentication());

MandateRouter.post('/mandate-revoke/:mandateId', revokeValidation(), async (request, response) => {
	try {
		let hasErrors = validationResult(request);
		if (hasErrors.isEmpty()) {
			let {error, message, data} = await MandateController.mandateRevoke(
				request?.body?.loggedUser,
				request?.params?.mandateId
			);
			if (!isEmpty(data) && error === false) {
				Logger.app_info(request, message, data);
				return Responder.sendSuccessData(response, message, data);
			}
			Logger.app_warning(error, data || {}, message, 'Revoke Mandate');
			return Responder.sendFailureMessage(response, message, 400);
		} else {
			Logger.app_notice(hasErrors?.errors[0], request?.body?.loggedUser, 'Revoked Mandate');
			return Responder.sendFailureMessage(response, hasErrors?.errors[0]?.msg, 422);
		}
	} catch (error) {
		Logger.app_error(error, request, 'Revoke Mandate');
		return Responder.sendFailureMessage(response, error, 500);
	}
});

MandateRouter.get('/list', listValidation(), async (request, response) => {
	try {
		let hasErrors = validationResult(request);
		if (hasErrors.isEmpty()) {
			let {error, message, data} = await MandateController.list(request?.query, request?.body?.loggedUser);
			if (data !== undefined && error === false) {
				Logger.app_info(request, message, data);
				return Responder.sendSuccessData(response, message, data);
			}
			Logger.app_warning(error, data || {}, message, 'Get Mandate List');
			return Responder.sendFailureMessage(response, message, 400);
		} else {
			Logger.app_notice(hasErrors?.errors[0], request?.body?.loggedUser, 'Get Mandate List');
			return Responder.sendFailureMessage(response, hasErrors?.errors[0]?.msg, 422);
		}
	} catch (error) {
		Logger.app_error(error, request, 'Get Mandate List');
		return Responder.sendFailureMessage(response, error, 500);
	}
});

MandateRouter.get('/mandate-details/:mandateId', async (request, response) => {
	try {
		let {error, message, data} = await MandateController.mandateDetails(request, request?.body?.loggedUser);
		if (data !== undefined && error === false) {
			Logger.app_info(request, message, data);
			return Responder.sendSuccessData(response, message, data);
		} else {
			Logger.app_warning(error, data || {}, message, 'Get Mandate details');
			return Responder.sendFailureMessage(response, message, 400);
		}
	} catch (error) {
		Logger.app_error(error, request, 'Get Mandate details');
		return Responder.sendFailureMessage(response, error, 500);
	}
});

MandateRouter.get('/mandate-stats', statsValidation(), async (request, response) => {
	try {
		let hasErrors = validationResult(request);
		if (hasErrors.isEmpty()) {
			let {error, message, data} = await MandateController.mandate_stats(request, request?.body?.loggedUser);
			if (data !== undefined && error === false) {
				Logger.app_info(request, message, data);
				return Responder.sendSuccessData(response, message, data);
			}
			Logger.app_warning(error, data || {}, message, 'Get Mandate stats');
			return Responder.sendFailureMessage(response, message, 400);
		} else {
			Logger.app_notice(hasErrors?.errors[0], request, 'Get Mandate stats');
			return Responder.sendFailureMessage(response, hasErrors?.errors[0]?.msg, 422);
		}
	} catch (error) {
		Logger.app_error(error, request, 'Get Mandate stats');
		return Responder.sendFailureMessage(response, error, 500);
	}
});
MandateRouter.get('/mandate-stats/:mandate_id', statsValidation(), async (request, response) => {
	try {
		let hasErrors = validationResult(request);
		if (hasErrors.isEmpty()) {
			let {error, message, data} = await MandateController.mandate_stats_for_merchant(
				request,
				request?.body?.loggedUser
			);
			if (data !== undefined && error === false) {
				Logger.app_info(request, message, data);
				return Responder.sendSuccessData(response, message, data);
			}
			Logger.app_warning(error, data || {}, message, 'Get Mandate details');
			return Responder.sendFailureMessage(response, message, 400);
		} else {
			Logger.app_notice(hasErrors?.errors[0], request, 'Get Mandate details');
			return Responder.sendFailureMessage(response, hasErrors?.errors[0]?.msg, 422);
		}
	} catch (error) {
		Logger.app_error(error, request, 'Get Mandate details');
		return Responder.sendFailureMessage(response, error, 500);
	}
});

MandateRouter.get('/transaction/details/:transaction_id', async (request, response) => {
	try {
		let hasErrors = validationResult(request);
		if (hasErrors.isEmpty()) {
			let {error, message, data} = await MandateController.transaction_details(
				request,
				request?.body?.loggedUser
			);
			if (data !== undefined && error === false) {
				Logger.app_info(request, message, data);
				return Responder.sendSuccessData(response, message, data);
			}
			Logger.app_warning(error, data || {}, message, 'Get Mandate details');
			return Responder.sendFailureMessage(response, message, 400);
		} else {
			Logger.app_notice(hasErrors?.errors[0], request, 'Get Mandate details');
			return Responder.sendFailureMessage(response, hasErrors?.errors[0]?.msg, 422);
		}
	} catch (error) {
		Logger.app_error(error, request, 'Get Mandate details');
		return Responder.sendFailureMessage(response, error, 500);
	}
});

MandateRouter.get('/report/:mandate_id', async (request, response) => {
	return await MandateController.exportCollectionList(request, response);
});

MandateRouter.get('/report', async (request, response) => {
	return await MandateController.mandate_reports(request, response);
});

MandateRouter.get('/transaction-report', async (request, response) => {
	return await MandateController.transactionReport(request, response);
});

MandateRouter.get('/collection-report', async (request, response) => {
	return await MandateController.collectionReportByMandate(request, response);
});

MandateRouter.post('/acknowledge', Multer.single('report'), async (request, response) => {
	try {
		let hasErrors = validationResult(request);
		if (hasErrors.isEmpty()) {
			let {error, message, data} = await MandateController.mandateAccknowledge(request);
			if (data !== undefined && error === false) {
				Logger.app_info(request, message, data);
				return Responder.sendSuccessData(response, message, data);
			}
			Logger.app_warning(error, request, message, 'update accknowledge mandate');
			return Responder.sendFailureMessage(response, message, 400);
		} else {
			Logger.app_notice(hasErrors, request, 'update accknowledge mandate');
			return Responder.sendFailureMessage(response, hasErrors?.errors[0]?.msg, 422);
		}
	} catch (error) {
		Logger.app_error(error, request, 'update accknowledge mandate');
		return Responder.sendFailureMessage(response, error, 500);
	}
});

Router.use('/', MandateRouter);

module.exports = Router;
