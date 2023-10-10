const Express = require('express');
const {isEmpty} = require('../Helpers/Utils');
const Responder = require('../App/Responder');
const Authentication = require('../Helpers/Authentication');
const Router = Express.Router();
const {app_error, app_notice} = require('../Helpers/Logger');
const {
	createValidator,
	changeRoleValidator,
	mapAgentvalidatior,
	locationMapping,
	editAgentValidator,
	approveClockIn
} = require('../Validators/AgentValidator');
const AgentController = require('../Controller/AgentController');
const {validationResult} = require('express-validator');

Router.use(Authentication());
Router.get('/agent/list', async (request, response) => {
	try {
		let {error, message, data} = await AgentController.getAgentList(request?.body?.loggedUser, request?.query);
		if (!isEmpty(data) && error === false) {
			return Responder.sendSuccessData(response, message, data);
		}
		return Responder.sendFailureMessage(response, message, 400);
	} catch (error) {
		app_error(error, request, 'Agent Details');
		return Responder.sendFailureMessage(response, error, 500);
	}
});

Router.post('/create', createValidator(), async (request, response) => {
	try {
		let hasErrors = validationResult(request);
		if (hasErrors.isEmpty()) {
			let {error, message, data} = await AgentController.createAgent(
				request?.body,
				request.headers['x-consumer-username']
			);
			if (!isEmpty(data) && error === false) {
				return Responder.sendSuccessData(response, message, data);
			}
			return Responder.sendFailureMessage(response, message, 400);
		} else {
			app_notice(hasErrors?.errors[0], request?.body?.loggedUser, 'Agent Create');
			return Responder.sendFailureMessage(response, hasErrors?.errors[0]?.msg, 422);
		}
	} catch (error) {
		app_error(error, request, 'Create Agent');
		return Responder.sendFailureMessage(response, error, 500);
	}
});

Router.get('/details/:agentId', async (request, response) => {
	try {
		let {error, message, data} = await AgentController.agentDetails(
			request?.body?.loggedUser,
			request?.params?.agentId
		);
		if (!isEmpty(data) && error === false) {
			return Responder.sendSuccessData(response, message, data);
		}
		return Responder.sendFailureMessage(response, message, 400);
	} catch (error) {
		app_error(error, request, 'Agent Details');
		return Responder.sendFailureMessage(response, error, 500);
	}
});

Router.get('/state/list', async (request, response) => {
	try {
		let {error, message, data} = await AgentController.getStateList(request?.body?.loggedUser, request?.query);
		if (!isEmpty(data) && error === false) {
			return Responder.sendSuccessData(response, message, data);
		}
		return Responder.sendFailureMessage(response, message, 400);
	} catch (error) {
		app_error(error, request, 'State List');
		return Responder.sendFailureMessage(response, error, 500);
	}
});

Router.get('/city/list', async (request, response) => {
	try {
		let {error, message, data} = await AgentController.getCityList(request?.body?.loggedUser, request?.query);
		if (!isEmpty(data) && error === false) {
			return Responder.sendSuccessData(response, message, data);
		}
		return Responder.sendFailureMessage(response, message, 400);
	} catch (error) {
		app_error(error, request, 'City List');
		return Responder.sendFailureMessage(response, error, 500);
	}
});

Router.post('/edit-agent', editAgentValidator(), async (request, response) => {
	try {
		let hasErrors = validationResult(request);
		if (hasErrors.isEmpty()) {
			let {error, message, data} = await AgentController.updatePhone(
				request?.body,
				request.headers['x-consumer-username']
			);
			if (!isEmpty(data) && error === false) {
				return Responder.sendSuccessData(response, message, data);
			}
			return Responder.sendFailureMessage(response, message, 400);
		} else {
			app_notice(hasErrors?.errors[0], request?.body?.loggedUser, 'Agent Edit');
			return Responder.sendFailureMessage(response, hasErrors?.errors[0]?.msg, 422);
		}
	} catch (error) {
		app_error(error, request, 'Agent Edit');
		return Responder.sendFailureMessage(response, error, 500);
	}
});

Router.post('/change-role', changeRoleValidator(), async (request, response) => {
	try {
		let hasErrors = validationResult(request);
		if (hasErrors.isEmpty()) {
			let {error, message, data} = await AgentController.changeRole(
				request?.body,
				request.headers['x-consumer-username']
			);
			if (!isEmpty(data) && error === false) {
				return Responder.sendSuccessData(response, message, data);
			}
			return Responder.sendFailureMessage(response, message, 400);
		} else {
			app_notice(hasErrors?.errors[0], request?.body?.loggedUser, 'Change Agent Role');
			return Responder.sendFailureMessage(response, hasErrors?.errors[0]?.msg, 422);
		}
	} catch (error) {
		app_error(error, request, 'Change Agents role');
		return Responder.sendFailureMessage(response, error, 500);
	}
});

