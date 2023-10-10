const Express = require('express');
const Router = Express.Router();
const LoginController = require('../Controller/LoginController');
const {loginValidation, verifyOtpValidation} = require('../Validators/AuthValidator');
const {validationResult} = require('express-validator');
const Responder = require('../App/Responder');
const {isEmpty} = require('../Helpers/Utils');
const {app_error, app_notice} = require('../Helpers/Logger');
const AdminController = require('../Controller/AdminController');

Router.post('/login', loginValidation(), async (request, response) => {
	try {
		let hasErrors = validationResult(request);
		if (hasErrors.isEmpty()) {
			let {error, message, data} = await LoginController.login(request?.body, request?.useragent['source']);

			if (error === false) {
				return Responder.sendSuccessData(response, message, data);
			}
			return Responder.sendFailureMessage(response, message, 400);
		} else {
			app_notice(hasErrors.errors[0], request?.body?.loggedUser, 'Admin Login Route');
			return Responder.sendFailureMessage(response, hasErrors?.errors[0]?.msg, 422);
		}
	} catch (error) {
		app_error(error, request, 'Admin Login Route');
		return Responder.sendFailureMessage(response, error, 500);
	}
});

Router.get('/route-list/:adminId?', async (request, response) => {
	try {
		let {error, message, data} = await AdminController.routesList(request);
		if (!error) return Responder.sendSuccessData(response, message, data);
		return Responder.sendFailureMessage(response, message, 400);
	} catch (error) {
		app_error(error, request, 'Route List');
		return Responder.sendFailureMessage(response, error, 500);
	}
});

Router.post('/login/verify-otp', verifyOtpValidation(), async (request, response) => {
	try {
		let hasErrors = validationResult(request);
		if (hasErrors.isEmpty()) {
			let {error, message, data} = await LoginController.loginVerifyWithOtp(
				request?.body,
				request?.useragent['source']
			);

			if (!isEmpty(data) && error === false) {
				return Responder.sendSuccessData(response, message, data);
			}
			return Responder.sendFailureMessage(response, message, 400);
		} else {
			app_notice(hasErrors.errors[0], request?.body?.loggedUser, 'Admin Login With OTP');
			return Responder.sendFailureMessage(response, hasErrors?.errors[0]?.msg, 422);
		}
	} catch (error) {
		app_error(error, request, 'Admin Login With OTP');
		return Responder.sendFailureMessage(response, error, 500);
	}
});

Router.get('/generate-token', async (request, response) => {
	try {
		let {error, message, data} = await AdminController.getCsrfToken(request?.csrfToken());
		if (!isEmpty(data) && error === false) return Responder.sendSuccessData(response, message, data);
		return Responder.sendFailureMessage(response, message, 400);
	} catch (error) {
		app_error(error, request, 'Generate Token');
		return Responder.sendFailureMessage(response, error, 500);
	}
});

module.exports = Router;
