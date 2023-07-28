/* eslint-disable no-unused-vars */
const Responder = require('../App/Responder');
const Utils = require('../Helpers/Utils');
const FarmerModel = require('../Models/FarmerModel').getFarmerModel();
const winston = require('winston');
const logger = winston.createLogger({
	transports: [new winston.transports.Console()]
});

function Controllers() {
	/**
	 * Farmer SignUp
	 * @param {*} req
	 * @param {*} res
	 */
	this.signUp = async (req, res) => {
		try {
			let data = req.body;
			let farmerData = {
				farmer_id: Utils.getNanoId(),
				name: {
					full: data?.name?.full
				},
				mobile: {
					country_code: data?.country_code,
					national_number: data?.national_number,
					is_verified: data?.is_verified,
					otp: 12345
				},
				phone: {
					country_code: data?.country_code,
					national_number: data?.national_number,
					is_verified: data?.is_verified,
					otp: 12345
				},
				auth_token: {
					web: data?.web,
					mobile: data?.mobile
				},
				devicedetails: data?.devicedetails,
				email: data?.email,
				verification_code: 123456,
				is_verified: data?.is_verified,
				status: data?.status ?? 'active',
				password: data?.password,
				settings: {
					invoice: {
						notes: data?.notes ?? '',
						terms: data?.terms ?? '',
						use_for_future: data?.use_for_future ?? false,
						incrementer: data?.incrementer ?? ''
					},
					time_zone: {
						name: 'Asia/ Kolkata',
						label: 'Indian Standard Time',
						offset: '+0530'
					},
					branding: {
						theme_color: '',
						text_color: '',
						icon: ''
					},
					is_ippopay_branding: data?.is_afw_branding ?? true,
					is_terms_page: data?.is_terms_page ?? false
				}
			};
			let createData = await FarmerModel.create(farmerData);
			if (createData) {
				let userId = 'farmer' + '_' + createData.farmer_id;
				await Utils.createUserAndTokenInKong(userId, (token) => {
					console.log(12, token);
					if (token)
						return Responder.sendSuccessData(res, ' account created successfully', {
							user_details: createData
						});
				});
				return Responder.sendSuccessData(res, 'Farmer create', createData);
			}
			return Responder.sendFailureMessage(res, 'Farmer create failure');
		} catch (error) {
			return Responder.sendFailureMessage(res, 'User is invalid');
		}
	};
	/**
	 * Farmer List
	 * @param {*} farmerId
	 * @param {*} res
	 */
	this.details = (farmerId, res) => {
		FarmerModel.find({farmer_id: farmerId}, (err, getFarmerData) => {
			logger.error(err);
			if (!err && getFarmerData) return Responder.sendSuccessData(res, 'Farmer Details', getFarmerData);
			return Responder.sendFailureMessage(res, 'Farmer not found');
		});
	};
}

module.exports = new Controllers();
