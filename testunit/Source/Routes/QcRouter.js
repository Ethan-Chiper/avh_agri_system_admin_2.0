/* eslint-disable node/no-missing-require */
const Express = require('express');
const Router = Express.Router();
const Responder = require('../App/Responder');
const Authentication = require('../Helpers/Authentication');
const {app_error, app_notice} = require('../Helpers/Logger');
const MerchantController = require('../Controller/MerchantController');
const VpaController = require('../Controller/VpaController');
const QcController = require('../Controller/QcController');
const {validationResult} = require('express-validator');
const {isEmpty} = require('../Helpers/Utils');
const BankController = require('../Controller/BankController');
const {bankListValidation} = require('../Validators/BankValidation');
const StoreController = require('../Controller/StoreController');
const {listValidator: storelistValidator} = require('../Validators/StoreValidator');
const {listValidation} = require('../Validators/SubMerchantValidator');
const SubMerchantController = require('../Controller/SubMerchantController');
const {listValidator: subuserValidator} = require('../Validators/SubUserValidator');
const {updateCategoryValidator, merchantApproveValidator, approveVpa} = require('../Validators/QcValidator');
const SubUserController = require('../Controller/SubUserController');
const PropertiesController = require('../Controller/PropertiesController');

const QcRouter = Express.Router();

QcRouter.use(Authentication());

QcRouter.get('/details/:merchantId', async (request, response) => {
	try {
		let {error, message, data} = await MerchantController.merchantDetails(
			request?.body?.loggedUser,
			request?.params?.merchantId
		);
		if (!isEmpty(data) && error === false) {
			return Responder.sendSuccessData(response, message, data);
		}
		return Responder.sendFailureMessage(response, message, 400);
	} catch (error) {
		app_error(error, request, 'Merchant Details QC');
		return Responder.sendFailureMessage(response, error, 500);
	}
});

QcRouter.get('/vpa-list/:merchantId?/:storeId?', async (request, response) => {
	try {
		let {error, message, data} = await VpaController.list(
			request?.body?.loggedUser,
			request?.query,
			request?.params
		);
		if (data && error === false) {
			return Responder.sendSuccessData(response, message, data);
		}
		return Responder.sendFailureMessage(response, message, 400);
	} catch (error) {
		app_error(error, request, 'Get VPA List QC');
		return Responder.sendFailureMessage(response, error, 500);
	}
});

QcRouter.get('/store/list/:merchantId?', storelistValidator(), async (request, response) => {
	try {
		let hasErrors = validationResult(request);
		if (hasErrors.isEmpty()) {
			let {error, message, data} = await StoreController.listStores(
				request?.query,
				request?.params?.merchantId,
				request?.body?.loggedUser
			);
			if (data !== undefined && error === false) {
				return Responder.sendSuccessData(response, message, data);
			}
			return Responder.sendFailureMessage(response, message, 400);
		} else {
			app_notice(hasErrors?.errors[0], request?.body?.loggedUser, 'Get Store List QC');
			return Responder.sendFailureMessage(response, hasErrors?.errors[0]?.msg, 422);
		}
	} catch (error) {
		app_error(error, request, 'Get Store List QC');
		return Responder.sendFailureMessage(response, error, 500);
	}
});

QcRouter.get('/submerchant/list/:merchantId?', listValidation(), async (request, response) => {
	try {
		let hasErrors = validationResult(request);
		if (hasErrors.isEmpty()) {
			let {error, message, data} = await SubMerchantController.list(
				request?.body?.loggedUser,
				request?.query,
				request?.params?.merchantId
			);
			if (!isEmpty(data) && error === false) {
				return Responder.sendSuccessData(response, message, data);
			}
			return Responder.sendFailureMessage(response, message, 400);
		} else {
			app_notice(hasErrors?.errors[0], request?.body?.loggedUser, 'Get SubMerchant List QC');
			return Responder.sendFailureMessage(response, hasErrors?.errors[0]?.msg, 422);
		}
	} catch (error) {
		app_error(error, request, 'Get SubMerchant List QC');
		return Responder.sendFailureMessage(response, error, 500);
	}
});

QcRouter.get('/bank/list/:merchantId?', bankListValidation(), async (request, response) => {
	try {
		let hasErrors = validationResult(request);
		if (hasErrors.isEmpty()) {
			let {error, message, data} = await BankController.list(
				request?.body?.loggedUser,
				request?.query,
				request?.params?.merchantId
			);
			if (data && error === false) {
				return Responder.sendSuccessData(response, message, data);
			}
			return Responder.sendFailureMessage(response, message, 400);
		} else {
			app_notice(hasErrors?.errors[0], request?.body?.loggedUser, 'Get Bank List QC');
			return Responder.sendFailureMessage(response, hasErrors?.errors[0].msg, 422);
		}
	} catch (error) {
		app_error(error, request, 'Get Bank List QC');
		return Responder.sendFailureMessage(response, error, 500);
	}
});

