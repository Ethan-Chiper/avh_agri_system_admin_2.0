const Express = require('express');
const Router = Express.Router();
const {isEmpty} = require('../Helpers/Utils');
const Responder = require('../App/Responder');
const AdminController = require('../Controller/AdminController');
const Authentication = require('../Helpers/Authentication');
const {app_error, app_notice} = require('../Helpers/Logger');
const {validationResult} = require('express-validator');
const {
	validateCreateAdmin,
	verifyAdminId,
	verifyWhitelistRoutes,
	validateListSubAdmin
} = require('../Validators/AdminValidators');

const AdminRouter = Express.Router();

AdminRouter.use(Authentication());

AdminRouter.get('/get-details/:adminId?', async (request, response) => {
	try {
		let {error, message, data} = await AdminController.getDetails(request?.body, request?.params?.adminId);
		if (!isEmpty(data) && error === false) {
			return Responder.sendSuccessData(response, message, data);
		}
		return Responder.sendFailureMessage(response, message, 400);
	} catch (error) {
		app_error(error, request, 'Get Admin Details');
		return Responder.sendFailureMessage(response, error, 500);
	}
});

AdminRouter.get('/list', validateListSubAdmin(), async (request, response) => {
	try {
		let hasErrors = validationResult(request);
		if (hasErrors.isEmpty()) {
			let {error, message, data} = await AdminController.list(request?.body?.loggedUser, request?.query);
			if (data !== undefined && error === false) {
				return Responder.sendSuccessData(response, message, data);
			}
			return Responder.sendFailureMessage(response, message, 400);
		} else {
			app_notice(hasErrors?.errors[0], request?.body?.loggedUser, 'Sub Admin List');
			return Responder.sendFailureMessage(response, hasErrors?.errors[0]?.msg, 422);
		}
	} catch (error) {
		app_error(error, request, 'Sub Admin List');
		return Responder.sendFailureMessage(response, error, 500);
	}
});

AdminRouter.post('/create', [validateCreateAdmin(), verifyWhitelistRoutes()], async (request, response) => {
	try {
		let hasErrors = validationResult(request);
		if (hasErrors.isEmpty()) {
			let {error, message, data} = await AdminController.createAdmin(request.body);
			if (!isEmpty(data) && error === false) return Responder.sendSuccessData(response, message, data);
			return Responder.sendFailureMessage(response, message, 400);
		} else {
			app_notice(hasErrors?.errors[0], request?.body?.loggedUser, 'Sub Admin Create');
			return Responder.sendFailureMessage(response, hasErrors?.errors[0]?.msg, 422);
		}
	} catch (error) {
		app_error(error, request, 'Sub Admin Create');
		return Responder.sendFailureMessage(response, error, 500);
	}
});

AdminRouter.patch('/modify-acls', [verifyAdminId(), verifyWhitelistRoutes()], async (request, response) => {
	try {
		let hasErrors = validationResult(request);
		if (hasErrors.isEmpty()) {
			let {error, message, data} = await AdminController.modifyGroupNames(request?.body);
			if (!error) return Responder.sendSuccessMessage(response, message, data);
			return Responder.sendFailureMessage(response, message, 400);
		} else {
			app_notice(hasErrors?.errors[0], request?.body?.loggedUser, 'ACL Modified');
			return Responder.sendFailureMessage(response, hasErrors?.errors[0]?.msg, 422);
		}
	} catch (error) {
		app_error(error, request, 'ACL Modified');
		return Responder.sendFailureMessage(response, error, 500);
	}
});

AdminRouter.post('/get-presigned-url', async (request, response) => {
	try {
		let {error, message, data} = await AdminController.getPreSignedUrl(request.body);
		if (!error) return Responder.sendSuccessData(response, message, data);
		return Responder.sendFailureMessage(response, message, 400);
	} catch (error) {
		app_error(error, request, 'Get Presigned URL');
		return Responder.sendFailureMessage(response, error, 500);
	}
});

AdminRouter.patch('/change-status/:adminId', async (request, response) => {
	try {
		let {error, message, data} = await AdminController.changeStatus(
			request?.body?.loggedUser,
			request?.params?.adminId
		);
		if (!isEmpty(data) && error === false) {
			return Responder.sendSuccessData(response, message, data);
		}
		return Responder.sendFailureMessage(response, message, 400);
	} catch (error) {
		app_error(error, request, 'Change Status');
		return Responder.sendFailureMessage(response, error, 500);
	}
});

Router.use('/', AdminRouter);

module.exports = Router;
