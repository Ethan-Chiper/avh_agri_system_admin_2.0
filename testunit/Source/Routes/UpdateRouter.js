const Express = require('express');
const Router = Express.Router();
const {isEmpty} = require('../Helpers/Utils');
const Responder = require('../App/Responder');
const Authentication = require('../Helpers/Authentication');
const {app_notice, app_error} = require('../Helpers/Logger');
const UpdateController = require('../Controller/UpdateController');
const {
	storeNameValidate,
	outletTypeValidate,
	merchantTypeValidate,
	addressValidate,
	panValidation,
	addressProofValidation,
	businessTypeUpdateValidation,
	partnerUpdateValidation
} = require('../Validators/UpdateValidator');
const {validationResult} = require('express-validator');
const Multer = require('multer')({
	fileFilter(request, file, callback) {
		if (!/\.(pdf|jpg|jpeg|png)$/.test(file.originalname)) {
			let error = new Error('Please upload a valid file');
			error.status = 444;
			return callback(error);
		}

		if (file.size > 5_000_000) {
			let error = new Error('File size should not exceed 5 MB (5,000,000 bytes)');
			error.status = 444;
			return callback(error);
		}
		callback(undefined, true);
	}
});

Router.use(Authentication());

Router.patch('/store_name/:merchantId/:storeId', storeNameValidate(), async (request, response) => {
	try {
		let hasErrors = validationResult(request);
		if (hasErrors.isEmpty()) {
			let {error, message, data} = await UpdateController.storeNameUpdate(
				request?.body,
				request?.params?.merchantId,
				request?.params?.storeId,
				request?.user
			);
			if (!isEmpty(data) && error === false) {
				return Responder.sendSuccessData(response, message, data);
			}
			return Responder.sendFailureMessage(response, message, 400);
		} else {
			app_notice(hasErrors?.errors[0], request?.body?.loggedUser, 'Update Store Name');
			return Responder.sendFailureMessage(response, hasErrors?.errors[0]?.msg, 422);
		}
	} catch (error) {
		app_error(error, request, 'Update Store Name');
		return Responder.sendFailureMessage(response, error, 500);
	}
});

Router.patch('/outlet_type/:merchantId/:storeId', outletTypeValidate(), async (request, response) => {
	try {
		let hasErrors = validationResult(request);
		if (hasErrors.isEmpty()) {
			let {error, message, data} = await UpdateController.outletTypeUpdate(
				request?.body,
				request?.params?.merchantId,
				request?.params?.storeId,
				request?.user
			);
			if (!isEmpty(data) && error === false) {
				return Responder.sendSuccessData(response, message, data);
			}
			return Responder.sendFailureMessage(response, message, 400);
		} else {
			app_notice(hasErrors?.errors[0], request?.user?.loggedUser, 'Update Outlet Type');
			return Responder.sendFailureMessage(response, hasErrors?.errors[0]?.msg, 422);
		}
	} catch (error) {
		app_error(error, request, 'Update Outlet Type');
		return Responder.sendFailureMessage(response, error, 500);
	}
});

Router.patch('/partner/:merchantId', partnerUpdateValidation(), async (request, response) => {
	try {
		let hasErrors = validationResult(request);
		if (hasErrors.isEmpty()) {
			let {error, message, data} = await UpdateController.partnerUpdate(
				request?.body,
				request?.params?.merchantId,
				request?.user
			);
			if (!isEmpty(data) && error === false) {
				return Responder.sendSuccessData(response, message, data);
			}
			return Responder.sendFailureMessage(response, message, 400);
		} else {
			app_notice(hasErrors?.errors[0], request?.user?.loggedUser, 'Update Partner');
			return Responder.sendFailureMessage(response, hasErrors?.errors[0]?.msg, 422);
		}
	} catch (error) {
		app_error(error, request, 'Update Partner');
		return Responder.sendFailureMessage(response, error, 500);
	}
});

Router.patch('/business-type/:merchantId', businessTypeUpdateValidation(), async (request, response) => {
	try {
		let hasErrors = validationResult(request);
		if (hasErrors.isEmpty()) {
			let {error, message, data} = await UpdateController.businessTypeUpdate(
				request?.body,
				request?.params?.merchantId,
				request?.user
			);
			if (!isEmpty(data) && error === false) {
				return Responder.sendSuccessData(response, message, data);
			}
			return Responder.sendFailureMessage(response, message, 400);
		} else {
			app_notice(hasErrors?.errors[0], request?.user?.loggedUser, 'Update Business Type');
			return Responder.sendFailureMessage(response, hasErrors?.errors[0]?.msg, 422);
		}
	} catch (error) {
		app_error(error, request, 'Update Business Type');
		return Responder.sendFailureMessage(response, error, 500);
	}
});

