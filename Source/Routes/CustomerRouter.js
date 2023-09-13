const Express = require('express');
const Router = Express.Router();
const CustomerController = require('../Controllers/CustomerController');
const {isEmpty} = require('../Helpers/Utils');
const Responder = require('../App/Responder');

Router.post('/sign_up', async (req, res) => {
	try{
		let {error, message, data} = await CustomerController.signUp(req, res);
		if (!isEmpty(data) && error === false) {
			return Responder.sendSuccessData(res, message, data);
		}
		return Responder.sendFailureMessage(res, message, 400);
	}catch (error) {
		return Responder.sendFailureMessage(res, error, 500);
	}
});

module.exports = Router;
