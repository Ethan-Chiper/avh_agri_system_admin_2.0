const Moment = require('moment-timezone');
const Fs = require('node:fs');
const SurveyModel = require('../Models/SurveyModel');
const CONFIG = require('../App/Config');
const {isEmpty, networkCall, dateFinder} = require('../Helpers/Utils');
const {findOneSurvey} = require('../Repository/SurveyRepository');
const {app_warning, app_error} = require('../Helpers/Logger');
const Responder = require('../App/Responder');

const SurveyController = {
	surveyList: async (queryData, loggedUser) => {
		try {
			let options = {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				},
				url: CONFIG.SERVICE.AUTH_SERVICE_URL + '/survey/list',
				admin: loggedUser
			};

			if (!isEmpty(queryData)) {
				let query = {};
				if (queryData?.limit) query.limit = queryData?.limit;
				if (queryData?.page) query.page = queryData?.page;
				if (queryData?.from_time) query.from_time = queryData?.from_time;
				if (queryData?.to_time) query.to_time = queryData?.to_time;
				if (queryData?.date_option) query.date_option = queryData?.date_option;
				if (queryData?.step) query.step = queryData.step;
				if ('is_lead' in queryData) query.is_lead = queryData?.is_lead;
				if (queryData?.merchant_type) query.merchant_type = queryData?.merchant_type;
				if (queryData?.outlet_type) query.outlet_type = queryData?.outlet_type;
				if (queryData?.turnover) query.turnover = queryData?.turnover;
				if (queryData?.agent_id) query.agent_id = queryData.agent_id;
				if (queryData?.survey_id) query.survey_id = queryData?.survey_id;
				if (queryData?.status) query.status = queryData?.status;

				let urlAppender = new URLSearchParams(query);
				options.url += '?' + urlAppender;
			}

			let surveyList = await networkCall(options);
			if (surveyList?.error) app_error(surveyList?.error, {}, 'Survey List', loggedUser);
			let resultData = JSON.parse(surveyList?.body);
			if (!resultData?.success) {
				app_warning('Survey List could not be fetched!', {resultData, options}, loggedUser, 'Survey List');
				return {error: true, message: 'Survey List could not be fetched!'};
			}
			return {error: false, message: 'Survey Lists are', data: resultData?.data};
		} catch (error) {
			app_error(error, {}, 'Survey List', loggedUser);
			return {error: true, message: 'Something went wrong! Please try again'};
		}
	},

	surveyView: async (surveyId, loggedUser) => {
		try {
			let existingSurvey = await findOneSurvey({survey_id: surveyId}, {survey_id: 1, step: 1}, {lean: true});

			if (isEmpty(existingSurvey)) {
				app_warning('Survey Not Found!', {survey_id: surveyId}, loggedUser, 'Survey View');
				return {error: true, message: 'Survey Not Found!'};
			}

			let options = {
				method: 'GET',
				url: CONFIG.SERVICE.AUTH_SERVICE_URL + '/survey/view-survey/' + surveyId,
				headers: {
					'Content-Type': 'application/json'
				},
				admin: loggedUser
			};

			let surveyDetails = await networkCall(options);
			if (surveyDetails?.error) app_error(surveyDetails?.error, {}, 'Survey View', loggedUser);
			let resultData = JSON.parse(surveyDetails?.body);
			if (!resultData?.success) {
				app_warning('Survey could not be fetched!', {resultData, options}, loggedUser, 'Survey View');
				return {error: true, message: 'Survey could not be fetched!'};
			}
			return {error: false, message: 'Survey Details are', data: resultData?.data};
		} catch (error) {
			app_error(error, {}, 'Survey View', loggedUser);
			return {error: true, message: 'Something went wrong! Please try again'};
		}
	},

	exportSurvey: async (queryData, loggedUser, response) => {
		try {
			let query = {};
			if (!isEmpty(queryData)) {
				if (queryData?.from_time || queryData?.to_time || queryData?.date_option) {
					query['createdAt'] = dateFinder(queryData);
				}

				if (queryData?.step) query.step = queryData.step;
				if ('is_lead' in queryData) query.is_lead = queryData?.is_lead;
				if (queryData?.merchant_type) query['merchant.merchant_type'] = queryData?.merchant_type;
				if (queryData?.outlet_type) query['store.outlet_type'] = queryData?.outlet_type;
				if (queryData?.turnover) query['store.turnover'] = queryData?.turnover;
				if (queryData?.agent_id) query['data_collected_by.agent_id'] = queryData.agent_id;
				if (queryData?.survey_id) query.survey_id = queryData?.survey_id;
				if (queryData?.status) query.step = queryData?.status === 'completed' ? 4 : {$in: [1, 2, 3]};
			}

			let survey = await findOneSurvey(query, {survey_id: 1});

			if (isEmpty(survey)) {
				app_warning('Survey Not Found!', {query}, loggedUser, 'Survey Report');
				return response.status(400).send({success: false, message: 'Survey Not Found!'});
			}

			// eslint-disable-next-line unicorn/no-array-callback-reference,unicorn/no-array-method-this-argument
			let surveyList = SurveyModel.find(query, {
				_id: 0,
				survey_id: 1,
				merchant_id: 1,
				is_lead: 1,
				location: 1,
				step: 1,
				documents: 1,
				merchant: 1,
				store: 1,
				category: 1,
				questionnaires: 1,
				feedback: 1,
				data_collected_by: 1,
				reference: 1,
				createdAt: 1
			}).cursor();

			let fileName = 'temp/report_' + Moment().format('YYYY_MM_DD_HHmm') + '.csv';

			// eslint-disable-next-line security/detect-non-literal-fs-filename
			const csvWriteStream = Fs.createWriteStream(fileName);

			let headers = [
				'survey_id',
				'is_lead',
				'step',
				'required_products',
				'acquired_products',
				'existing_loan',
				'loan_from',
				'loan_type',
				'needs_loan',
				'loan_amount',
				'group_insurance',
				'insurance_agent',
				'agent_id',
				'agent_name',
				'asm_id',
				'asm_name',
				'merchant_phone',
				'merchant_name',
				'merchant_id',
				'merchant_email',
				'merchant_type',
				'store_name',
				'outlet_type',
				'turnover',
				'cash',
				'card',
				'UPI',
				'Category_Name',
				'Sub_Category_Name',
				'address',
				'available_proofs',
				'date',
				'time',
				'feedback'
			];

			csvWriteStream.write(`${headers?.join(',')}\n`);

			await surveyList.on(
				'data',
				(data) => {
					// data formation
					let [
						acquired_products,
						existing_loan,
						loan_type,
						loan_from,
						needs_loan,
						loan_amount,
						available_proofs,
						group_insurance,
						insurance_agent
					] = ['', 'NO', '', '', 'NO', '', '', '-', '-'];

					const createdAt = Moment(data.createdAt).tz('Asia/Kolkata');
					let isLead = data?.is_lead ? 'YES' : 'NO';
					let date = createdAt.format('DD-MMM-YYYY');
					let time = createdAt.format('h:mm A');
					let merchantId = data?.merchant_id || '';
					let products = data?.questionnaires?.products?.toString();
					let address = `${data?.location?.street_name}, ${data?.location?.area}, ${data?.location?.city}, ${data?.location?.state}, ${data?.location?.pincode}`;
					if (data?.questionnaires?.is_insurance_agent === true)
						insurance_agent = data?.questionnaires?.insurance_agent_type;
					if (data?.questionnaires?.needs_group_insurance === true)
						group_insurance = data?.questionnaires?.group_insurance_type;
					if (data?.questionnaires?.has_sound_box === true)
						acquired_products = acquired_products + 'SOUND_BOX_' + data?.questionnaires?.sound_box_brand;
					if (data?.questionnaires?.has_pos === true)
						acquired_products = acquired_products + ' POS_' + data?.questionnaires?.pos_brand;
					if (data?.questionnaires?.products?.includes('LOAN')) {
						existing_loan = data?.questionnaires?.has_existing_loan ? 'YES' : 'NO';
						if (existing_loan === 'YES') {
							loan_type = data?.questionnaires?.loan_type;
							loan_from = data?.questionnaires?.loan_from;
						}
						needs_loan = data?.questionnaires?.needs_loan ? 'YES' : 'NO';
						loan_amount = data?.questionnaires?.loan_amount || '';
						if (data?.documents?.is_pan_available === true) available_proofs = available_proofs + 'PAN ';
						if (data?.documents?.is_aadhar_available === true)
							available_proofs = available_proofs + 'AADHAR ';
						if (data?.documents?.business_proof !== '') {
							available_proofs = available_proofs + ' ' + data?.documents?.business_proof;
						}
					}

					if (isEmpty(products)) products = '';

					// data write
					const csvRow = `"${data?.survey_id}","${isLead}","${data?.step}","${products}","${acquired_products}","${existing_loan}","${loan_from}","${loan_type}","${needs_loan}","${loan_amount}","${group_insurance}","${insurance_agent}","${data?.data_collected_by?.agent_id}","${data?.data_collected_by?.name}","${data?.reference?.asm_id}","${data?.reference?.asm_name}","${data?.merchant?.phone?.national_number}","${data?.merchant?.name}","${merchantId}","${data?.merchant?.email}","${data?.merchant?.merchant_type}","${data?.store?.name}","${data?.store?.outlet_type}","${data?.store?.turnover}","${data?.store?.turnover_mode?.cash}","${data?.store?.turnover_mode?.card}","${data?.store?.turnover_mode?.upi}","${data?.category?.name}","${data?.category?.subCategory}","${address}","${available_proofs}","${date}","${time}","${data?.feedback}"\n`;
					csvWriteStream.write(csvRow);
				},
				(error) => {
					if (error) {
						// eslint-disable-next-line no-console
						console.log(error);
						throw new Error('Error retrieving data from MongoDB');
					}
					csvWriteStream.end();
				}
			);

			surveyList.on('end', async () => {
				// eslint-disable-next-line security/detect-non-literal-fs-filename
				let csvFile = Fs.createReadStream(fileName);
				response.statusCode = 200;
				response.setHeader('Content-type', 'application/csv');
				response.setHeader('Access-Control-Allow-Origin', '*');

				csvFile.on(
					'data',
					async (data) => {
						await response.write(Buffer.from(data).toString('utf8'));
					},
					(error) => {
						if (error) {
							// eslint-disable-next-line no-console
							console.log(error);
							throw new Error('Error retrieving data from MongoDB');
						}
						csvFile.close();
					}
				);
				csvFile.on('close', async () => {
					// eslint-disable-next-line security/detect-non-literal-fs-filename
					Fs.unlinkSync(fileName);
					return await response.end();
				});
			});
		} catch (error) {
			app_error(error, {}, 'Survey Report', loggedUser);
			let message =
				error?.message === 'Error retrieving data from MongoDB' ? error?.message : 'Something Went Wrong!';
			return Responder.sendFailureMessage(response, message, 400);
		}
	}
};

module.exports = SurveyController;