Router.patch('/merchant_type/:merchantId', Multer.any(), merchantTypeValidate(), async (request, response) => {
	try {
		let hasErrors = validationResult(request);
		if (hasErrors.isEmpty()) {
			let {error, message, data} = await UpdateController.merchantTypeUpdate(
				request?.body,
				request?.params?.merchantId,
				request?.files,
				request?.user
			);
			if (!isEmpty(data) && error === false) {
				return Responder.sendSuccessData(response, message, data);
			}
			return Responder.sendFailureMessage(response, message, 400);
		} else {
			app_notice(hasErrors?.errors[0], request?.body?.loggedUser, 'Update Merchant Type');
			return Responder.sendFailureMessage(response, hasErrors?.errors[0]?.msg, 422);
		}
	} catch (error) {
		app_error(error, request, 'Update Merchant Type');
		return Responder.sendFailureMessage(response, error, 500);
	}
});

Router.patch('/address/:merchantId/:storeId?', addressValidate(), async (request, response) => {
	try {
		let hasErrors = validationResult(request);
		if (hasErrors.isEmpty()) {
			let {error, message, data} = await UpdateController.addressUpdate(
				request?.body,
				request?.params?.merchantId,
				request?.params?.storeId,
				request?.user
			);
			if (!isEmpty(data) && error === false) {
				return Responder.sendSuccessData(response, message, data);
			}
			return Responder.sendFailureMessage(response, message, 400);
		} else {
			app_notice(hasErrors?.errors[0], request?.body?.loggedUser, 'Update Address');
			return Responder.sendFailureMessage(response, hasErrors?.errors[0]?.msg, 422);
		}
	} catch (error) {
		app_error(error, request, 'Update Address');
		return Responder.sendFailureMessage(response, error, 500);
	}
});

Router.patch('/pan/:merchantId', Multer.any(), panValidation(), async (request, response) => {
	try {
		let hasErrors = validationResult(request);
		if (hasErrors.isEmpty()) {
			let {error, message, data} = await UpdateController.panUpdate(
				request?.body,
				request?.files,
				request?.params?.merchantId,
				request?.user
			);
			if (!isEmpty(data) && error === false) {
				return Responder.sendSuccessData(response, message, data);
			}
			return Responder.sendFailureMessage(response, message, 400);
		} else {
			app_notice(hasErrors?.errors[0], request?.body?.loggedUser, 'Update PAN');
			return Responder.sendFailureMessage(response, hasErrors?.errors[0]?.msg, 422);
		}
	} catch (error) {
		app_error(error, request, 'Update PAN');
		return Responder.sendFailureMessage(response, error, 500);
	}
});

Router.patch(
	'/address_proof/:merchantId',
	Multer.fields([
		{name: 'fileFront', maxCount: 1},
		{name: 'fileBack', maxCount: 1}
	]),
	addressProofValidation(),
	async (request, response) => {
		try {
			let hasErrors = validationResult(request);
			if (hasErrors.isEmpty()) {
				let {error, message, data} = await UpdateController.addressProofUpdate(
					request?.body,
					request?.files,
					request?.params?.merchantId,
					request?.user
				);
				if (!isEmpty(data) && error === false) {
					return Responder.sendSuccessData(response, message, data);
				}
				return Responder.sendFailureMessage(response, message, 400);
			} else {
				app_notice(hasErrors?.errors[0], request?.body?.loggedUser, 'Update Address Proof');
				return Responder.sendFailureMessage(response, hasErrors?.errors[0]?.msg, 422);
			}
		} catch (error) {
			app_error(error, request, 'Update Address Proof');
			return Responder.sendFailureMessage(response, error, 500);
		}
	}
);

Router.patch(
	'/store-images/:merchantId/:storeId',
	Multer.fields([
		{name: 'store_front', maxCount: 1},
		{name: 'store_name_board', maxCount: 1},
		{name: 'store_inside', maxCount: 1}
	]),
	async (request, response) => {
		try {
			let {error, message, data} = await UpdateController.storeImageUpdate(
				request?.files,
				request?.params?.merchantId,
				request?.params?.storeId,
				request?.user
			);
			if (!isEmpty(data) && error === false) {
				return Responder.sendSuccessData(response, message, data);
			}
			return Responder.sendFailureMessage(response, message, 400);
		} catch (error) {
			app_error(error, request, 'Update Store Images');
			return Responder.sendFailureMessage(response, error, 500);
		}
	}
);

module.exports = Router;
