const Request = require('request');
const Crypto = require('node:crypto');
const CONFIG = require('../App/Config');
const {customAlphabet} = require('nanoid');
const Nanoid = customAlphabet('1234567890', 6);
const Logger = require('./Logger');
const ShortId = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789', 10);
const Moment = require('moment');
const FCM = require('fcm-push');
const fcm = new FCM(CONFIG.PUSH.android.serverKey);

const Utils = {
	/**
	 * Function for checking whether the data is empty
	 * @param data
	 * @returns {boolean}
	 */
	isEmpty: (data) => {
		if (data === null || data === undefined) {
			return true;
		}
		if (typeof data === 'string' && data.replaceAll(' ', '').length > 0) {
			return false;
		}
		if (typeof data === 'number') {
			return false;
		}
		if (typeof data === 'boolean') {
			return false;
		}
		if (Array.isArray(data) && data.length > 0) {
			return false;
		}
		return !(typeof data === 'object' && Object.keys(data).length > 0);
	},

	/**
	 * To generate dynamic link
	 * @param referralCode
	 * @returns {Promise<{data: any, error: boolean, message: string}|{data: (*|undefined), error: boolean, message: (*|string)}>}
	 */
	generateDynamicLinks: async (referralCode) => {
		let requestBody = {
			dynamicLinkInfo: {
				domainUriPrefix: 'https://ippopay.page.link',
				link: 'https://ippopay.com/app-store?referral=' + referralCode,
				androidInfo: {
					androidPackageName: 'com.ippopay.store'
				},
				iosInfo: {
					iosBundleId: 'com.ippopay.store'
				},
				socialMetaTagInfo: {
					socialTitle: 'Ippopay for Store',
					socialDescription: '',
					socialImageLink: ''
				}
			},
			suffix: {
				option: 'SHORT'
			}
		};
		try {
			let options = {
				url: CONFIG.FIREBASE_DYN_URL,
				headers: {
					'Content-Type': 'application/json'
				},
				body: requestBody,
				json: true,
				method: 'POST'
			};
			let dynamicLink = await Utils.networkCall(options);
			let resultData = JSON.parse(dynamicLink?.body);
			if (!Utils.isEmpty(dynamicLink?.error)) {
				return {error: true, message: dynamicLink?.error};
			}
			return {error: false, message: 'Dynamic Link', data: resultData};
		} catch {
			return {error: true, message: 'Something went wrong! Please try again'};
		}
	},

	/**
	 *push notification
	 * @param androidTo
	 * @param iosTo
	 * @param callback
	 * @param payload
	 * @returns {Promise<void>}
	 */

	sendPush: async (androidTo, payload, callback) => {
		if (androidTo) {
			let message = {
				registration_ids: androidTo, // required fill with device token or topics
				priority: 'high',
				data: {
					data: payload,
					click_action: 'FLUTTER_NOTIFICATION_CLICK'
				}
			};
			fcm.send(message, (error, response) => {
				// eslint-disable-next-line no-console
				console.log(error, response);
			});
			callback();
		}
	},

	/**
	 * To Get User ID and Role
	 * @param consumerUsername
	 * @returns {string[]}
	 */
	getIdAndRole: (consumerUsername) => {
		return (consumerUsername || '').split('_');
	},

	/**
	 * To get userId
	 * @param request
	 * @returns {*}
	 */
	getUserId: (request) => {
		return request?.headers['x-consumer-username'].split('_')[1];
	},

	/**
	 * To get short id
	 * @returns {string}
	 */
	getShortId: () => {
		return ShortId();
	},
	/**
	 * To hash password
	 * @param input
	 * @returns {string}
	 */
	createHashPwd: (input) => {
		return Crypto.createHash('md5').update(input).digest('hex');
	},
	/**
	 * To generate verification code
	 * @returns {string}
	 */
	generateVerificationCode: () => {
		return Nanoid();
	},

	dateFinder: (data) => {
		let query = {};
		let toDate = Moment().endOf('day').toDate();
		let previousDay = Moment().startOf('day').subtract(1, 'day').toDate();
		let thisWeek = Moment().startOf('week').toDate();
		let thisMonth = Moment().startOf('month').toDate();
		let thisYear = Moment().startOf('year').toDate();

		if (data?.date_option) {
			let fromDate;
			switch (data?.date_option) {
				case 'weekly': {
					fromDate = thisWeek;
					query = {$gte: fromDate, $lte: toDate};
					break;
				}
				case 'monthly': {
					fromDate = thisMonth;
					query = {$gte: fromDate, $lte: toDate};
					break;
				}
				case 'yearly': {
					fromDate = thisYear;
					query = {$gte: fromDate, $lte: toDate};
					break;
				}
				case 'yesterday': {
					fromDate = previousDay;
					toDate = Moment().endOf('day').subtract(1, 'day').toDate();
					query = {$gte: fromDate, $lt: toDate};
					break;
				}
				default: {
					fromDate = new Date(Moment().startOf('day'));
					query = {$gte: fromDate, $lte: toDate};
					break;
				}
			}
		}
		if (data?.from_time) {
			let startTime = new Date(data?.from_time);
			startTime.setHours('00');
			startTime.setMinutes('00');
			startTime.setSeconds('00');
			query = {$gte: startTime};
		}

		if (data?.to_time) {
			let endTime = new Date(data?.to_time);
			endTime.setHours('23');
			endTime.setMinutes('59');
			endTime.setSeconds('59');
			query = {$lte: endTime};
		}

		if (data?.from_time && data?.to_time) {
			let startTime = new Date(data?.from_time);
			startTime.setHours('00');
			startTime.setMinutes('00');
			startTime.setSeconds('00');

			let endTime = new Date(data?.to_time);
			endTime.setHours('23');
			endTime.setMinutes('59');
			endTime.setSeconds('59');

			query = {$gte: startTime, $lt: endTime};
		}

		return query;
	},

	/**
	 * To send verification code to Admin
	 * @param phone
	 * @param otp
	 * @returns {Promise<{}>}
	 */
	sendAdminVerificationCodeSMS: async (phone, otp) => {
		const template_reference_id = CONFIG.SERVICE.TEMPLATE_REF_ID;
		let postData = {
			method: 'POST',
			url: CONFIG.SERVICE.COMMON_SERVICE_URL + '/sms/send/otp/',
			body: {
				otp,
				phone,
				template_ref_id: template_reference_id
			}
		};

		try {
			let {error, body} = await Utils.networkCall(postData);
			let resultData = JSON.parse(body);
			return {error: error, message: resultData?.data?.message};
		} catch {
			return {error: true, message: 'Something went wrong! Please try again'};
		}
	},

	/**
	 * get documents
	 * @param merchantObject
	 * @returns {Promise<{}|*>}
	 */

	getDocumentObj: async (merchantObject) => {
		if (!merchantObject) return {};
		let merchantDocuments = merchantObject?.merchant?.documents;
		if (
			(merchantDocuments?.pan?.pan_image?.front !== '' || merchantDocuments?.pan?.pan_image?.back !== '') &&
			merchantDocuments?.pan !== undefined
		) {
			merchantObject.merchant.documents.pan.image = {
				front:
					merchantDocuments?.pan?.pan_image?.front !== '' &&
					merchantDocuments?.pan?.pan_image?.front !== undefined
						? merchantDocuments?.pan?.pan_image?.front
						: merchantDocuments?.pan?.image?.front,
				back:
					merchantDocuments?.pan?.pan_image?.back !== '' &&
					merchantDocuments?.pan?.pan_image?.back !== undefined
						? merchantObject.documents.pan.pan_image.back
						: merchantDocuments?.pan?.image?.back
			};
		}
		if (
			(merchantDocuments?.aadhar?.aadhar_image?.front !== '' ||
				merchantDocuments?.aadhar?.aadhar_image?.back !== '') &&
			merchantDocuments?.aadhar !== undefined
		) {
			merchantObject.merchant.documents.aadhar.image = {
				front:
					merchantDocuments?.aadhar?.aadhar_image?.front !== '' &&
					merchantDocuments?.aadhar?.aadhar_image?.front !== undefined
						? merchantObject.documents.aadhar.aadhar_image.front
						: merchantDocuments?.aadhar?.image?.front,
				back:
					merchantDocuments?.aadhar?.aadhar_image?.back !== '' &&
					merchantDocuments?.aadhar?.aadhar_image?.back !== undefined
						? merchantObject.documents.aadhar.aadhar_image.back
						: merchantDocuments?.aadhar?.image?.back
			};
		}
		if (merchantDocuments?.agent?.agent_image !== '' && merchantDocuments?.agent?.agent_image !== undefined) {
			merchantObject.image =
				merchantDocuments?.agent?.agent_image !== '' && merchantDocuments?.agent?.agent_image !== undefined
					? merchantDocuments?.agent.agent_image
					: merchantDocuments?.agent?.image;
		}
		return merchantObject;
	},

	/**
	 * Name Similarity Check Function
	 * @param name1
	 * @param name2
	 * @returns {Promise<number>}
	 */
	similar: async (name1, name2) => {
		// Remove any leading/trailing white spaces and convert both names to lowercase
		name1 = name1.trim().toLowerCase();
		name2 = name2.trim().toLowerCase();
		if (name1 === name2) {
			return 100;
		}
		// Scenario 1: Exact match
		if (!name1.includes(' ') && !name2.includes(' ') && name1 !== name2) {
			return 0;
		}
		// Scenario 2: Name order reversed
		if (
			name1.includes(name2) ||
			name2.includes(name1) ||
			name1.split(' ')[0] === name2.split(' ')[0] ||
			name1.split(' ')[1] === name2.split(' ')[1]
		) {
			return 90;
		}
		// Scenario 3: Parent name matching
		if (
			(name1.includes(name2.split(' ')[0]) && name2.split(' ')[1].startsWith(name1[0])) ||
			(name2.includes(name1.split(' ')[0]) && name1.split(' ')[1].startsWith(name2[0]))
		) {
			return 80;
		}
		// Scenario 4: Initial present in one name
		if (
			(name1.includes(name2[0]) && !name2.includes(name1[0])) ||
			(name2.includes(name1[0]) && !name1.includes(name2[0]))
		) {
			return 70;
		}
		// Scenario 5: Names with space
		const name1Parts = name1.split(' ');
		const name2Parts = name2.split(' ');
		if (name1Parts.length > 1 && name2Parts.length > 1 && name1Parts.every((part) => name2.includes(part))) {
			return 60;
		}
		if (name1.includes(name2) || name2.includes(name1)) {
			return 50;
		}
		return 0;
	},

	getDocuments: (merchantType) => {
		switch (merchantType) {
			case 'proprietor': {
				return [
					'APMC (Agricultural Produce Market Committee) licence,Mandi License/Certificate',
					'Labour License/Certificate',
					'Trade Mark Registration Certificate',
					'Liquor License/Certificate',
					'Drug License',
					'Registration certificate issued by Excise and Customs Department.',
					'License/Certificate to Sell/Stock/Exhibit for Sale or Distribute Insecticide/Pesticide',
					'Registration Certificate issued under Weight and Measurement Act(Note: Certificate of Verification issued under Weight and Measurement Act—This document will not be considered if Registration Certificate issued under the same act has being taken as 1st entity proof document. (Will be considered as second entity proof.)',
					'Regional Transport Office Permit/Registration Certificate',
					'Consent to Operate document issued by State/Central Pollution Control Board',
					'Certificate Issued by SEZ (Special Economic Zone), STP (Software Technology Park), EHTP (Electronic Hardware Technology park), DTA (Domestic Tariff Area) and EPZ (Export Processing Zone) in the name of the entity mentioning the address allotted.',
					'Certificate/License issued by Indian Medical Council. (CMHO/DMHO issued registration certificate)',
					'License issued by Food and Drug Control Authorities',
					'Trade License in the name of entity.',
					'Factory Registration Certificate in the name of entity',
					'License issued under Explosive Act in the name of Firm',
					'Registration of   firm   with   Employee Provident Fund Organization.',
					'Registration of firm with Employee State Insurance Corporation.',
					'TAN certificate/Allotment letter issued by NSDL can be accepted as a Registration Certificate for the purpose of entity proof of a new firm which is not older than six months',
					// eslint-disable-next-line quotes
					"Letter/certificate issued by Village Administrative officers/Panchayat Head/Mukhiya/Village Development Officer/Block Development Officer for customers in rural/village areas stating the details of existence of the firm (should be on letterhead and not more than 3 months old) Certificate to be used as entity proof for entities registered and operating from rural areas only along with Bank official's visit report.",
					'Partnership registration certificate issued by Registrar of Firms. (Only for Partnership firm).',
					'Copy of PAN Card in the name of firm (only for Partnership firms, HUF and JV).',
					// eslint-disable-next-line quotes
					"Udyog Aadhaar/District Industries Center (DIC)/Small Scale Industries (SSI) Certificate- Acknowledgement Part-II issued by DIC/SSI containing Entrepreneur's Memorandum Number. Duly stamped and signed by issuing authority.(Will be considered as second entity proof.)",
					'Any registration certificate/license issued favoring the proprietor as a proof of carrying out business issued by Central/State/Local government under an Act will be considered as an entity proof',
					// eslint-disable-next-line quotes
					"Valid Shops and Establishment Certificate/Trade License/Certificate of Enlistment/license/Shop Allotment letter/Provisional Trade license issued by any Municipality/E-Seva Kendra's/Gram Panchayat.",
					'Letter or Certificate (should be on letterhead and not more than 3 months old) confirming existence of business issued by Chairman/President/CEO/Head of the Nagar Panchayat/Parishad, and not by local councilors/corporators',
					'For newly established proprietary business entities with less than 10 employees in Maharashtra, certified copy of application intimating commencement of business (Form F) and acknowledgement of receipt of intimation (Form G) issued under Shop and Establishment Act along with Certified copy of Udyog Aadhaar.',
					'Complete Sales tax return in the name of the firm duly acknowledged. Note: The portion of the sales tax return showing the name of the firm should be duly acknowledged by the accepting authority.',
					'VAT Certificate',
					'CST Registration Certificate.',
					'Provisional/Final GST Registration Certificate (valid for all names indicated in the GST certificate). Address mentioned in the GST certificate is acceptable.',
					'Sales Tax Registration Certificate/TIN Certificate',
					'Professional Tax Registration Certificate',
					'Service Tax certificate',
					'License/certificate issued by SEBI/lRDA/lCAl/lCSl/lCWAI/Office of Registrar of Newspapers for India in the name of the firm.',
					'Importer—Exporter Code Certificate (mandatory for EEFC account opening).',
					// eslint-disable-next-line quotes
					"Complete Income Tax Return (not just the acknowledgement) in the name of the sole proprietor where the firm's income is reflected, duly authenticated/acknowledged by the Income Tax authorities.",
					'Latest copy of electricity bill/landline telephone bill in the name of the firm, not more than 3 months old.',
					'Water bill paid to Municipal Body/Corporations in the name of the firm, not more than 6 months old.',
					'True copy of gas connection book in the name of the entity along with latest gas receipt not more than 3 months old or Gas bill in case of pipe connection can be accepted as an entity proof.',
					'Property Tax bill should not be more than one calendar year old from the bill issuance date along with Tax receipts in name of firm for property tax paid to Municipal Body/Corporations'
				];
			}
			case 'partnership': {
				return [
					'Copy of LLP or Partnership Deed duly stamped and executed with Certificate of Incorporation. Deed will indicate names of partners',
					'List of partners of LLP with name, date of birth and address. List to match with MCA website',
					'Permanent Account Number of the partnership firm/LLP'
				];
			}
			case 'company':
			case 'companies': {
				return [
					'Constitution document namely Memorandum and Articles of Association',
					'Latest list of Directors  with name, date of birth, nationality and address.',
					'Shareholding pattern of the company',
					'Certificate of Incorporation (COI)',
					'Permanent Account Number of the Company',
					'Board Resolution'
				];
			}
			default: {
				throw new Error('Something went wrong!');
			}
		}
	},

	checkDocument: (a, b) => {
		let givenDocumentCount = 0;
		let sameDocumentCount = 0;
		let merchantTypeDocumentCount = 0;
		for (let document of a) {
			let documentName = document?.name;
			givenDocumentCount++;
			for (let givenDocument of b) {
				if (documentName === givenDocument?.document_type) {
					sameDocumentCount++;
					break;
				}
				if (documentName === givenDocument) {
					merchantTypeDocumentCount++;
					break;
				}
			}
		}
		return {givenDocumentCount, sameDocumentCount, merchantTypeDocumentCount};
	},

	/**
	 * Network Call function
	 * @param options
	 * @returns {Promise<{response: *, error: *, body: *}|{error: string}|{response: undefined, error, body: undefined}|{response: undefined, error: string, body: undefined}>}
	 */
	networkCall: async (options) => {
		try {
			let postData = {};

			if (!Utils.isEmpty(options?.admin)) {
				if (options?.is_file_upload) {
					postData['users'] = options?.admin;
				} else {
					if (Utils.isEmpty(options?.body)) {
						options.body = {};
					}
					options.body.logged_user = options?.admin;
				}
			}

			if (Utils.isEmpty(options?.url)) {
				return {
					error: 'please provide a url',
					message: undefined
				};
			}
			postData['url'] = options?.url;
			postData['timeout'] = options?.timeout || 120_000;

			// headers prepare for http request
			if (Utils.isEmpty(options?.headers)) {
				postData['headers'] = {
					'Content-Type': 'application/json'
				};
			} else {
				let headers = {'Content-Type': 'application/json'};
				for (let key in options?.headers) {
					// eslint-disable-next-line security/detect-object-injection
					headers[key] = options?.headers[key];
				}
				postData['headers'] = headers;
			}

			// to decide method for http request
			postData['method'] = options?.method || 'GET';

			if (!Utils.isEmpty(options?.body)) {
				try {
					postData['body'] = JSON.stringify(options?.body);
				} catch (error) {
					Logger.app_error(error, options?.body, 'apiCall || 64');
					return {error: 'unable to stringify body'};
				}
			}

			if (!Utils.isEmpty(options?.formData)) {
				postData['formData'] = options?.formData;
			}

			if (options?.admin) {
				postData['headers']['x-consumer-username'] = 'admin_' + options.admin?.id;
			}

			// FORM data handling
			if (!Utils.isEmpty(options?.form)) {
				postData['form'] = options?.form;
			}
			let errorData;
			let bodyData;
			await new Promise((resolve) => {
				Request(postData, (error, response, body) => {
					errorData = error;
					bodyData = body;
					resolve(error, response, body);
				});
			});
			return {error: errorData, body: bodyData};
		} catch (error) {
			return {error: error, message: 'Something went wrong' || error?.message};
		}
	},
	termFeeder: (key) => {
		let value = '';
		switch (key) {
			case 'monthly': {
				value = 'M';
				break;
			}
			case 'yearly': {
				value = 'y';
				break;
			}
			case 'weekly': {
				value = 'w';
				break;
			}
			default: {
				value = 'd';
				break;
			}
		}
		return value;
	},
	dateFeeder: (startDate, endDate) => {
		let currentDate = startDate;
		let dates = [];
		while (Moment(endDate).diff(currentDate, 'd') > 0) {
			dates.push(currentDate.format('DD/MMM/yyyy'));
			currentDate.add(1, 'd');
		}
		return dates;
	}
};

module.exports = Utils;
