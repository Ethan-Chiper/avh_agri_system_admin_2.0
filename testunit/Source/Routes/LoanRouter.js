const Express = require('express');
const Router = Express.Router();
const Responder = require('../App/Responder');
const Authentication = require('../Helpers/Authentication');
const LoanController = require('../Controller/LoanController');
const {app_error, app_notice} = require('../Helpers/Logger');
const {listValidator} = require('../Validators/LoanValidators');
const {validationResult} = require('express-validator');

const LoanRouter = Express.Router();

LoanRouter.use(Authentication());

LoanRouter.get('/details/:merchantId/:loanId', async (request, response) => {
	try {
		let {error, message, data} = await LoanController.loanDetails(
			request?.body?.loggedUser,
			request?.params?.merchantId,
			request?.params?.loanId
		);
		if (data !== undefined && error === false) {
			return Responder.sendSuccessData(response, message, data);
		}
		return Responder.sendFailureMessage(response, message, 400);
	} catch (error) {
		app_error(error, request, 'Loan Details');
		return Responder.sendFailureMessage(response, error, 500);
	}
});

LoanRouter.get('/list', listValidator(), async (request, response) => {
	try {
		let hasErrors = validationResult(request);
		if (hasErrors.isEmpty()) {
			let {error, message, data} = await LoanController.loanList(request?.query, request?.body?.loggedUser);
			if (data !== undefined && error === false) {
				return Responder.sendSuccessData(response, message, data);
			}
			return Responder.sendFailureMessage(response, message, 400);
		} else {
			app_notice(hasErrors.errors[0], request?.body?.loggedUser, 'Get Loan List');
			return Responder.sendFailureMessage(response, hasErrors?.errors[0]?.msg, 422);
		}
	} catch (error) {
		app_error(error, request, 'Get Loan List');
		return Responder.sendFailureMessage(response, error, 500);
	}
});

LoanRouter.post('/update', async (request, response) => {
	try {
		let hasErrors = validationResult(request);
		if (hasErrors.isEmpty()) {
			let {error, message, data} = await LoanController.update(request);
			if (error === false) {
				return Responder.sendSuccessData(response, message, data);
			}
			return Responder.sendFailureMessage(response, message, 400);
		} else {
			app_notice(hasErrors.errors[0], request?.body?.loggedUser, 'Update Loan');
			return Responder.sendFailureMessage(response, hasErrors?.errors[0]?.msg, 422);
		}
	} catch (error) {
		app_error(error, request, 'Update Loan');
		return Responder.sendFailureMessage(response, error, 500);
	}
});

LoanRouter.get('/upi-mandate/settlement/list', async (request, response) => {
	try {
		let {error, message, data} = await LoanController.settlementList(request?.query, request?.body?.loggedUser);
		if (data !== undefined && error === false) {
			return Responder.sendSuccessData(response, message, data);
		}
		return Responder.sendFailureMessage(response, message, 400);
	} catch (error) {
		app_error(error, request, 'Loan Settlement List');
		return Responder.sendFailureMessage(response, error, 500);
	}
});

LoanRouter.get('/upi-mandate/settlement/detail/:settlementId', async (request, response) => {
	try {
		let {error, message, data} = await LoanController.settlementDetail(
			request?.query,
			request?.params?.settlementId,
			request?.body?.loggedUser
		);
		if (data !== undefined && error === false) {
			return Responder.sendSuccessData(response, message, data);
		}
		return Responder.sendFailureMessage(response, message, 400);
	} catch (error) {
		app_error(error, request, 'Loan Settlement Detail');
		return Responder.sendFailureMessage(response, error, 500);
	}
});

LoanRouter.post('/upi-mandate/re-register', async (request, response) => {
	try {
		let {error, message, data} = await LoanController.reRegister(request, request?.body);
		if (error === false) {
			return Responder.sendSuccessData(response, message, data);
		}
		return Responder.sendFailureMessage(response, message, 400);
	} catch (error) {
		app_error(error, request, 'Loan re-register');
		return Responder.sendFailureMessage(response, error, 500);
	}
});

LoanRouter.get('/stats', async (request, response) => {
	try {
		let {error, message, data} = await LoanController.loanStats(request?.query, request?.body?.loggedUser);
		if (data !== undefined && error === false) {
			return Responder.sendSuccessData(response, message, data);
		}
		return Responder.sendFailureMessage(response, message, 400);
	} catch (error) {
		app_error(error, request, 'Loan stats data');
		return Responder.sendFailureMessage(response, error, 500);
	}
});

