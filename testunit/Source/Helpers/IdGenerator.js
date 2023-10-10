const Responder = require('../App/Responder');
const {isEmpty} = require('../Helpers/Utils');
const {app_error} = require('../Helpers/Logger');

const IdGenerator = () => {
	return (request, response, next) => {
		try {
			if (isEmpty(request?.body?.loggedUser)) {
				request.body.loggedUser = {};
			}
			request.body.loggedUser.log_id = request.headers['kong-request-id'];
			next();
		} catch (error) {
			app_error(error, request, 'ID-Generator');
			return Responder.sendFailureMessage(response, error, 500);
		}
	};
};

module.exports = IdGenerator;
