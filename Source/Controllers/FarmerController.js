/* eslint-disable jsdoc/require-returns */
/* eslint-disable unicorn/numeric-separators-style */
/* eslint-disable unicorn/prevent-abbreviations */
/* eslint-disable unicorn/prefer-ternary */
/* eslint-disable node/no-unsupported-features/es-syntax */
const {getNanoId, isEmpty} = require('../Helpers/Utils');
const {createUserAndTokenInKong} = require('../Helpers/KongUtils');
const FarmerModel = require('../Models/FarmerModel');
const {findOneFarmer} = require('../Repository/FarmerRepository');

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
					id: 'farmer_' + createData.farmer_id
				});
				if (createKongUser?.error) {
					return {error: true, message: 'Please provide valid data'};
				} else {
					return {
						error: false, message: 'Farmer created', data: createData
					};
				}
			}
			return {error: true, message: 'data create failure'};
		} catch (error) {
			return {error: true, message: error};
		}
	},
	/**
	 * Farmer List
	 * @param {*} farmerId
	 * @param {*} res
	 */
	details: async (farmerId) => {
		try {
			if (isEmpty(farmerId)) {
				return {error: true, message: 'farmer_id is empty'};
			}
			let farmer = await findOneFarmer({farmer_id: farmerId});
			if (isEmpty(farmer)) {
				return {error: true, message: 'Invalid Credentials!'};
			}
			return {error: false, message: 'Farmer Details:', data: farmer};
		} catch {
			return {error: true, message: 'Something went Wrong!'};
		}
	}
};

module.exports = Controllers;
