/* eslint-disable unicorn/prevent-abbreviations */
const Express = require('express');
const Router = Express.Router();
const {validationResult} = require('express-validator');
const FarmerController = require('../Controllers/FarmerController');
const FarmerValidation = require('../Validators/FarmerValidation');
const Responder = require('../App/Responder');
const {isEmpty} = require('../Helpers/Utils');

Router.post('/sign_up', FarmerValidation.farmerValidation(), async (request, res) => {
	try {
		let hasErrors = validationResult(request);
		if (hasErrors.isEmpty()) {
			let {error, message, data} = await FarmerController.signUp(request, res);
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

Router.get('/details/:farmerId', async (request, res) => {
	try{
		let {error, message, data} = await FarmerController.details(request.params.farmerId);
		if (!isEmpty(data) && error === false) {
			return Responder.sendSuccessData(res, message, data);
		}
		return Responder.sendFailureMessage(res, message, 400);
	}catch(error) {
		return Responder.sendFailureMessage(res, error, 500);
	}
});

Router.get('/sign-in', FarmerValidation.LoginValidation(), (request, res) => {
	let hasErrors = validationResult(request);
	return hasErrors.isEmpty() ? FarmerController.signIn(request, res) : Responder.sendFailureMessage(res, '' + hasErrors.errors[0].msg, 422);
});

Router.get('/farmer_count', (request, res) => {
	return FarmerController.formerCount(request, res);
});

module.exports = Router;