LoanRouter.get('/collection-stats', async (request, response) => {
	try {
		let {error, message, data} = await LoanController.loanCollectionStats(
			request?.query,
			request?.body?.loggedUser
		);
		if (data !== undefined && error === false) {
			return Responder.sendSuccessData(response, message, data);
		}
		return Responder.sendFailureMessage(response, message, 400);
	} catch (error) {
		app_error(error, request, 'Loan collection stats data');
		return Responder.sendFailureMessage(response, error, 500);
	}
});

LoanRouter.get('/emi/list/:merchantId/:loanId', async (request, response) => {
	try {
		let {error, message, data} = await LoanController.emiList(
			request?.query,
			request?.params?.merchantId,
			request?.params?.loanId,
			request?.body?.loggedUser
		);
		if (data !== undefined && error === false) {
			return Responder.sendSuccessData(response, message, data);
		}
		return Responder.sendFailureMessage(response, message, 400);
	} catch (error) {
		app_error(error, request, 'Loan Emi List');
		return Responder.sendFailureMessage(response, error, 500);
	}
});

LoanRouter.get('/emi/detail/:emiId', async (request, response) => {
	try {
		let {error, message, data} = await LoanController.emiDetail(request?.params?.emiId, request?.body?.loggedUser);
		if (data !== undefined && error === false) {
			return Responder.sendSuccessData(response, message, data);
		}
		return Responder.sendFailureMessage(response, message, 400);
	} catch (error) {
		app_error(error, request, 'Loan Emi Detail');
		return Responder.sendFailureMessage(response, error, 500);
	}
});

LoanRouter.post('/emi/record-payment', async (request, response) => {
	try {
		let {error, message, data} = await LoanController.emiRecordPayment(request, request?.body);
		if (error === false) {
			return Responder.sendSuccessData(response, message, data);
		}
		return Responder.sendFailureMessage(response, message, 400);
	} catch (error) {
		app_error(error, request, 'Loan Emi Record Payment');
		return Responder.sendFailureMessage(response, error, 500);
	}
});

LoanRouter.get('/emi/list-all', async (request, response) => {
	try {
		let {error, message, data} = await LoanController.emiListAll(request?.query, request?.body?.loggedUser);
		if (data !== undefined && error === false) {
			return Responder.sendSuccessData(response, message, data);
		}
		return Responder.sendFailureMessage(response, message, 400);
	} catch (error) {
		app_error(error, request, 'Loan Emi All List');
		return Responder.sendFailureMessage(response, error, 500);
	}
});

LoanRouter.get('/emi/stats/:merchant_id/:loan_id', async (request, response) => {
	try {
		let {error, message, data} = await LoanController.emiStats(
			request?.params?.merchant_id,
			request?.params?.loan_id,
			request?.body?.loggedUser
		);
		if (data !== undefined && error === false) {
			return Responder.sendSuccessData(response, message, data);
		}
		return Responder.sendFailureMessage(response, message, 400);
	} catch (error) {
		app_error(error, request, 'Loan Emi Stats');
		return Responder.sendFailureMessage(response, error, 500);
	}
});

LoanRouter.post('/emi/reschedule', async (request, response) => {
	try {
		let {error, message, data} = await LoanController.emiReschedule(request, request?.body);
		if (error === false) {
			return Responder.sendSuccessData(response, message, data);
		}
		return Responder.sendFailureMessage(response, message, 400);
	} catch (error) {
		app_error(error, request, 'Loan Emi Reschedule');
		return Responder.sendFailureMessage(response, error, 500);
	}
});

LoanRouter.post('/update-loan-status', async (request, response) => {
	try {
		let {error, message, data} = await LoanController.updateLoanStatus(request);
		if (error === false) {
			return Responder.sendSuccessData(response, message, data);
		}
		return Responder.sendFailureMessage(response, message, 400);
	} catch (error) {
		app_error(error, request, 'Loan Status Update');
		return Responder.sendFailureMessage(response, error, 500);
	}
});

Router.get('/export/list', async (request, response) => {
	return await LoanController.exportList(request, response);
});

Router.get('/export/collection', async (request, response) => {
	return await LoanController.exportCollection(request, response);
});

Router.get('/export/settlement', async (request, response) => {
	return await LoanController.settlementListExport(request, response);
});

Router.use('/', LoanRouter);

module.exports = Router;
