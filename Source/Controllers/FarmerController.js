const Responder = require('../App/Responder');
const {getNanoId, isEmpty} = require('../Helpers/Utils');
const {createUserAndTokenInKong} = require('../Helpers/KongUtils');
const FarmerModel = require('../Models/FarmerModel');
const {createFarmer,findOneFarmer}=require('../Repository/FarmerRepository');

const Controllers = {
	/**
	 * Farmer SignUp
	 * @param {*} req
	 */
	signUp: async (req) => {
		try {
			let data = req.body;
			let findMail = await findOneFarmer({
				condition: {email: data?.email}
			});
			if (!isEmpty(findMail)) {
				return {error: true, message: 'Email already exists!'};
			}
			let farmerData = {
				farmer_id: getNanoId(),
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
					is_agri_sys_branding: data?.is_afw_branding ?? true,
					is_terms_page: data?.is_terms_page ?? false
				}
			};
			let createData = await FarmerModel.create(farmerData);
			if (!isEmpty(createData)) {
				let createKongUser = await createUserAndTokenInKong({
					id:'farmer_' + createData.farmer_id
				});
				if (createKongUser?.error) {
					return {error: true, message: 'Please provide valid data'};
				} else {
					return {
						error: false, message: 'Farmer created', data: createData
					};
				}
			}return {error: true, message: 'data create failure'};
		} catch (error) {
			return {error: true, message: 'Something went wrong!'};
		}
	},
	/**
	 * Farmer List
	 * @param {*} farmerId
	 * @param {*} res
	 */
	details: (farmerId, res) => {
		FarmerModel.find({farmer_id: farmerId}, (err, getFarmerData) => {
			if (!err && getFarmerData) return Responder.sendSuccessData(res, 'Farmer Details', getFarmerData);
			return Responder.sendFailureMessage(res, 'Farmer not found');
		});
	}
};

module.exports = Controllers;
