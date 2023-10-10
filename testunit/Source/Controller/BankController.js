const Config = require('../App/Config');
const {isEmpty, networkCall} = require('../Helpers/Utils');
const Ifsc = require('ifsc');
const {findOneMerchant} = require('../Repository/MerchantRepository');
const {app_warning, app_error} = require('../Helpers/Logger');

const BankController = {
	/**
	 * To Fetch the Bank List of a Merchant
	 * @param loggedUser
	 * @param postData
	 * @param merchantId
	 * @returns {Promise<{data: *, error: boolean, message: *}|{error: boolean, message: string}>}
	 */
	list: async (loggedUser, postData, merchantId) => {
		try {
			let options = {
				method: 'GET',
				url: Config.SERVICE.BANKING_SERVICE_URL + '/beneficiary/list',
				admin: loggedUser
			};

			if (!isEmpty(merchantId)) {
				let existingMerchant = await findOneMerchant({merchant_id: merchantId, role: 'merchant'}, '', true);
				if (isEmpty(existingMerchant)) {
					app_warning(
						'Merchant Not Found!',
						{merchant_id: merchantId, role: 'merchant'},
						loggedUser,
						'Bank List'
					);
					return {
						error: true,
						message: 'Merchant Not Found!'
					};
				}
				options.url = options.url + '/' + merchantId;
			}

			if (!isEmpty(postData)) {
				let queryData = {};
				if (postData?.limit) {
					queryData.limit = postData?.limit;
				}
				if (postData?.page) {
					queryData.page = postData?.page;
				}
				if (postData?.acc_holder_name) {
					queryData.acc_holder_name = postData?.acc_holder_name;
				}
				if (postData?.acc_no) {
					queryData.acc_no = postData?.acc_no;
				}
				if (postData?.ifsc) {
					queryData.ifsc = postData?.ifsc;
				}
				if (postData?.bank_name) {
					queryData.bank_name = postData?.bank_name;
				}

				let urlAppender = new URLSearchParams(queryData);
				options.url += '?' + urlAppender;
			}

			let bankList = await networkCall(options);
			if (bankList?.error) app_error(bankList?.error, {}, 'Bank List', loggedUser);
			let resultData = JSON.parse(bankList?.body);
			let valid = resultData?.success;
			if (!valid) {
				app_warning(resultData?.message || 'Could not fetch bank list', resultData, loggedUser, 'Bank List');
				return {error: true, message: resultData?.message || 'Could not fetch bank list'};
			}
			return {error: false, message: resultData?.message, data: resultData?.data};
		} catch (error) {
			app_error(error, {}, 'Bank List', loggedUser);
			return {error: true, message: 'Something went wrong'};
		}
	},

	/**
	 * to create bank for a merchant
	 * @param loggedUser
	 * @param requestData
	 * @param merchantId
	 * @returns {Promise<{data: *, error: boolean, message: *}|{error: boolean, message: string}>}
	 */
	create: async (loggedUser, requestData, merchantId) => {
		try {
			let existingMerchant = await findOneMerchant({merchant_id: merchantId, role: 'merchant'}, '', true);
			if (isEmpty(existingMerchant)) {
				app_warning(
					'Merchant Not Found!',
					{merchant_id: merchantId, role: 'merchant'},
					loggedUser,
					'Beneficiary Create'
				);
				return {
					error: true,
					message: 'Merchant Not Found!'
				};
			}
			let fetchData = await BankController.fetchIfscDetails(requestData?.ifsc);
			if (isEmpty(fetchData?.data)) {
				return {error: true, message: 'Not Valid Ifsc'};
			}
			let ifscData = fetchData?.data;
			let bankData = {
				merchant: {
					merchant_id: merchantId,
					bank_info: {
						acc_no: requestData?.acc_no,
						acc_holder_name: requestData?.acc_holder_name,
						image: '',
						branch: ifscData?.BRANCH,
						district: ifscData?.DISTRICT,
						state: ifscData?.STATE,
						address: ifscData?.ADDRESS,
						city: ifscData?.CITY,
						name: ifscData?.BANK,
						code: ifscData?.BANK_CODE,
						ifsc: ifscData?.IFSC
					}
				}
			};

			let options = {
				method: 'POST',
				body: bankData,
				url: Config.SERVICE.BANKING_SERVICE_URL + '/beneficiary/create',
				admin: loggedUser
			};

			let bankResult = await networkCall(options);
			if (bankResult?.error) app_error(bankResult?.error, {}, 'Beneficiary Create', loggedUser);
			let resultData = JSON.parse(bankResult?.body);
			let valid = resultData?.success;
			if (!valid) {
				app_warning(
					resultData?.message || 'Beneficiary Account Cannot Be Created',
					resultData,
					loggedUser,
					'Beneficiary Create'
				);
				return {error: true, message: resultData?.message || 'Beneficiary Account Cannot Be Created'};
			}
			return {
				error: false,
				message: 'Beneficiary account created successfully',
				data: resultData?.data
			};
		} catch (error) {
			app_error(error, {}, 'Create Beneficiary Account', loggedUser);
			return {error: true, message: 'Something went wrong'};
		}
	},
	/**
	 *To check if the ifsc code provided is valid
	 * @param ifscCode
	 * @param loggedUser
	 * @returns {Promise<{error: boolean, message: string}|{data: {BRANCH: *, DISTRICT: *, BANK: *, CITY: *, ADDRESS: *, STATE: *, BANK_CODE: *, NAME: *, IFSC: *}, error: boolean, message: string}>}
	 */
	fetchIfscDetails: async (ifscCode, loggedUser) => {
		if (!Ifsc.validate(ifscCode)) {
			app_warning('Not Valid Ifsc ifsc code is not valid', {IFSC: ifscCode}, loggedUser, 'Fetch IFSC Details');
			return {error: true, message: 'ifsc code is not valid'};
		}
		let ifscData = await Ifsc.fetchDetails(ifscCode);

		if (ifscData) {
			let bankData = {
				BANK: ifscData?.BANK,
				BRANCH: ifscData?.BRANCH,
				DISTRICT: ifscData?.DISTRICT,
				STATE: ifscData?.STATE,
				ADDRESS: ifscData?.ADDRESS,
				CITY: ifscData?.CITY,
				NAME: ifscData?.BANK,
				BANK_CODE: ifscData?.BANKCODE,
				IFSC: ifscData?.IFSC
			};
			return {error: false, message: 'Ifsc data', data: bankData};
		} else {
			app_warning('Something is wrong', {ifscCode}, loggedUser, 'IFSC Details');
			return {error: true, message: 'Something is wrong'};
		}
	}
};
module.exports = BankController;
