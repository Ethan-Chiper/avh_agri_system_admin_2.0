/* eslint-disable unicorn/prefer-ternary */
/* eslint-disable unicorn/numeric-separators-style */
const {getNanoId, isEmpty,createUserAndTokenInKong} = require('../Helpers/Utils');
const {createAdmin,findOneAdmin} = require('../Repository/AdminRepository');
const Controllers = {
	/**
	 * Admin SignUp
	 * @param request
	 */
	signUp: async (request) => {
		try {
			let data = request.body;

			let adminData = {
				admin_id: getNanoId(),
				name: {
					full: data?.name?.full
				},
				phone: {
					country_code: data?.phone?.country_code ?? '+91',
					national_number: data?.phone?.national_number ?? '',
					is_verified: data?.phone?.is_verified ?? false,
					otp: 123456
				},
				last_login: {
					from: data?.last_login?.from ?? 'web',
					meta: data?.last_login?.meta ?? ''
				},
				email: data?.email ?? '',
				verification_code: data?.verification_code ?? '',
				role: data?.role ?? true,
				is_verified: data?.is_verified ?? false,
				password: 1234,
				acc_type: data?.acc_type ?? 'super-admin',
				status: data?.status ?? 'approved'
			};

			let admin = await createAdmin(adminData);
			if (!isEmpty(admin)) {
				let createKongUser = await createUserAndTokenInKong({
					id: 'admin_' + admin?.admin_id
				});
				if (createKongUser?.error) {
					return {error: true, message: 'Please provide valid data'};
				} else {
					return {
						error: false, message: 'Admin created', data: {admin: admin}
					};
				}
			}
			return {error: true, message: 'data create failure'};
		} catch (error) {
			return {error: true, message: error};
		}
	},
	/***
	 * admin detail
	 * @param adminId
	 * @returns {Promise<{error: boolean, message: string}|{data: *, error: boolean, message: string}>}
	 */
	details: async (adminId) => {
		try{
			if (isEmpty(adminId)){
				return {error: true, message: 'admin_id is empty'};
			}
			let admin = await findOneAdmin({admin_id: adminId});
			if (isEmpty(admin)) {
				return {error: true, message: 'Invalid Credentials!'};
			}return {error: false, message: 'Admin Details:', data: admin};
		}catch(error){
			return {error: true, message: error};
		}
	}
};

module.exports = Controllers;