Router.post('/agent-mapping/:agentId', mapAgentvalidatior(), async (request, response) => {
	try {
		let hasErrors = validationResult(request);
		if (hasErrors.isEmpty()) {
			let {error, message, data} = await AgentController.agentMapping(request?.body, request.params.agentId);
			if (!isEmpty(data) && error === false) {
				return Responder.sendSuccessData(response, message, data);
			}
			return Responder.sendFailureMessage(response, message, 400);
		} else {
			app_notice(hasErrors?.errors[0], request?.body?.loggedUser, 'Map Agent API');
			return Responder.sendFailureMessage(response, hasErrors?.errors[0]?.msg, 422);
		}
	} catch (error) {
		app_error(error, request, 'Map Agent API');
		return Responder.sendFailureMessage(response, error, 500);
	}
});

Router.post('/location-mapping/:agentId', locationMapping(), async (request, response) => {
	try {
		let hasErrors = validationResult(request);
		if (hasErrors.isEmpty()) {
			let {error, message, data} = await AgentController.locationMapping(request?.body, request.params.agentId);
			if (!isEmpty(data) && error === false) {
				return Responder.sendSuccessData(response, message, data);
			}
			return Responder.sendFailureMessage(response, message, 400);
		} else {
			app_notice(hasErrors.errors[0], request?.body?.loggedUser, 'Agent Location Mapping');
			return Responder.sendFailureMessage(response, hasErrors?.errors[0]?.msg, 422);
		}
	} catch (error) {
		app_error(error, request, 'Agent Location Mapping');
		return Responder.sendFailureMessage(response, error, 500);
	}
});
Router.get('/role-list/:role', async (request, response) => {
	try {
		let {error, message, data} = await AgentController.getAgentRoleList(
			request?.body?.loggedUser,
			request?.params?.role,
			request?.query
		);
		if (!isEmpty(data) && error === false) {
			return Responder.sendSuccessData(response, message, data);
		}
		return Responder.sendFailureMessage(response, message, 400);
	} catch (error) {
		app_error(error, request, 'Agent Role list');
		return Responder.sendFailureMessage(response, error, 500);
	}
});
Router.patch('/change-role/:agentId', async (request, response) => {
	try {
		let {error, message, data} = await AgentController.changeStatus(
			request?.body?.loggedUser,
			request.params.agentId
		);
		if (!isEmpty(data) && error === false) {
			return Responder.sendSuccessData(response, message, data);
		}
		return Responder.sendFailureMessage(response, message, 400);
	} catch (error) {
		app_error(error, request, 'Not Used Endpoint');
		return Responder.sendFailureMessage(response, error, 500);
	}
});

Router.patch('/change-status/:agentId', async (request, response) => {
	try {
		let {error, message, data} = await AgentController.changeStatus(
			request?.body?.loggedUser,
			request.params.agentId
		);
		if (!isEmpty(data) && error === false) {
			return Responder.sendSuccessData(response, message, data);
		}
		return Responder.sendFailureMessage(response, message, 400);
	} catch (error) {
		app_error(error, request, 'Agent Change Status');
		return Responder.sendFailureMessage(response, error, 500);
	}
});

Router.patch('/approve-agent/:agentId', async (request, response) => {
	try {
		let {error, message, data} = await AgentController.approveAgent(
			request?.body?.loggedUser,
			request.params.agentId
		);
		if (!isEmpty(data) && error === false) {
			return Responder.sendSuccessData(response, message, data);
		}
		return Responder.sendFailureMessage(response, message, 400);
	} catch (error) {
		return Responder.sendFailureMessage(response, error, 500);
	}
});

Router.delete('/delete/:agentId', async (request, response) => {
	try {
		let {error, message, data} = await AgentController.deleteAgent(
			request?.body?.loggedUser,
			request.params.agentId
		);
		if (isEmpty(data) && error === false) {
			return Responder.sendSuccessData(response, message, data);
		}
		return Responder.sendFailureMessage(response, message, 400);
	} catch (error) {
		app_error(error, request, 'Delete Agent');
		return Responder.sendFailureMessage(response, error, 500);
	}
});
Router.post('/approve-clockin', approveClockIn(), async (request, response) => {
	try {
		let hasErrors = validationResult(request);
		if (hasErrors.isEmpty()) {
			let {error, message, data} = await AgentController.approveClockIn(
				request?.body,
				request.headers['x-consumer-username']
			);
			if (!isEmpty(data) && error === false) {
				return Responder.sendSuccessData(response, message, data);
			}
			return Responder.sendFailureMessage(response, message, 400);
		} else {
			app_notice(hasErrors.errors[0], request?.body?.loggedUser, 'Agent Clock In Approve');
			return Responder.sendFailureMessage(response, hasErrors?.errors[0]?.msg, 422);
		}
	} catch (error) {
		app_error(error, request, 'Agent Clock In Approve');
		return Responder.sendFailureMessage(response, error, 500);
	}
});
Router.use('/', Router);

module.exports = Router;
