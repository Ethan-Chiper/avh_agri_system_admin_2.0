/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const Express = require('express');
const Router = Express.Router();
const {validationResult} = require('express-validator');
const FarmerController = require('../Controllers/FarmerController');
const FarmerValidation = require('../Validators/FarmerValidation');
const multer = require('multer');
const winston = require('winston');
const logger = winston.createLogger({
	transports: [new winston.transports.Console()]
});
const Responder = require('../App/Responder');

Router.post('/sign_up', FarmerValidation.farmerValidation(), (req, res) => {
	let hasErrors = validationResult(req);
	if (!hasErrors.isEmpty()) return Responder.sendFailureMessage(res, '' + hasErrors.errors[0].msg, 422);
	else return FarmerController.signUp(req, res);
});

Router.get('/details/:farmerId', (req, res) => {
	return FarmerController.details(req.params.farmerId, res);
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
