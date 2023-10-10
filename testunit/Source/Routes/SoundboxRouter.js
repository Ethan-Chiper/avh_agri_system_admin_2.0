const Express = require('express');
const Router = Express.Router();
const Responder = require('../App/Responder');
const Authentication = require('../Helpers/Authentication');
const {app_error} = require('../Helpers/Logger');
const SoundboxController = require('../Controller/SoundboxController');
const {isEmpty} = require('../Helpers/Utils');

const SoundboxRouter = Express.Router();

SoundboxRouter.use(Authentication());

SoundboxRouter.get('/list', async (request, response) => {
	try {
		let {error, message, data} = await SoundboxController.list(request?.body?.loggedUser, request?.query);
		if (!isEmpty(data) && error === false) {
			return Responder.sendSuccessData(response, message, data);
		}
		return Responder.sendFailureMessage(response, message, 400);
	} catch (error) {
		app_error(error, request, 'Sound Box list');
		return Responder.sendFailureMessage(response, error, 500);
	}
});

SoundboxRouter.get('/detail/:soundboxId', async (request, response) => {
	try {
		let {error, message, data} = await SoundboxController.soundboxDetails(
			request?.body?.loggedUser,
			request.params.soundboxId
		);
		if (!isEmpty(data) && error === false) {
			return Responder.sendSuccessData(response, message, data);
		}
		return Responder.sendFailureMessage(response, message, 400);
	} catch (error) {
		app_error(error, request, 'Sound Box Details');
		return Responder.sendFailureMessage(response, error, 500);
	}
});

SoundboxRouter.post('/changestatus/:soundboxId', async (request, response) => {
	try {
		let {error, message, data} = await SoundboxController.changeStatus(
			request?.body?.loggedUser,
			request.params.soundboxId
		);
		if (!isEmpty(data) && error === false) {
			return Responder.sendSuccessData(response, message, data);
		}
		return Responder.sendFailureMessage(response, message, 400);
	} catch (error) {
		app_error(error, request, 'Sound Box Change Status');
		return Responder.sendFailureMessage(response, error, 500);
	}
});

Router.use('/', SoundboxRouter);

module.exports = Router;
