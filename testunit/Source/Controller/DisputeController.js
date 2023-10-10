const CONFIG = require('../App/Config');
const {isEmpty, networkCall} = require('../Helpers/Utils');
const {findOneDispute} = require('../Repository/DisputeRepository');
const {app_error, app_warning} = require('../Helpers/Logger');

const DisputeController = {
	disputeList: async (queryData, loggedUser) => {
		try {
			let options = {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				},
				url: CONFIG.SERVICE.TRANSACTION_SERVICE_URL + '/dispute/list',
				admin: loggedUser
			};

			if (!isEmpty(queryData)) {
				let query = {};
				if (queryData?.limit) query.limit = queryData?.limit;
				if (queryData?.page) query.page = queryData?.page;
				if (queryData?.from_time) query.from_time = queryData?.from_time;
				if (queryData?.to_time) query.to_time = queryData?.to_time;
				//if (queryData?.date_option) query.date_option = queryData?.date_option;
				if (queryData?.dispute_id) {
					query.dispute_id = queryData?.dispute_id;
				}
				if (queryData?.status) query.status = queryData?.status;
				if (queryData?.issue_type) query.issue_type = queryData?.issue_type;
				if (queryData?.dispute_for) query.dispute_for = queryData?.dispute_for;

				let urlAppender = new URLSearchParams(query);
				options.url += '?' + urlAppender;
			}

			let disputeList = await networkCall(options);
			if (disputeList?.error) app_error(disputeList?.error, {}, 'Dispute List', loggedUser);
			let resultData = JSON.parse(disputeList?.body);
			let valid = resultData?.success;
			if (!valid) {
				app_warning(resultData?.message || 'There is no dispute list', resultData, loggedUser, 'Dispute List');
				return {
					error: true,
					message: resultData?.message || 'There is no dispute list'
				};
			}
			return {error: false, message: resultData?.message, data: resultData?.data};
		} catch (error) {
			app_error(error, {}, 'Dispute List', loggedUser);
			return {error: true, message: 'Something went wrong! Please try again after sometimes.'};
		}
	},

	changeStatus: async (changeStatusData, disputeId) => {
		let existingDispute = await findOneDispute({dispute_id: disputeId}, {}, true);
		if (isEmpty(existingDispute)) {
			app_warning(
				'Dispute Not Found',
				{dispute_id: disputeId},
				changeStatusData?.loggedUser,
				'Dispute Change Status'
			);
			return {error: true, message: 'Dispute Not Found'};
		} else {
			try {
				let options = {
					url: CONFIG.SERVICE.TRANSACTION_SERVICE_URL + '/dispute/change-status/' + disputeId,
					method: 'PATCH',
					body: {comment: changeStatusData?.comment, admin: changeStatusData?.loggedUser}
				};

				let disputeStatusUpdate = await networkCall(options);
				if (disputeStatusUpdate?.error)
					app_error(disputeStatusUpdate?.error, {}, 'Dispute Change Status', changeStatusData?.loggedUser);
				let resultData = JSON.parse(disputeStatusUpdate?.body);
				let valid = resultData?.success;
				if (!valid) {
					app_warning(
						resultData?.message ||
							'Something went wrong. Could not update status. Please try after sometimes.',
						resultData,
						changeStatusData?.loggedUser,
						'Dispute Change Status'
					);
					return {
						error: true,
						message:
							resultData?.message ||
							'Something went wrong. Could not update status. Please try after sometimes.'
					};
				}
				return {error: false, message: resultData?.message, data: resultData?.data};
			} catch (error) {
				app_error(error, {}, 'Dispute Change Status', changeStatusData?.loggedUser);
				return {error: true, message: 'Something went wrong! Please try again'};
			}
		}
	},

	disputeDetails: async (loggedUser, disputeId) => {
		let existingDispute = await findOneDispute({dispute_id: disputeId}, {}, true);
		if (isEmpty(existingDispute)) {
			app_warning('Dispute Not Found', {dispute_id: disputeId}, loggedUser, 'Dispute Details');
			return {error: true, message: 'Dispute Not Found'};
		} else {
			try {
				let options = {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json'
					},
					url: CONFIG.SERVICE.TRANSACTION_SERVICE_URL + '/dispute/details/' + disputeId,
					admin: loggedUser
				};

				let disputeDetails = await networkCall(options);
				if (disputeDetails?.error) app_error(disputeDetails?.error, {}, 'Dispute Details', loggedUser);
				let resultData = JSON.parse(disputeDetails?.body);
				let valid = resultData?.success;
				if (!valid) {
					app_warning('Dispute Not Found', resultData, loggedUser, 'Dispute Details');
					return {
						error: true,
						message:
							resultData?.message ||
							'Something went wrong while fetching dispute details. Please try again after sometimes.'
					};
				}
				return {error: false, message: resultData?.message, data: resultData?.data};
			} catch (error) {
				app_error(error, {}, 'Dispute Details', loggedUser);
				return {error: true, message: 'Something went wrong! Please try again'};
			}
		}
	}
};

module.exports = DisputeController;
