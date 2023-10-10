/**
 * Responder Messages
 * @type {{sendFailureMessage: (function(*, *, *): *), sendSuccessData: (function(*, *, *): *), sendSuccessMessage: (function(*, *): *)}}
 */

const Responder = {
	sendFailureMessage: (response, message, status = 400) => {
		let result = {};
		result.success = false;
		result.message = message;
		response.setHeader('Surrogate-Control', 'no-store');
		response.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
		response.setHeader('Expires', '0');
		return response.status(status).send(result);
	},
	sendSuccessMessage: (response, message, status = 200) => {
		let result = {};
		result.success = true;
		result.message = message;
		response.setHeader('Surrogate-Control', 'no-store');
		response.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
		response.setHeader('Expires', '0');
		return response.status(status).send(result);
	},
	sendSuccessData: (response, message, data, status = 200) => {
		let result = {};
		result.success = true;
		result.message = message;
		result.data = data;
		response.setHeader('Surrogate-Control', 'no-store');
		response.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
		response.setHeader('Expires', '0');
		return response.status(status).send(result);
	}
};

module.exports = Responder;
