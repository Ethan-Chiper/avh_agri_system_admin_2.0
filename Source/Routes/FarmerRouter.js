const Express = require('express');
const Router = Express.Router();
const {validationResult} = require('express-validator');
const FarmerController = require('../Controllers/FarmerController');
const FarmerValidation = require('../Validators/FarmerValidation');
const Responder = require('../App/Responder');
const {isEmpty} = require('../Helpers/Utils');

Router.post('/sign_up', FarmerValidation.farmerValidation(), async (req, res) => {
	try {
		let hasErrors = validationResult(req);
		if (hasErrors.isEmpty()) {
			let {error, message, data} = await FarmerController.signUp(req, res);
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

Router.get('/details/:farmerId', async (req, res) => {
	try{
		let {error, message, data} = await FarmerController.details(req.params.farmerId);
		if (!isEmpty(data) && error === false) {
			return Responder.sendSuccessData(res, message, data);
		}
		return Responder.sendFailureMessage(res, message, 400);
	}catch(error) {
		return Responder.sendFailureMessage(res, error, 500);
	}
});

Router.get('/sign-in', FarmerValidation.LoginValidation(), (req, res) => {
	let hasErrors = validationResult(req);
	if (!hasErrors.isEmpty()) return Responder.sendFailureMessage(res, '' + hasErrors.errors[0].msg, 422);
	else return FarmerController.signIn(req, res);
});

Router.get('/farmer_count', (req, res) => {
	return FarmerController.formerCount(req, res);
});

module.exports = Router;