QcRouter.get('/subuser/list/:merchantId?/:storeId?', subuserValidator(), async (request, response) => {
	try {
		let hasErrors = validationResult(request);
		if (hasErrors.isEmpty()) {
			let {error, message, data} = await SubUserController.getSubUsers(
				request?.query,
				request?.params?.merchantId,
				request?.params?.storeId,
				request?.body?.loggedUser
			);
			if (data !== undefined && error === false) {
				return Responder.sendSuccessData(response, message, data);
			}
			return Responder.sendFailureMessage(response, message, 400);
		} else {
			app_notice(hasErrors?.errors[0], request?.body?.loggedUser, 'Get SubUsers List QC');
			return Responder.sendFailureMessage(response, hasErrors?.errors[0]?.msg, 400);
		}
	} catch (error) {
		app_error(error, request, 'Get SubUsers List QC');
		return Responder.sendFailureMessage(response, error, 500);
	}
});

QcRouter.get('/category/list', async (request, response) => {
	try {
		let {error, message, data} = await PropertiesController.getCategories(request?.query);
		if (!isEmpty(data) && error === false) {
			return Responder.sendSuccessData(response, message, data);
		}
		return Responder.sendFailureMessage(response, message, 400);
	} catch (error) {
		app_error(error, request, 'Get Category List QC');
		return Responder.sendFailureMessage(response, error, 500);
	}
});

QcRouter.get('/sub-category-list', async (request, response) => {
	try {
		let {error, message, data} = await PropertiesController.getSubCategories(
			request?.body?.loggedUser,
			request?.query
		);
		if (data && error === false) {
			return Responder.sendSuccessData(response, message, data);
		}
		return Responder.sendFailureMessage(response, message, 400);
	} catch (error) {
		app_error(error, request, 'List sub categories QC');
		return Responder.sendFailureMessage(response, error, 500);
	}
});

QcRouter.patch('/approve-vpa/:merchantId/:storeId', approveVpa(), async (request, response) => {
	try {
		let hasErrors = validationResult(request);
		if (hasErrors.isEmpty()) {
			let {error, message, data} = await QcController.approveVpa(
				request?.body,
				request?.params?.merchantId,
				request?.params?.storeId
			);
			if (!isEmpty(data) && error === false) {
				return Responder.sendSuccessData(response, message, data);
			}
			return Responder.sendFailureMessage(response, message, 400);
		}
		app_notice(hasErrors?.errors[0], request?.body?.loggedUser, 'Approve VPA QC');
		return Responder.sendFailureMessage(response, hasErrors?.errors[0].msg, 422);
	} catch (error) {
		app_error(error, request, 'Approve VPA QC');
		return Responder.sendFailureMessage(response, error, 500);
	}
});

QcRouter.patch('/update-category/:storeId?', updateCategoryValidator(), async (request, response) => {
	try {
		let hasErrors = validationResult(request);
		if (hasErrors.isEmpty()) {
			let {error, message, data} = await QcController.updateCategory(request?.body, request?.params?.storeId);
			if (data !== undefined && error === false) {
				return Responder.sendSuccessData(response, message, data);
			}
			return Responder.sendFailureMessage(response, message, 400);
		} else {
			app_notice(hasErrors?.errors[0], request?.body?.loggedUser, 'Update store Category QC');
			return Responder.sendFailureMessage(response, hasErrors?.errors[0]?.msg, 400);
		}
	} catch (error) {
		app_error(error, request, 'Update store Category QC');
		return Responder.sendFailureMessage(response, error, 500);
	}
});

QcRouter.patch('/approve-document/:merchantId', async (request, response) => {
	try {
		let {error, message, data} = await QcController.approveDocument(request?.body, request.params.merchantId);
		if (!isEmpty(data) && error === false) {
			return Responder.sendSuccessData(response, message, data);
		}
		return Responder.sendFailureMessage(response, message, 400);
	} catch (error) {
		app_error(error, request, 'Approve merchant document QC');
		return Responder.sendFailureMessage(response, error, 500);
	}
});

QcRouter.patch('/approve-merchant', merchantApproveValidator(), async (request, response) => {
	try {
		let hasErrors = validationResult(request);
		if (hasErrors.isEmpty()) {
			let {error, message, data} = await QcController.approveMerchant(request?.body);
			if (data !== undefined && error === false) {
				return Responder.sendSuccessData(response, message, data);
			}
			return Responder.sendFailureMessage(response, message, 400);
		} else {
			app_notice(hasErrors?.errors[0], request?.body?.loggedUser, 'Approve merchant QC');
			return Responder.sendFailureMessage(response, hasErrors?.errors[0]?.msg, 400);
		}
	} catch (error) {
		app_error(error, request, 'Approve merchant QC');
		return Responder.sendFailureMessage(response, error, 500);
	}
});

QcRouter.get('/get-document-name-matching-percentage/:merchantId', async (request, response) => {
	try {
		let {error, message, data} = await QcController.documentNameMatching(
			request?.body?.loggedUser,
			request?.params?.merchantId
		);
		if (data && error === false) {
			return Responder.sendSuccessData(response, message, data);
		}
		return Responder.sendFailureMessage(response, message, 400);
	} catch (error) {
		app_error(error, request, 'Get name matching percentage QC');
		return Responder.sendFailureMessage(response, error, 500);
	}
});

Router.use('/', QcRouter);

module.exports = Router;
