const Express = require('express');
const Router = Express.Router();
const ProductPurchaseRequestController = require('../Controller/PurchaseOrderRequestController');
const {sendFailureMessage, sendSuccessData} = require('../App/Responder');
const {app_error, app_notice} = require('../Helpers/Logger');
const Authentication = require('../Helpers/Authentication');
const {isEmpty} = require('../Helpers/Utils');
const {
	dsnMapValidator,
	listValidator,
	changeDeliveryStatusValidator,
	assignUserForOrderValidator,
	cancellationValidator,
	refundStatusValidator
} = require('../Validators/ProductPurchaseRequestValidator');
const {validationResult} = require('express-validator');
const Responder = require('../App/Responder');

Router.use(Authentication());
Router.get('/order-details/:orderId', async (request, response) => {
	try {
		let {error, message, data} = await ProductPurchaseRequestController.detail(
			request?.params?.orderId,
			request?.body?.logged_user,
			request.headers['x-consumer-username']
		);
		if (!isEmpty(data) && error === false) {
			return sendSuccessData(response, message, data);
		}
		return sendFailureMessage(response, message, 400);
	} catch (error) {
		app_error(error, request, 'product purchase request details route');
		return sendFailureMessage(response, error?.message);
	}
});

Router.get('/sound-box/list', listValidator(), async (request, response) => {
	try {
		let hasErrors = validationResult(request);
		if (hasErrors.isEmpty()) {
			let {error, message, data} = await ProductPurchaseRequestController.list(
				request,
				request?.body?.logged_user,
				request.headers['x-consumer-username']
			);
			if (!isEmpty(data) && error === false) {
				return sendSuccessData(response, message, data);
			}
			return sendFailureMessage(response, message, 400);
		} else {
			app_notice(hasErrors?.errors[0], request?.body?.loggedUser, 'Map dsn and vpa');
			return Responder.sendFailureMessage(response, hasErrors?.errors[0]?.msg, 422);
		}
	} catch (error) {
		app_error(error, request, 'product purchase request list route');
		return sendFailureMessage(response, error?.message);
	}
});

Router.get('/courier-partner/list', listValidator(), async (request, response) => {
	try {
		let hasErrors = validationResult(request);
		if (hasErrors.isEmpty()) {
			let {error, message, data} = await ProductPurchaseRequestController.getCourierPartners(
				request,
				request?.body?.loggedUser,
				request.headers['x-consumer-username']
			);
			if (!isEmpty(data) && error === false) {
				return sendSuccessData(response, message, data);
			}
			return sendFailureMessage(response, message, 400);
		} else {
			app_notice(hasErrors?.errors[0], request?.body?.loggedUser, 'Courier partner list api');
			return Responder.sendFailureMessage(response, hasErrors?.errors[0]?.msg, 422);
		}
	} catch (error) {
		app_error(error, request, 'Courier partner list api route');
		return sendFailureMessage(response, error?.message);
	}
});

Router.post('/sound-box/map-dsn-vpa/:orderId', dsnMapValidator(), async (request, response) => {
	try {
		let hasErrors = validationResult(request);
		if (hasErrors.isEmpty()) {
			let {error, message, data} = await ProductPurchaseRequestController.mapDsnWithVpa(
				request?.params?.orderId,
				request?.body,
				request?.body?.logged_user,
				request.headers['x-consumer-username']
			);
			if (!isEmpty(data) && error === false) {
				return sendSuccessData(response, message, data);
			}
			return sendFailureMessage(response, message, 400);
		} else {
			app_notice(hasErrors?.errors[0], request?.body?.loggedUser, 'Map dsn and vpa');
			return Responder.sendFailureMessage(response, hasErrors?.errors[0]?.msg, 422);
		}
	} catch (error) {
		app_error(error, request, 'mapping dsn with vpa route');
		return sendFailureMessage(response, error?.message);
	}
});

