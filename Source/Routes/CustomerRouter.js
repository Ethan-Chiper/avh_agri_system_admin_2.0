const Express = require('express');
const Router = Express.Router();
const CustomerController = require('../Controllers/CustomerController');
// const multer = require("multer");

Router.post('/sign_up', (req, res) => {
	return CustomerController.signUp(req, res);
});

module.exports = Router;
