/* eslint-disable unicorn/no-array-method-this-argument */
const {isEmpty, getShortId, networkCall, getDocumentObj, getIdAndRole, dateFinder} = require('../Helpers/Utils');
const {requestTermination, activateTermination, deleteUser} = require('../Helpers/KongUtils');
const CONFIG = require('../App/Config');
const {findOneAgent, findAgent} = require('../Repository/AgentRepositary');
const StateModel = require('../Models/StateModel');
const CityModel = require('../Models/CityModel');
const moment = require('moment');
const AgentModel = require('../Models/AgentModel');
const {app_error, app_warning} = require('../Helpers/Logger');

const AgentController = {
	/**
	 * agent list
	 * @param requestData
	 * @param query
	 * @returns {Promise<{data: {agent: unknown extends (object & {then(onfulfilled: infer F): any}) ? (F extends ((value: infer V, ...args: any) => any) ? Awaited<V> : never) : unknown, total: unknown extends (object & {then(onfulfilled: infer F): any}) ? (F extends ((value: infer V, ...args: any) => any) ? Awaited<V> : never) : unknown}, error: boolean, message: string}|{error: boolean, message}>}
	 */
	getAgentList: async (requestData, query) => {
		let limit = 10;
		let queryData = {};
		let page = 1;
		if (query?.limit) limit = query?.limit === 'all' ? query?.limit : Number.parseInt(query?.limit);
		if (query?.page) page = Number.parseInt(query?.page);
		if (query?.agent_id) queryData.agent_id = query?.agent_id;
		if (query?.phone) queryData['phone.national_number'] = query?.phone;
		if (query?.role) queryData.role = query?.role;
		if (query?.status) queryData.status = query?.status;
		if (query?.state) queryData['location.state.name'] = query?.state;
		if (query?.from_time || query?.to_time || query?.date_option) {
			queryData['createdAt'] = dateFinder(query);
		}
		try {
			let projection = {
				_id: 0,
				agent_id: 1,
				'name.full': 1,
				role: 1,
				createdAt: 1,
				location: 1,
				status: 1,
				'phone.national_number': 1,
				'documents.status': 1,
				is_allow_clockin: 1,
				reference: 1
			};
			if (query.limit === 'all') {
				projection = {
					_id: 0,
					agent_id: 1,
					'name.full': 1,
					role: 1,
					reference: 1
				};
				// eslint-disable-next-line unicorn/no-array-callback-reference
				let result = await AgentModel.find(queryData, projection).sort({createdAt: -1}).lean();
				if (result) {
					return {
						error: false,
						message: 'Agent list are.',
						data: {
							agent: result
						}
					};
				}
			} else {
				let [result, totalCount] = await Promise.all([
					// eslint-disable-next-line unicorn/no-array-callback-reference
					await AgentModel.find(queryData, projection)
						.sort({createdAt: -1})
						.skip((page - 1) * limit)
						.limit(limit)
						.lean(),
					// eslint-disable-next-line unicorn/no-array-callback-reference
					await AgentModel.find(queryData).count()
				]);
				if (result) {
					return {
						error: false,
						message: 'Agent list are.',
						data: {
							agent: result,
							total: totalCount
						}
					};
				}
			}
		} catch (error) {
			app_error(error, {}, 'Get Agent List', requestData);
			return {
				error: true,
				message: error.message
			};
		}
	},
	/**
	 * Get State List
	 * @param requestData
	 * @returns {Promise<{data: {states: *}, error: boolean, message: string}|{error: boolean, message: string}|{error: boolean, message}>}
	 */
	getStateList: async (requestData) => {
		let agentId = requestData?.id;
		let searchData = {
			is_enabled: true
		};
		if (isEmpty(agentId)) {
			app_warning('Unauthorized access.', {agentId}, requestData, 'Get State List');
			return {error: true, message: 'Unauthorized access.'};
		} else {
			try {
				let projection = {_id: 0, name: 1, code: 1, is_enabled: 1};
				const result = await StateModel.find(searchData, projection);
				if (result) {
					return {
						error: false,
						message: 'State lists are.',
						data: {states: result}
					};
				}
			} catch (error) {
				app_error(error, {}, 'Get State List', requestData);
				return {
					error: true,
					message: error.message
				};
			}
		}
	},
	/**
	 * create agent new api
	 * @param requestData
	 * @param userId
	 * @returns {Promise<{error: boolean, message: string}|{error: boolean, message: string}|{data: *, error: boolean, message: string}>}
	 */
	createAgent: async (requestData, userId) => {
		let createdBy = getIdAndRole(userId);
		let query = {};
		query['agent_id'] = createdBy[1];
		if (createdBy[0] === 'admin' || createdBy[0] === 'sub-admin') {
			const exAgent = await findOneAgent(
				{
					'phone.national_number': requestData?.phone?.national_number,
					'phone.country_code': '91'
				},
				''
			);
			if (exAgent) {
				app_warning(
					'A User with same phone number already exists',
					{
						'phone.national_number': requestData?.phone?.national_number,
						'phone.country_code': '91'
					},
					requestData?.loggedUser,
					'Agent Create'
				);
				return {error: true, message: 'A User with same phone number already exists'};
			} else {
				const agentData = {
					agent_id: getShortId(),
					business_type: '',
					phone: {national_number: requestData?.phone?.national_number},
					name: {full: requestData?.name?.full},
					image: requestData?.image || '',
					location: requestData?.location,
					reference: {
						asm: {
							id: requestData?.reference?.asm?.id || '',
							name: requestData?.reference?.asm?.name || ''
						},
						third_party: {
							id: requestData?.reference?.third_party?.id || '',
							name: requestData?.reference?.third_party?.name || ''
						},
						tl: {
							id: requestData?.reference?.tl?.id || '',
							name: requestData?.reference?.tl?.name || ''
						}
					},
					commission: requestData?.commission || 0,
					role: requestData?.role
				};
				let options = {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					url: CONFIG?.SERVICE?.AUTH_SERVICE_URL + '/agent/register',
					body: agentData
				};
				try {
					let agentCreate = await networkCall(options);
					if (agentCreate?.error) app_error(agentCreate?.error, {}, 'Create Agent', requestData?.loggedUser);
					let resultData = JSON.parse(agentCreate?.body);
					let valid = resultData?.success;
					if (!isEmpty(agentCreate?.error) || !valid) {
						app_warning(
							'Could not create Merchant/Sub-Merchant',
							resultData,
							requestData?.loggedUser,
							'Create Agent'
						);
						return {error: true, message: 'Could not create Merchant/Sub-Merchant'};
					}
					return {error: false, message: resultData?.message, data: resultData?.data.agent};
				} catch (error) {
					app_error(error, {}, 'Create Agent', requestData?.loggedUser);
					return {error: true, message: 'Something went wrong! Please try again'};
				}
			}
		} else {
			app_warning(
				'You are not authorized to create this users.',
				{createdBy},
				requestData?.loggedUser,
				'Create Agent'
			);
			return {error: true, message: 'You are not authorized to create this users.'};
		}
	},
	/**
	 * get agent Details
	 * @param requestData
	 * @param agent_id
	 * @returns {Promise<{data: {agent: ({response: *, error: *, body: *}|{error: string}|{response: undefined, error, body: undefined}|{response: undefined, error: string, body: undefined})}, error: boolean, message: string}|{error: boolean, message: string}|{error: boolean, message}>}
	 */
	agentDetails: async (requestData, agent_id) => {
		let agentId = requestData?.id;
		if (agentId) {
			let agent = await findOneAgent(
				{agent_id: agent_id},
				{
					_id: 0,
					name: 1,
					location: 1,
					commission: 1,
					role: 1,
					is_teamleader: 1,
					agent_id: 1,
					image: 1,
					is_manager: 1,
					agent_image: 1,
					phone: 1,
					email: 1,
					reference: 1,
					about: 1,
					agents_count: 1,
					store_count: 1,
					totalstore_count: 1,
					documents: 1,
					agent_settlement_type: 1,
					status: 1,
					createdAt: 1
				}
			);
			if (agent) {
				if (agent?.documents?.aadhar?.number) {
					let number = agent?.documents?.aadhar?.number;
					agent.documents.aadhar.number = number?.replace(/\d(?=\d{4})/g, '*');

					agent['aadhaar_details'] = {
						name: agent?.documents?.aadhar?.verify_response?.data?.proofOfIdentity?.name || '',
						dob: agent?.documents?.aadhar?.verify_response?.data?.proofOfIdentity?.dob || '',
						address: agent?.documents?.aadhar?.verify_response
							? (
									agent?.documents?.aadhar?.verify_response?.data?.proofOfAddress?.house +
									' ' +
									agent?.documents?.aadhar?.verify_response?.data?.proofOfAddress?.street +
									' ' +
									agent?.documents?.aadhar?.verify_response?.data?.proofOfAddress?.landmark +
									' ' +
									agent?.documents?.aadhar?.verify_response?.data?.proofOfAddress?.postOffice +
									' ' +
									agent?.documents?.aadhar?.verify_response?.data?.proofOfAddress?.district +
									' ' +
									agent?.documents?.aadhar?.verify_response?.data?.proofOfAddress?.state +
									' - ' +
									agent?.documents?.aadhar?.verify_response?.data?.proofOfAddress?.pincode
							  ).trim() || ''
							: ''
					};
				}
				agent.image_base_url = CONFIG.IMAGE_BASE_URL;
				try {
					const result = await getDocumentObj(agent);
					if (result) {
						return {
							error: false,
							message: 'Agent details.',
							data: {agent: result}
						};
					}
				} catch (error) {
					app_error(error, {}, 'Agent Details', requestData);
					return {
						error: true,
						message: error.message
					};
				}
			} else {
				app_warning('No agent found!', {agent_id}, requestData, 'Agent Details');
				return {error: true, message: 'No agent found!'};
			}
		} else {
			app_warning('Unauthorized access.', {agentId}, requestData, 'Agent Details');
			return {error: true, message: 'Unauthorized access.'};
		}
	},

	/**
	 * get State list
	 * @param requestData
	 * @param role
	 * @param asm_id
	 * @param query
	 * @returns {Promise<{error: boolean, message: string}|{data: {agents: *}, error: boolean, message: string}|{error: boolean, message}>}
	 */
	getAgentRoleList: async (requestData, role, query) => {
		let agentId = requestData?.id;
		if (isEmpty(agentId)) {
			app_warning('Unauthorized access.', {agentId}, requestData, 'Get Agent Role List');
			return {error: true, message: 'Unauthorized access.'};
		} else {
			try {
				let search = {
					role: role,
					status: 'active'
				};
				if (query?.asm_id) search['reference.asm.id'] = query?.asm_id;
				if (query?.asm) search.agent_id = query?.asm;
				if (query?.tl) search.agent_id = query?.tl;
				const projection = {
					_id: 0,
					'name.full': 1,
					role: 1,
					agent_id: 1,
					reference: 1
				};
				let result = await findAgent(search, projection);
				if (result) {
					return {
						error: false,
						message: 'Asm/TL list.',
						data: {agents: result}
					};
				}
			} catch (error) {
				app_error(error, {}, 'Get Agent Role List', requestData);
				return {
					error: true,
					message: error.message
				};
			}
		}
	},

	/**
	 * get State list
	 * @param requestData
	 * @param query
	 */
	getCityList: async (requestData, query) => {
		let agentId = requestData.id;
		let queryData = query;
		if (isEmpty(agentId)) {
			app_warning('Unauthorized access.', {agentId}, requestData, 'Get City List');
			return {error: true, message: 'Unauthorized access.'};
		} else {
			let searchData = {};
			if (queryData.state) searchData.state = queryData.state;
			try {
				let projection = {_id: 0, code: 1, city: 1, state: 1, priority: 1};
				// eslint-disable-next-line unicorn/no-array-method-this-argument, unicorn/no-array-callback-reference
				const result = await CityModel.find(searchData, projection).sort({city: 1});
				if (result) {
					return {
						error: false,
						message: 'City lists are.',
						data: {cities: result}
					};
				}
			} catch (error) {
				app_error(error, {}, 'City List', requestData);
				return {
					error: true,
					message: error?.message
				};
			}
		}
	},

	/**
	 * get State list
	 * @param requestData
	 */
	changeRole: async (requestData) => {
		let agentId = requestData.loggedUser.id;
		if (isEmpty(agentId)) {
			return {error: true, message: 'Unauthorized access.'};
		} else {
			try {
				let agent_id = requestData.agent_id;
				let agent = await findOneAgent(
					{agent_id: agent_id},
					{
						agent_id: 1,
						'name.full': 1,
						status: 1,
						role: 1,
						createdAt: 1,
						location: 1
					},
					false
				);
				if (isEmpty(agent)) {
					app_warning('Invalid Agent!', {agent_id: agent_id}, requestData?.loggedUser, 'Change Role Agent');
					return {error: false, message: 'Invalid Agent!'};
				} else {
					let roles = [
						'regional_manager',
						'branch_manager',
						'asm',
						'third_party',
						'tl',
						'agent',
						'admin',
						'qc'
					];

					if (roles.includes(requestData.new_role)) {
						agent.role = requestData.new_role;
						agent.markModified('role');
						if (await agent.save())
							return {error: false, data: agent, message: 'Role changed successfully!'};
					} else {
						app_warning(
							'Invalid Role',
							{role: requestData.new_role},
							requestData?.loggedUser,
							'Change Role Agent'
						);
						return {
							error: true,
							message: 'Invalid Role'
						};
					}
				}
			} catch (error) {
				app_error(error, {}, 'Change Role Agent');
				return {
					error: true,
					message: error?.message
				};
			}
		}
	},

	/**
	 * get State list
	 * @param requestData
	 * @param agent_id
	 */
	agentMapping: async (requestData, agent_id) => {
		let agentId = requestData.loggedUser.id;
		if (isEmpty(agentId)) {
			return {error: true, message: 'Unauthorized access.'};
		} else {
			try {
				let agentDetails = await findOneAgent(
					{agent_id: agent_id},
					{
						_id: 1,
						agent_id: 1,
						name: 1,
						reference: 1,
						createdAt: -1
					},
					false
				);
				if (isEmpty(agentDetails)) {
					app_warning('Invalid Agent!', {agent_id: agent_id}, requestData?.loggedUser, 'Agent Mapping');
					return {error: false, message: 'Invalid Agent!'};
				} else {
					agentDetails.reference = {
						id: agentDetails.reference?.id,
						name: agentDetails.reference?.name,
						asm: {
							id: requestData?.reference?.asm?.id || '',
							name: requestData?.reference?.asm?.name || ''
						},
						third_party: {
							id: requestData?.reference?.third_party?.id || '',
							name: requestData?.reference?.third_party?.name || ''
						},
						tl: {
							id: requestData?.reference?.tl?.id || '',
							name: requestData?.reference?.tl?.name || ''
						}
					};
					agentDetails.markModified('reference');
					let agentSave = await agentDetails.save();
					if (agentSave)
						return {
							error: false,
							data: {
								agent_id: agentDetails.agent_id,
								name: agentDetails.name,
								reference: agentDetails.reference
							},
							message: 'Agent Mapped Successfully!'
						};
				}
			} catch (error) {
				app_error(error, {}, 'Agent Mapping', requestData?.loggedUser);
				return {
					error: true,
					message: error?.message
				};
			}
		}
	},

	/**
	 * get State list
	 * @param requestData
	 * @param agent_id
	 */
	locationMapping: async (requestData, agent_id) => {
		let agentId = requestData.loggedUser.id;
		if (isEmpty(agentId)) {
			return {error: true, message: 'Unauthorized access.'};
		} else {
			try {
				let agentDetails = await findOneAgent(
					{agent_id: agent_id},
					{
						_id: 1,
						name: 1,
						agent_id: 1,
						location: 1,
						createdAt: -1
					},
					false
				);
				if (isEmpty(agentDetails)) {
					app_warning(
						'Invalid Agent!',
						{agent_id: agent_id},
						requestData?.loggedUser,
						'Agent Location Mapping'
					);
					return {error: false, message: 'Invalid Agent!'};
				} else {
					agentDetails.location = {
						flat_no: requestData?.location?.flat_no,
						street_name: requestData?.location?.street_name,
						area: requestData?.location?.area,
						city: {
							name: requestData?.location?.city?.name,
							code: requestData?.location?.city?.code
						},
						state: {
							name: requestData?.location?.state?.name,
							code: requestData?.location?.state?.code
						},
						pincode: requestData?.location?.pincode
					};
					agentDetails.markModified('location');
					if (await agentDetails.save())
						return {
							error: false,
							data: {
								agent_id: agent_id,
								location: agentDetails.location
							},
							message: 'Location mapped successfully!!'
						};
				}
			} catch (error) {
				app_error(error, {}, 'Agent Location Mapping', requestData?.loggedUser);
				return {
					error: true,
					message: error?.message
				};
			}
		}
	},

	/**
	 * To approve clock in
	 * @param requestData
	 */
	approveClockIn: async (requestData) => {
		let agentId = requestData.loggedUser.id;
		if (isEmpty(agentId)) {
			return {error: true, message: 'Unauthorized access.'};
		} else {
			try {
				let currentDate = new Date();
				currentDate = moment(currentDate).format('YYYYMMDD');
				let updateData = {
					is_allow_clockin: true,
					allowed_date: currentDate
				};
				const agent = await AgentModel.findOneAndUpdate(
					{'phone.national_number': requestData.phone_number},
					updateData,
					{new: true}
				);

				if (agent) {
					return {error: false, data: agent, message: 'Clock in approved'};
				}
				app_warning(
					'Clock in not approved',
					{'phone.national_number': requestData.phone_number},
					requestData?.loggedUser,
					'Agent Clock-In'
				);
				return {error: true, message: 'Clock in not approved'};
			} catch (error) {
				app_warning(
					'Clock in not approved',
					{'phone.national_number': requestData.phone_number},
					requestData?.loggedUser,
					'Agent Clock-In'
				);
				return {
					error: true,
					message: error?.message
				};
			}
		}
	},

	/**
	 * Update Phone number
	 * @param requestData
	 */
	updatePhone: async (requestData) => {
		let agentId = requestData.loggedUser.id;
		if (isEmpty(agentId)) {
			return {error: true, message: 'Unauthorized access.'};
		} else {
			try {
				let agent_id = requestData.agent_id;
				let agentDetails = await findOneAgent(
					{'phone.national_number': requestData?.phone, agent_id: {$ne: agent_id}},
					{
						_id: 0,
						agent_id: 1,
						name: 1,
						phone: 1,
						createdAt: -1
					},
					false
				);
				if (isEmpty(agentDetails)) {
					try {
						let agent = await findOneAgent(
							{agent_id: agent_id},
							{
								agent_id: 1,
								name: 1,
								'phone.national_number': 1,
								createdAt: 1
							},
							false
						);
						if (agent) {
							agent.name.full = requestData?.agent_name;
							agent.phone.national_number = requestData?.phone;
							agent.markModified('name');
							agent.markModified('phone.national_number');
							await agent.save();
							return {
								error: false,
								data: {
									agent_id: agent.agent_id,
									name: agent.name,
									phone: {
										national_number: agent?.phone?.national_number
									}
								},
								message: 'Update success'
							};
						} else {
							app_warning(
								'Agent not found',
								{agent_id: agent_id},
								requestData?.loggedUser,
								'Update Agent Phone'
							);
							return {error: true, message: 'Agent not found'};
						}
					} catch (error) {
						app_error(error, {}, 'Update Agent Phone', requestData?.loggedUser);
						return {error: true, message: 'Failed to update agent'};
					}
				} else {
					app_warning(
						'Phone Number already exists',
						{'phone.national_number': requestData?.phone, agent_id: {$ne: agent_id}},
						requestData?.loggedUser,
						'Update Agent Phone'
					);
					return {error: false, message: 'Phone Number already exists'};
				}
			} catch (error) {
				app_error(error, {}, 'Update Agent Phone', requestData?.loggedUser);
				return {
					error: true,
					message: error?.message
				};
			}
		}
	},

	/**
	 * Change Status
	 * @param requestData
	 * @param agent_id
	 */
	changeStatus: async (requestData, agent_id) => {
		let agentId = requestData.id;
		if (isEmpty(agentId)) {
			return {error: true, message: 'Unauthorized access.'};
		} else {
			try {
				let agent = await findOneAgent(
					{agent_id: agent_id},
					{
						_id: 1,
						agent_id: 1,
						status: 1,
						role: 1,
						kong_termination_id: 1,
						createdAt: 1
					},
					false
				);
				if (isEmpty(agent)) {
					app_warning('Invalid Agent!', {agent_id: agent_id}, requestData, 'Change Status Agent');
					return {error: false, message: 'Invalid Agent!'};
				} else {
					let status = agent['status'] === 'active' ? 'deactive' : 'active';
					agent.status = status;
					agent.markModified('status');
					let response;
					if (status === 'deactive') {
						response = await requestTermination(agent_id);
						agent.kong_termination_id = response.data;
					} else {
						let id = agent?.kong_termination_id;
						response = await activateTermination(agent_id, id);
						agent.kong_termination_id = '';
					}
					agent.markModified('kong_termination_id');
					if (!response.error) {
						await agent.save();
						return {error: false, data: response, message: 'Status changed successfully!'};
					}

					app_warning('Something went wrong!', {response}, requestData, 'Status Change Agent');
					return {error: true, message: response || 'Something went to wrong!'};
				}
			} catch (error) {
				app_error(error, {}, 'Status Change Agent', requestData);
				return {
					error: true,
					message: error?.message
				};
			}
		}
	},

	/**
	 * Approve agent
	 * @param requestData
	 * @param agent_id
	 */
	approveAgent: async (requestData, agent_id) => {
		let agentId = requestData.id;
		if (isEmpty(agentId)) {
			return {error: true, message: 'Unauthorized access.'};
		} else {
			try {
				let agent = await findOneAgent(
					{agent_id: agent_id},
					{
						_id: 1,
						agent_id: 1,
						status: 1,
						role: 1,
						'documents.status': 1,
						createdAt: 1
					},
					false
				);
				if (isEmpty(agent)) {
					app_warning('Invalid Agent!', {agent_id: agent_id}, requestData, 'Approve Agent');
					return {error: false, message: 'Invalid Agent!'};
				} else {
					agent.documents.status = 'approved';
					agent.markModified('documents.status');
					let isSaved = await agent.save();
					if (isSaved) {
						return {
							error: false,
							data: {
								agent_id: agent_id,
								document_status: agent.documents.status,
								role: agent.role,
								createdAt: agent.createdAt
							},
							message: 'Agent approved successfully!'
						};
					}
				}
			} catch (error) {
				app_error(error, {}, 'Approve Agent', requestData);
				return {
					error: true,
					message: error?.message
				};
			}
		}
	},

	/**
	 * Delete agent
	 * @param requestData
	 * @param agent_id
	 */
	deleteAgent: async (requestData, agent_id) => {
		let agentId = requestData.id;
		if (isEmpty(agentId)) {
			return {error: true, message: 'Unauthorized access.'};
		} else {
			try {
				let agent = await findOneAgent(
					{agent_id: agent_id},
					{
						_id: 1,
						agent_id: 1,
						createdAt: 1
					},
					false
				);
				if (isEmpty(agent)) {
					app_warning('Invalid Agent!', {agent_id: agent_id}, requestData, 'Delete Agent');
					return {error: false, message: 'Invalid Agent!'};
				} else {
					let response = await deleteUser(agent_id);
					if (!response.error) {
						await agent.delete();
						return {error: false, data: {}, message: 'Agent deleted successfully!'};
					}
					app_warning('Something went wrong!', {response}, requestData, 'Delete Agent');
					return {error: false, data: {}, message: 'Something went wrong!'};
				}
			} catch (error) {
				app_error(error, {}, 'Delete Agent', requestData);
				return {
					error: true,
					message: error?.message
				};
			}
		}
	}
};

module.exports = AgentController;
