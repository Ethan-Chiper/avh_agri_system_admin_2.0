const Express = require('express');
const Router = Express.Router();
const Responder = require('../App/Responder');
const Authentication = require('../Helpers/Authentication');
const {app_notice, app_error} = require('../Helpers/Logger');
const {BulkValidator, MerchantNotificationValidator} = require('../Validators/PushNotificationValidator');
const PushNotificationController = require('../Controller/PushNotificationController');
const {validationResult} = require('express-validator');

const PushNotifyRouter = Express.Router();
PushNotifyRouter.use(Authentication());

PushNotifyRouter.post('/send/push', BulkValidator(), async (request, response) => {
	try {
		let hasErrors = validationResult(request);
		if (hasErrors.isEmpty()) {
			let {error, message, data} = await PushNotificationController.sendBulkPush(request?.body, 1);
			if (data && error === false) {
				return Responder.sendSuccessData(response, message, data);
			}
			return Responder.sendFailureMessage(response, message, 400);
		} else {
			app_notice(hasErrors?.errors[0], request?.body?.loggedUser, 'Push Notification in Bulk');
			return Responder.sendFailureMessage(response, hasErrors?.errors[0]?.msg, 422);
		}
	} catch (error) {
		app_error(error, request, 'Push Notification in Bulk');
		return Responder.sendFailureMessage(response, error, 500);
	}
});

PushNotifyRouter.post('/send/push/merchant', MerchantNotificationValidator(), async (request, response) => {
	try {
		let hasErrors = validationResult(request);
		if (hasErrors.isEmpty()) {
			let {error, message, data} = await PushNotificationController.sendMerchantPush(request?.body);
			if (data && error === false) {
				return Responder.sendSuccessData(response, message, data);
			}
			return Responder.sendFailureMessage(response, message, 400);
		} else {
			app_notice(hasErrors?.errors[0], request?.body?.loggedUser, 'Push Notification for Single Merchant');
			return Responder.sendFailureMessage(response, hasErrors?.errors[0]?.msg, 422);
		}
	} catch (error) {
		app_error(error, request, 'Push Notification for Single Merchant');
		return Responder.sendFailureMessage(response, error, 500);
	}
});

Router.use('/', PushNotifyRouter);

module.exports = Router;
