const Express = require('express');
const Router = Express.Router();
const {validationResult} = require('express-validator');
const AdminController = require('../Controllers/AdminController');
const Responder = require('../App/Responder');
const {isEmpty} = require('../Helpers/Utils');
const AdminValidation = require('../Validators/AdminValidation');
Router.post('/sign_up', AdminValidation.adminValidation(), async (req, res) => {
	try {
		let hasErrors = validationResult(req);
		if (hasErrors.isEmpty()) {
			let {error, message, data} = await AdminController.signUp(req, res);
			if (!isEmpty(data) && error === false) {
				return Responder.sendSuccessData(res, message, data);
			}
			return Responder.sendFailureMessage(res, message, 400);
		} else {
			return Responder.sendFailureMessage(res, hasErrors?.errors[0]?.msg, 422);
		}
	} catch (error) {
		return Responder.sendFailureMessage(res, error, 500);
	}
});
Router.get('/details/:adminId', async (req, res) => {
	try {
		let {error, message, data} = await AdminController.details(req.params.adminId);
		if (!isEmpty(data) && error === false) {
			return Responder.sendSuccessData(res, message, data);
		}
		return Responder.sendFailureMessage(res, message, 400);
	} catch (error) {
		return Responder.sendFailureMessage(res, error, 500);
	}
});

module.exports = Router;
