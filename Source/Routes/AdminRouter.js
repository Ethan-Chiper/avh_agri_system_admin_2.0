/* eslint-disable no-unused-vars */
const Express = require('express');
const Router = Express.Router();
const {validationResult} = require('express-validator');
const AdminController = require('../Controllers/AdminController');
const multer = require('multer');
const Responder = require('../App/Responder');
const AdminValidation = require('../Validators/AdminValidation');
const winston = require('winston');
const logger = winston.createLogger({
	transports: [new winston.transports.Console()]
});

Router.post('/sign_up', AdminValidation.adminValidation(), (req, res) => {
	let hasErrors = validationResult(req);
	if (!hasErrors.isEmpty()) return Responder.sendFailureMessage(res, '' + hasErrors.errors[0].msg, 422);
	else return AdminController.signUp(req, res);
});

Router.get('/details/:adminId', (req, res) => {
	return AdminController.details(req.params.adminId, res);
});

module.exports = Router;
