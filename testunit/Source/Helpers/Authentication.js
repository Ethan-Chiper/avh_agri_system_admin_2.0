const {isEmpty, getIdAndRole} = require('../Helpers/Utils');
const Responder = require('../App/Responder');
const {findOneAdmin} = require('../Repository/AdminRepository');
const {app_warning, app_error} = require('../Helpers/Logger');

/**
 * Authenticate logged-in user
 * @returns {(function(*, *, *): Promise<*|undefined>)|*}
 * @constructor
 */

const Authentication = () => {
	return async (request, response, next) => {
		try {
			const [UserRole, UserId] = getIdAndRole(request.headers['x-consumer-username']);
			if (isEmpty(UserRole) || isEmpty(UserId)) {
				let message = 'Unauthorized Access!';
				app_warning(
					message,
					{'x-consumer-username': request.headers['x-consumer-username']},
					request?.body?.loggedUser,
					'Authentication'
				);
				return Responder.sendFailureMessage(response, message, 401);
			} else {
				if (UserRole === 'admin' || UserRole === 'sub-admin') {
					let queryOptions = {
						method: 'findOne',
						condition: {admin_id: UserId, status: 'active'},
						projection: {name: 1, admin_id: 1, role: 1, acc_type: 1},
						options: {lean: true}
					};
					let admin = await findOneAdmin(queryOptions);
					if (isEmpty(admin)) {
						let message = 'Not a valid user!';
						app_warning(
							message,
							{admin_id: UserId, status: 'active'},
							request?.body?.loggedUser,
							'Authentication'
						);
						return Responder.sendFailureMessage(response, message, 401);
					} else {
						if (request?.originalUrl?.includes('store-admin/update')) {
							if (isEmpty(request?.user)) {
								request.user = {};
							}
							request.user.name = admin?.name?.full;
							request.user.id = admin?.admin_id;
							request.user.role = admin?.role || '';
							request.user.acc_type = admin?.acc_type;
						}
						if (isEmpty(request?.body?.loggedUser)) {
							request.body.loggedUser = {};
						}
						request.body.loggedUser.name = admin?.name?.full;
						request.body.loggedUser.id = admin?.admin_id;
						request.body.loggedUser.role = admin?.role || '';
						request.body.loggedUser.acc_type = admin?.acc_type;
						next();
					}
				} else {
					let message = 'Not a valid user';
					app_warning(
						message,
						{'x-consumer-username': request.headers['x-consumer-username']},
						request?.body?.loggedUser,
						'Authentication'
					);
					return Responder.sendFailureMessage(response, message, 401);
				}
			}
		} catch (error) {
			app_error(error, request, 'Authentication');
			return Responder.sendFailureMessage(response, error, 500);
		}
	};
};

module.exports = Authentication;
