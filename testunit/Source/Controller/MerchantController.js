const {isEmpty, getShortId, generateDynamicLinks, networkCall, dateFinder} = require('../Helpers/Utils');
const CONFIG = require('../App/Config');
const Fs = require('node:fs');
const MomentTimeZone = require('moment-timezone');
const Moment = require('moment');
const {findOneMerchant} = require('../Repository/MerchantRepository');
const MerchantModel = require('../Models/MerchantModel');
const ReferralCodeGenerator = require('referral-code-generator');
const {app_warning, app_error} = require('../Helpers/Logger');

const MerchantController = {
	/**
	 * To get referral code
	 * @returns {Promise<Promise<*|string>|string|*>}
	 */
	getReferralCode: async () => {
		let referralCode = ReferralCodeGenerator.alphaNumeric('lowercase', 3, 1);
		return (await findOneMerchant({'referral.code': referralCode}, '', true))
			? MerchantController.getReferralCode()
			: referralCode;
	},

	/**
	 * To create Merchant and Sub Merchant
	 * @param merchantCreateData
	 * @param merchantId
	 * @returns {Promise<{data: *, error: boolean, message: *}|{error: boolean, message: string}|{data: {}, error: boolean, message: string}|{error: boolean, message: (*|string)}>}
	 */
	createMerchant: async (merchantCreateData, merchantId) => {
		try {
			let existingMerchant = await findOneMerchant(
				{'phone.national_number': merchantCreateData?.phone},
				'',
				true
			);
			if (!isEmpty(existingMerchant)) {
				app_warning(
					'Merchant/Sub-Merchant already exists!',
					{'phone.national_number': merchantCreateData?.phone},
					merchantCreateData?.loggedUser,
					'Merchant Create'
				);
				return {error: true, message: 'Merchant/Sub-Merchant already exists!'};
			}
			let accountType = 'store_';
			let role = 'merchant';
			let parentId = '';
			let referralCode;
			let dynamicLink;
			if (isEmpty(merchantId)) {
				referralCode = await MerchantController.getReferralCode();
				dynamicLink = await generateDynamicLinks(referralCode);
				if (dynamicLink?.error === true) {
					app_warning(
						'Something went wrong when fetching referral link. Please try again after sometimes.',
						{dynamicLink},
						merchantCreateData?.loggedUser,
						'Merchant Create'
					);
					return {
						error: true,
						message: 'Something went wrong when fetching referral link. Please try again after sometimes.'
					};
				}
			} else {
				let existingMerchant = await findOneMerchant({merchant_id: merchantId}, '', true);
				if (isEmpty(existingMerchant)) {
					app_warning(
						'Merchant Not Found!',
						{merchant_id: merchantId},
						merchantCreateData?.loggedUser,
						'Merchant Create'
					);
					return {
						error: true,
						message: 'Merchant Not Found!'
					};
				} else {
					role = 'subuser';
					parentId = merchantId;
					accountType = 'sub-merchant_';
				}
			}
			let merchantID = getShortId();
			let storeName = merchantCreateData?.storeName || '';
			let loc, latlng;
			if (!isEmpty(merchantCreateData?.loc)) {
				loc = [merchantCreateData?.loc[0], merchantCreateData?.loc[1]];
				latlng = [merchantCreateData?.loc[1], merchantCreateData?.loc[0]];
			}
			let merchantData = {
				merchant_id: merchantID,
				parent_id: parentId,
				role: role,
				business_type: merchantCreateData?.business_type ?? 'trade',
				merchant_code: storeName ? storeName?.replace(/\W/g, '')?.toUpperCase() : '',
				phone: {
					is_verified: (merchantCreateData?.phone && merchantCreateData?.phone?.is_verified) || false,
					national_number: merchantCreateData?.phone ?? ''
				},
				email: {
					primary: merchantCreateData?.email ?? ''
				},
				name: {
					full: merchantCreateData?.merchant_name || '',
					store: storeName
				},
				business: {
					name: storeName
				},
				location: {
					agent_store: {
						street_name: merchantCreateData?.location?.street_name || '',
						area: merchantCreateData?.location?.area || '',
						city: merchantCreateData?.location?.city || '',
						state: merchantCreateData?.location?.state || '',
						pincode: merchantCreateData?.location?.pincode || ''
					},
					latlng: latlng || []
				},
				loc: loc || [],
				referral: {
					code: referralCode ?? '',
					url: dynamicLink?.data?.shortLink || '',
					referred_by: ''
				},
				is_agent_onboard: false,
				terms: true,
				settlement_mode: {
					imps: false,
					neft: true
				},
				is_sound_box: merchantCreateData?.is_sound_box ?? false,
				bank_approval: 'approved',
				acc_type: accountType,
				source: 'admin'
			};

			let options = {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				url: CONFIG.SERVICE.AUTH_SERVICE_URL + '/merchant/create',
				body: merchantData,
				admin: merchantCreateData?.loggedUser
			};
			let merchantCreate = await networkCall(options);
			if (merchantCreate?.error)
				app_error(merchantCreate?.error, {}, 'Merchant Create', merchantCreateData?.loggedUser);
			let resultData = JSON.parse(merchantCreate?.body);
			let valid = resultData?.success;
			if (!valid) {
				app_warning(
					resultData?.message || 'Could not create Merchant/Sub-Merchant',
					resultData,
					merchantCreateData?.loggedUser,
					'Merchant Create'
				);
				return {error: true, message: resultData?.message || 'Could not create Merchant/Sub-Merchant'};
			}
			return {error: false, message: resultData?.message, data: resultData?.data};
		} catch (error) {
			app_error(error, {}, 'Merchant Create', merchantCreateData?.loggedUser);
			return {error: true, message: 'Something went wrong! Please try again'};
		}
	},

	/**
	 * To update Merchant
	 * @param merchantUpdateDetails
	 * @param merchantId
	 * @returns {Promise<{data: *, error: boolean, message: *}|{error: boolean, message: string}|{error: boolean, message: (*|string)}>}
	 */
	updateMerchant: async (merchantUpdateDetails, merchantId) => {
		let merchantData = {name: {}, location: {agent_store: {}}};
		let existingMerchant = await findOneMerchant({merchant_id: merchantId, status: 'active'}, '', true);
		if (isEmpty(existingMerchant)) {
			app_warning(
				'Merchant Not Found!',
				{merchant_id: merchantId, status: 'active'},
				merchantUpdateDetails?.loggedUser,
				'Update Merchant'
			);
			return {error: true, message: 'Merchant Not Found!'};
		} else {
			try {
				if (!isEmpty(merchantUpdateDetails?.email)) {
					merchantData.email = {primary: merchantUpdateDetails?.email};
				}

				if (!isEmpty(merchantUpdateDetails?.phone)) {
					let existingNumber = await findOneMerchant(
						{'phone.national_number': merchantUpdateDetails?.phone, merchant_id: {$ne: merchantId}},
						{},
						true
					);
					if (!isEmpty(existingNumber)) {
						app_warning(
							'Phone Number already exists',
							{'phone.national_number': merchantUpdateDetails?.phone, merchant_id: {$ne: merchantId}},
							merchantUpdateDetails?.loggedUser,
							'Update Merchant'
						);
						return {error: true, message: 'Phone Number already exists'};
					}
					merchantData.phone = {national_number: merchantUpdateDetails?.phone};
				}

				if (!isEmpty(merchantUpdateDetails?.merchant_name)) {
					merchantData.name.full = merchantUpdateDetails?.merchant_name;
				}

				if (!isEmpty(merchantUpdateDetails?.storeName)) {
					merchantData.name.store = merchantUpdateDetails?.storeName;
					merchantData.business = {name: merchantUpdateDetails?.storeName};
				}

				if (!isEmpty(merchantUpdateDetails?.location?.street_name)) {
					merchantData.location.agent_store.street_name = merchantUpdateDetails?.location?.street_name;
				}

				if (!isEmpty(merchantUpdateDetails?.location?.area)) {
					merchantData.location.agent_store.area = merchantUpdateDetails?.location?.area;
				}

				if (!isEmpty(merchantUpdateDetails?.location?.city)) {
					merchantData.location.agent_store.city = merchantUpdateDetails?.location?.city;
				}

				if (!isEmpty(merchantUpdateDetails?.location?.state)) {
					merchantData.location.agent_store.state = merchantUpdateDetails?.location?.state;
				}

				if (!isEmpty(merchantUpdateDetails?.location?.pincode)) {
					merchantData.location.agent_store.pincode = merchantUpdateDetails?.location?.pincode;
				}

				if (!isEmpty(merchantUpdateDetails?.location?.is_same_store_contact)) {
					merchantData.location.is_same_store_contact =
						merchantUpdateDetails?.location?.is_same_store_contact;
				}

				let options = {
					method: 'PATCH',
					headers: {
						'Content-Type': 'application/json'
					},
					url: CONFIG.SERVICE.AUTH_SERVICE_URL + '/merchant/update/' + merchantId,
					body: merchantData,
					admin: merchantUpdateDetails?.loggedUser
				};
				let merchantUpdate = await networkCall(options);
				if (merchantUpdate?.error)
					app_error(merchantUpdate?.error, {}, 'Merchant Update', merchantUpdateDetails?.loggedUser);
				let resultData = JSON.parse(merchantUpdate?.body);
				let valid = resultData?.success;
				if (!valid) {
					app_warning(
						resultData?.message ||
							'Something went wrong. Could not update merchant. Please try after sometimes',
						resultData,
						merchantUpdateDetails?.loggedUser,
						'Update Merchant'
					);
					return {
						error: true,
						message:
							resultData?.message ||
							'Something went wrong. Could not update merchant. Please try after sometimes'
					};
				}
				return {error: false, message: resultData?.message, data: resultData?.data};
			} catch (error) {
				app_error(error, {}, 'Update Merchant', merchantUpdateDetails?.loggedUser);
				return {error: true, message: 'Something went wrong! Please try again'};
			}
		}
	},

	/**
	 * To change the status of the merchant
	 * @param loggedUser
	 * @param merchantId
	 * @returns {Promise<{data: *, error: boolean, message: *}|{error: boolean, message: string}|{data: {}, error: boolean, message: string}|{error: boolean, message: (*|string)}>}
	 */
	changeStatus: async (loggedUser, merchantId) => {
		let existingMerchant = await findOneMerchant({merchant_id: merchantId}, {}, true);
		if (isEmpty(existingMerchant)) {
			app_warning(
				'Merchant Not Found!',
				{merchant_id: merchantId, status: 'active'},
				loggedUser,
				'Change Status Merchant'
			);
			return {error: true, message: 'Merchant not found'};
		} else {
			try {
				let options = {
					url: CONFIG.SERVICE.AUTH_SERVICE_URL + '/merchant/change-status/' + merchantId,
					method: 'PATCH',
					admin: loggedUser
				};
				let merchantStatusUpdate = await networkCall(options);
				if (merchantStatusUpdate?.error)
					app_error(merchantStatusUpdate?.error, {}, 'Update Merchant', loggedUser);
				let resultData = JSON.parse(merchantStatusUpdate?.body);
				let valid = resultData?.success;
				if (!valid) {
					app_warning(
						resultData?.message ||
							'Something went wrong. Could not update status. Please try after sometimes.',
						resultData,
						loggedUser,
						'Change Status Merchant'
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
				app_error(error, {}, 'Update Merchant', loggedUser);
				return {error: true, message: 'Something went wrong! Please try again'};
			}
		}
	},

	/**
	 * To view Merchant details
	 * @param loggedUser
	 * @param merchantId
	 * @returns {Promise<{data: *, error: boolean, message: *}|{error: boolean, message: string}|{error: boolean, message: (*|string)}>}
	 */
	merchantDetails: async (loggedUser, merchantId) => {
		let existingMerchant = await findOneMerchant({merchant_id: merchantId}, '', true);
		if (isEmpty(existingMerchant)) {
			app_warning('Merchant Not Found!', {merchant_id: merchantId}, loggedUser, 'Merchant Details');
			return {error: true, message: 'Merchant Not Found!'};
		} else {
			try {
				let options = {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json'
					},
					url: CONFIG.SERVICE.AUTH_SERVICE_URL + '/merchant/details/' + merchantId,
					admin: loggedUser
				};

				let merchantDetails = await networkCall(options);
				if (merchantDetails?.error) app_error(merchantDetails?.error, {}, 'Merchant Details', loggedUser);
				let resultData = JSON.parse(merchantDetails?.body);
				let valid = resultData?.success;
				if (!valid) {
					app_warning(
						resultData?.message ||
							'Something went wrong while fetching merchant details. Please try again after sometimes.',
						resultData,
						loggedUser,
						'Merchant Details'
					);
					return {
						error: true,
						message:
							resultData?.message ||
							'Something went wrong while fetching merchant details. Please try again after sometimes.'
					};
				}
				return {error: false, message: resultData?.message, data: resultData?.data};
			} catch (error) {
				app_error(error, {}, 'Merchant Details', loggedUser);
				return {error: true, message: 'Something went wrong! Please try again'};
			}
		}
	},

	/**
	 * To list merchants
	 * @param queryData
	 * @param loggedUser
	 * @returns {Promise<{data: *, error: boolean, message: *}|{error: boolean, message: string}|{error: boolean, message: (*|string)}>}
	 */
	merchantList: async (queryData, loggedUser) => {
		try {
			let options = {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				},
				url: CONFIG.SERVICE.AUTH_SERVICE_URL + '/merchant/list',
				admin: loggedUser
			};

			if (!isEmpty(queryData)) {
				let query = {};
				if (queryData?.limit) query.limit = queryData?.limit;
				if (queryData?.page) query.page = queryData?.page;
				if (queryData?.from_time) query.from_time = queryData?.from_time;
				if (queryData?.to_time) query.to_time = queryData?.to_time;
				if (queryData?.date_option) query.date_option = queryData?.date_option;
				if (queryData?.partner_id) query.partner_id = queryData?.partner_id;
				if (queryData?.merchant_id) {
					let existingMerchant = await findOneMerchant({merchant_id: queryData?.merchant_id}, '', true);
					if (isEmpty(existingMerchant)) {
						app_warning(
							'Merchant Not Found!',
							{merchant_id: queryData?.merchant_id},
							loggedUser,
							'Merchant List'
						);
						return {error: true, message: 'Merchant Not Found!'};
					}
					query.merchant_id = queryData?.merchant_id;
				}
				if (queryData?.status) query.status = queryData?.status;
				if (queryData?.document_status) query.document_status = queryData?.document_status;
				if (queryData?.phone) query.phone = queryData?.phone;
				if (queryData?.merchant_name) query.merchant_name = queryData?.merchant_name;
				if (queryData?.store_name) query.merchant_store_name = queryData?.store_name;
				if (queryData?.business_type) query.business_type = queryData?.business_type;
				if (queryData?.onboard_type) query.onboard_type = queryData?.onboard_type;
				if (queryData?.asm) {
					query.asm = queryData?.asm;
					if (queryData?.tl) query.tl = queryData?.tl;
				}

				let urlAppender = new URLSearchParams(query);
				options.url += '?' + urlAppender;
			}

			let merchantList = await networkCall(options);
			if (merchantList?.error) app_error(merchantList?.error, {}, 'Merchant List', loggedUser);
			let resultData = JSON.parse(merchantList?.body);
			let valid = resultData?.success;
			if (!valid) {
				app_warning(
					resultData?.message || 'There is no merchant list',
					resultData,
					loggedUser,
					'Merchant List'
				);
				return {
					error: true,
					message: resultData?.message || 'There is no merchant list'
				};
			}
			return {error: false, message: resultData?.message, data: resultData?.data};
		} catch (error) {
			app_error(error, {}, 'Merchant List', loggedUser);
			return {error: true, message: 'Something went wrong! Please try again'};
		}
	},
	/**
	 * To export merchant
	 * @param queryData
	 * @param response
	 * @returns {Promise<{response.write(bufferdata)}|{error: boolean, message: string}>}
	 */
	exportMerchant: async (queryData, response) => {
		try {
			let query = {role: 'merchant'};
			if (!isEmpty(queryData)) {
				if (queryData?.from_time || queryData?.to_time || queryData?.date_option) {
					query.createdAt = dateFinder(queryData);
				}
				if (queryData?.partner_id) query['partner.id'] = queryData?.partner_id;
				if (queryData?.status) query.status = queryData?.status;
				if (queryData?.document_status) query['documents.status'] = queryData?.document_status;
				if (queryData?.phone) query['phone.national_number'] = queryData?.phone;
				if (queryData?.merchant_name) query['name.full'] = queryData?.merchant_name;
				if (queryData?.store_name) query['name.store'] = queryData?.store_name;
				if (queryData?.onboard_type) query.is_agent_onboard = queryData?.onboard_type === 'self' ? false : true;
				if (queryData?.asm) {
					query['reference.asm_id'] = queryData?.asm;
					if (queryData?.tl) query['reference.tl_id'] = queryData?.tl;
				}
				if (queryData?.merchant_id) {
					let existingMerchant = await findOneMerchant({merchant_id: queryData?.merchant_id}, '', true);
					if (isEmpty(existingMerchant)) {
						app_warning(
							'Merchant Not Found!',
							{merchant_id: queryData?.merchant_id},
							'',
							'Merchant Export'
						);
						return {error: true, message: 'Merchant Not Found!'};
					}
					query.merchant_id = queryData?.merchant_id;
				}
				let recordCheck = await findOneMerchant(query, '', false);
				if (!recordCheck)
					return response.status(400).send({success: false, message: 'no related record found'});
			}

			// eslint-disable-next-line unicorn/no-array-method-this-argument, unicorn/no-array-callback-reference
			let existingMerchant = MerchantModel.find(query, {
				_id: 0,
				merchant_id: 1,
				name: 1,
				'email.primary': 1,
				'phone.national_number': 1,
				location: 1,
				createdAt: 1
			})
				.sort({_id: -1})
				.cursor();

			let filename = 'temp/report_' + MomentTimeZone().format('YYYYMMDD_HHmmss') + '.csv';
			// eslint-disable-next-line security/detect-non-literal-fs-filename
			const csvWriteStream = Fs.createWriteStream(filename);
			let headers = ['merchant_id', 'Merchant Name', 'Store Name', 'Email', 'Phone', 'Address', 'createdAt'];
			csvWriteStream.write(`${headers.join(',')}\n`);
			existingMerchant.on(
				'data',
				(data) => {
					let store_address = Object.values(data?.location?.agent_store);
					let fulladdress = store_address.join(',').replace(/^,*|,(?=,)/g, '');
					const csvRow = `${data?.merchant_id || ''},${data?.name?.full || ''},${data?.name?.store || ''},${
						data?.email?.primary || ''
					},${data?.phone?.national_number || ''},"${fulladdress || data?.location?.address || '-'}", ${
						Moment(data?.createdAt).format('DD-MM-YYYY h:mm A') || ''
					}\n`;
					csvWriteStream.write(csvRow);
				},
				(error) => {
					if (error) {
						throw new Error('Error while retrieving data from MongoDB:', error);
					}
					csvWriteStream.end();
				}
			);
			existingMerchant.on('end', async () => {
				// eslint-disable-next-line security/detect-non-literal-fs-filename
				let csvFile = Fs.createReadStream(filename);
				response.statusCode = 200;
				response.setHeader('Content-type', 'application/csv');
				response.setHeader('Access-Control-Allow-Origin', '*');
				response.setHeader('Content-disposition', 'attachment; filename=Report.csv');
				csvFile.on(
					'data',
					async (data) => {
						await response.write(Buffer.from(data).toString('utf8'));
					},
					(error) => {
						if (error) {
							throw new Error('Error while retrieving data from MongoDB:', error);
						}
						csvFile.close();
					}
				);
				csvFile.on('close', async () => {
					// eslint-disable-next-line security/detect-non-literal-fs-filename
					Fs.unlinkSync(filename);
					return await response.end();
				});
			});
		} catch (error) {
			return {error: true, message: 'Something went wrong ' + error.message};
		}
	}
};

module.exports = MerchantController;
