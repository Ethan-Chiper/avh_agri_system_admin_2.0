const {isEmpty, getShortId, networkCall} = require('../Helpers/Utils');
const CONFIG = require('../App/Config');
const {findOnePartner} = require('../Repository/PartnerRepository');
const {app_error, app_warning} = require('../Helpers/Logger');

const PartnerController = {
	createPartner: async (partnerCreateData) => {
		try {
			let existingEmail = await findOnePartner({email: partnerCreateData?.email}, {}, true);
			if (!isEmpty(existingEmail)) {
				app_warning(
					'Partner already exists!',
					{email: partnerCreateData?.email},
					partnerCreateData?.loggedUser,
					'Partner Create'
				);
				return {error: true, message: 'Partner already exists!'};
			}

			let existingPhone = await findOnePartner({'phone.national_number': partnerCreateData?.phone}, {}, true);
			if (!isEmpty(existingPhone)) {
				app_warning(
					'Partner already exists!',
					{'phone.national_number': partnerCreateData?.phone},
					partnerCreateData?.loggedUser,
					'Partner Create'
				);
				return {error: true, message: 'Partner already exists!'};
			}

			let partner = {
				partner_id: getShortId(),
				name: partnerCreateData?.name || '',
				email: partnerCreateData?.email || '',
				phone: partnerCreateData?.phone || '',
				vpa_prefix: partnerCreateData?.vpa_prefix || '',
				whitelisted_ips: partnerCreateData?.whitelisted_ips || [],
				callback_url: partnerCreateData?.callback_url || '',
				is_approval_enabled: partnerCreateData?.is_approval_enabled || true,
				will_agent_onboard: partnerCreateData?.will_agent_onboard || false
			};

			let options = {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				url: CONFIG.SERVICE.AUTH_SERVICE_URL + '/partner/create',
				body: partner,
				admin: partnerCreateData?.loggedUser
			};

			let partnerCreate = await networkCall(options);
			if (partnerCreate?.error)
				app_error(partnerCreate?.error, {}, 'Partner Create', partnerCreateData?.loggedUser);
			let resultData = JSON.parse(partnerCreate?.body);
			let valid = resultData?.success;
			if (!valid) {
				app_warning(
					resultData?.message || 'Could not create Partner',
					resultData,
					partnerCreateData?.loggedUser,
					'Partner Create'
				);
				return {error: true, message: resultData?.message || 'Could not create Partner'};
			}
			return {error: false, message: resultData?.message, data: resultData?.data};
		} catch (error) {
			app_error(error, {}, 'Partner Create', partnerCreateData?.loggedUser);
			return {error: true, message: 'Something went wrong! Please try again'};
		}
	},

	list: async (queryData, loggedUser) => {
		try {
			let options = {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				},
				url: CONFIG.SERVICE.AUTH_SERVICE_URL + '/partner/list',
				admin: loggedUser
			};

			if (!isEmpty(queryData)) {
				let query = {};
				if (queryData?.limit) query.limit = queryData?.limit;
				if (queryData?.page) query.page = queryData?.page;
				if (queryData?.status) query.status = queryData?.status;
				if (queryData?.will_agent_onboard) query.will_agent_onboard = queryData?.will_agent_onboard;
				if (queryData?.from_time) query.from_time = queryData?.from_time;
				if (queryData?.to_time) query.to_time = queryData?.to_time;
				if (queryData?.date_option) query.date_option = queryData?.date_option;
				if (queryData?.is_approval_enabled) query.is_approval_enabled = queryData?.is_approval_enabled;
				if (queryData?.request_for) query.request_for = 'drop_down';

				let urlAppender = new URLSearchParams(query);
				options.url += '?' + urlAppender;
			}

			let partnerList = await networkCall(options);
			if (partnerList?.error) app_error(partnerList?.error, {}, 'Partner List', loggedUser);
			let resultData = JSON.parse(partnerList?.body);

			if (!resultData?.success) {
				app_warning(
					'Partner List could Not be Fetched! Please try again!',
					{resultData, options},
					loggedUser,
					'Partner List'
				);
				return {
					error: true,
					message: 'Partner List could Not be Fetched! Please try again!'
				};
			}
			return {error: false, message: resultData?.message, data: resultData?.data};
		} catch (error) {
			app_error(error, {}, 'Partner List', loggedUser);
			return {error: true, message: 'Something went wrong! Please try again'};
		}
	}
};

module.exports = PartnerController;