Router.post(
	'/sound-box/change-delivery-status/:orderId',
	changeDeliveryStatusValidator(),
	async (request, response) => {
		try {
			let hasErrors = validationResult(request);
			if (hasErrors.isEmpty()) {
				let {error, message, data} = await ProductPurchaseRequestController.changeDeliveryStatusOfSoundbox(
					request?.params?.orderId,
					request?.body,
					request?.body?.logged_user,
					request.headers['x-consumer-username']
				);
				if (!isEmpty(data) && error === false) {
					return sendSuccessData(response, message, data);
				}
				return sendFailureMessage(response, message, 400);
			} else {
				app_notice(hasErrors?.errors[0], request?.body?.loggedUser, 'change order delivery status api');
				return Responder.sendFailureMessage(response, hasErrors?.errors[0]?.msg, 422);
			}
		} catch (error) {
			app_error(error, request, 'change order delivery status api route');
			return sendFailureMessage(response, error?.message);
		}
	}
);

Router.post(
	'/sound-box/assign-user-to-process-order/:orderId',
	assignUserForOrderValidator(),
	async (request, response) => {
		try {
			let hasErrors = validationResult(request);
			if (hasErrors.isEmpty()) {
				let {error, message, data} = await ProductPurchaseRequestController.assignUserForProcessOrder(
					request?.params?.orderId,
					request?.body,
					request?.body?.logged_user,
					request.headers['x-consumer-username']
				);
				if (!isEmpty(data) && error === false) {
					return sendSuccessData(response, message, data);
				}
				return sendFailureMessage(response, message, 400);
			} else {
				app_notice(
					hasErrors?.errors[0],
					request?.body?.loggedUser,
					'Assigning user to process soundbox order request'
				);
				return Responder.sendFailureMessage(response, hasErrors?.errors[0]?.msg, 422);
			}
		} catch (error) {
			app_error(error, request, 'Assigning user to process soundbox order request route');
			return sendFailureMessage(response, error?.message);
		}
	}
);

Router.post('/order-cancellation/:orderId', cancellationValidator(), async (request, response) => {
	try {
		let hasErrors = validationResult(request);
		if (hasErrors.isEmpty()) {
			let {error, message, data} = await ProductPurchaseRequestController.orderCancellationRequest(
				request?.params?.orderId,
				request?.body,
				request?.body?.logged_user,
				request.headers['x-consumer-username']
			);
			if (!isEmpty(data) && error === false) {
				return sendSuccessData(response, message, data);
			}
			return sendFailureMessage(response, message, 400);
		} else {
			app_notice(hasErrors?.errors[0], request?.body?.loggedUser, 'cancellation of soundbox order request');
			return Responder.sendFailureMessage(response, hasErrors?.errors[0]?.msg, 422);
		}
	} catch (error) {
		app_error(error, request, 'cancel order route');
		return sendFailureMessage(response, error?.message);
	}
});

Router.post('/update-refund-status/:orderId', refundStatusValidator(), async (request, response) => {
	try {
		let hasErrors = validationResult(request);
		if (hasErrors.isEmpty()) {
			let {error, message, data} = await ProductPurchaseRequestController.updateRefundStatus(
				request?.params?.orderId,
				request?.body,
				request?.body?.logged_user,
				request.headers['x-consumer-username']
			);
			if (!isEmpty(data) && error === false) {
				return sendSuccessData(response, message, data);
			}
			return sendFailureMessage(response, message, 400);
		} else {
			app_notice(
				hasErrors?.errors[0],
				request?.body?.loggedUser,
				'updating refund status of soundbox order request'
			);
			return Responder.sendFailureMessage(response, hasErrors?.errors[0]?.msg, 422);
		}
	} catch (error) {
		app_error(error, request, 'change order refund status route');
		return sendFailureMessage(response, error?.message);
	}
});

Router.post('/update-approval-status/:orderId', async (request, response) => {
	try {
		let {error, message, data} = await ProductPurchaseRequestController.updateApprovalStatus(
			request?.params?.orderId,
			request?.body?.logged_user,
			request.headers['x-consumer-username']
		);
		if (!isEmpty(data) && error === false) {
			return sendSuccessData(response, message, data);
		}
		return sendFailureMessage(response, message, 400);
	} catch (error) {
		app_error(error, request, 'approve order refund status route');
		return sendFailureMessage(response, error?.message);
	}
});
module.exports = Router;
