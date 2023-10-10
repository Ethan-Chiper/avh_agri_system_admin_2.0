const Express = require('express');
const Router = Express.Router();
const {isEmpty} = require('../Helpers/Utils');
const Responder = require('../App/Responder');
const Authentication = require('../Helpers/Authentication');
const {app_error, app_notice} = require('../Helpers/Logger');
const SubUserController = require('../Controller/SubUserController');
const {createValidator, listValidator} = require('../Validators/SubUserValidator');
const {validationResult} = require('express-validator');

const SubUserRouter = Express.Router();

SubUserRouter.use(Authentication());

SubUserRouter.post('/create/:merchantId/', createValidator(), async (request, response) => {
	try {
		let hasErrors = validationResult(request);
		if (hasErrors.isEmpty()) {
			let {error, message, data} = await SubUserController.createSubUser(
				request?.body,
				request?.params?.merchantId
			);
			if (!isEmpty(data) && error === false) {
				return Responder.sendSuccessData(response, message, data);
			}
			return Responder.sendFailureMessage(response, message, 400);
		} else {
			app_notice(hasErrors.errors[0], request?.body?.loggedUser, 'Create SubUser');
			return Responder.sendFailureMessage(response, hasErrors?.errors[0]?.msg, 422);
		}
	} catch (error) {
		app_error(error, request, 'Create SubUser');
		return Responder.sendFailureMessage(response, error, 500);
	}
});

SubUserRouter.patch('/update/:subUserId', async (request, response) => {
	try {
		let {error, message, data} = await SubUserController.updateSubUser(request?.body, request?.params?.subUserId);
		if (!isEmpty(data) && error === false) {
			return Responder.sendSuccessData(response, message, data);
		}
		return Responder.sendFailureMessage(response, message, 400);
	} catch (error) {
		app_error(error, request, 'Update Sub User');
		return Responder.sendFailureMessage(response, error, 500);
	}
});

SubUserRouter.patch('/change-status/:subUserId', async (request, response) => {
	try {
		let {error, message, data} = await SubUserController.changeStatus(
			request?.body?.loggedUser,
			request?.params?.subUserId
		);
		if (!isEmpty(data) && error === false) {
			return Responder.sendSuccessData(response, message, data);
		}
		return Responder.sendFailureMessage(response, message, 400);
	} catch (error) {
		app_error(error, request, 'Update Status Sub-User');
		return Responder.sendFailureMessage(response, error, 500);
	}
});

SubUserRouter.get('/details/:subUserId', async (request, response) => {
	try {
		let {error, message, data} = await SubUserController.subUserDetails(
			request?.body?.loggedUser,
			request?.params?.subUserId
		);
		if (!isEmpty(data) && error === false) {
			return Responder.sendSuccessData(response, message, data);
		}
		return Responder.sendFailureMessage(response, message, 400);
	} catch (error) {
		app_error(error, request, 'Sub User Details');
		return Responder.sendFailureMessage(response, error, 500);
	}
});

SubUserRouter.get('/list/:merchantId?/:storeId?', listValidator(), async (request, response) => {
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
			app_notice(hasErrors, request, 'Get SubUsers List');
			return Responder.sendFailureMessage(response, hasErrors?.errors[0]?.msg, 400);
		}
	} catch (error) {
		app_error(error, request, 'Get SubUsers List');
		return Responder.sendFailureMessage(response, error, 500);
	}
});

SubUserRouter.delete('/delete/:subUserId', async (request, response) => {
	try {
		let {error, message, data} = await SubUserController.deleteSubUser(
			request?.body?.loggedUser,
			request?.params?.subUserId
		);
		if (!isEmpty(data) && error === false) {
			return Responder.sendSuccessData(response, message, data);
		}
		return Responder.sendFailureMessage(response, message, 400);
	} catch (error) {
		app_error(error, request, 'Delete Sub User');
		return Responder.sendFailureMessage(response, error, 500);
	}
});

Router.use('/', SubUserRouter);

module.exports = Router;
