const {createHashPwd, sendAdminVerificationCodeSMS, generateVerificationCode} = require('../Helpers/Utils');
const {generateAuthToken} = require('../Helpers/KongUtils');
const {isEmpty} = require('../Helpers/Utils');
const {findOneAdmin} = require('../Repository/AdminRepository');
const {app_warning, app_error} = require('../Helpers/Logger');

const AuthController = {
	/**
	 * Admin Login
	 * @param adminLoginDetails
	 * @param loginDevice
	 * @returns {Promise<{data: {admin: {admin_id: (number|*), auth_token: *}}, error: boolean, message: string}|{error: boolean, message: string}|{error: boolean, message: *}>}
	 */
	login: async (adminLoginDetails, loginDevice) => {
		try {
			let queryOptions = {
				condition: {
					email: adminLoginDetails?.email,
					password: createHashPwd(adminLoginDetails?.password),
					status: 'active'
				},
				projection: {
					last_login: 1,
					verification_code: 1,
					phone: 1,
					createdAt: 1,
					admin_id: 1,
					email: 1
				},
				options: {
					lean: false
				}
			};
			let admin = await findOneAdmin(queryOptions);
			if (isEmpty(admin)) {
				app_warning('Invalid Credentials!', queryOptions, adminLoginDetails?.loggedUser, 'Admin Login');
				return {error: true, message: 'Invalid Credentials!'};
			} else {
				if (admin?.last_login?.meta?.source === loginDevice) {
					let {error, token} = await generateAuthToken('admin_' + admin?.admin_id);
					if (!isEmpty(token) && error === false) {
						return {
							error: false,
							message: 'Login Success',
							data: {
								admin: {auth_token: token, admin_id: admin?.admin_id}
							}
						};
					}
					app_warning('Please try login again', {error}, adminLoginDetails?.loggedUser, 'Admin Login');
					return {error: true, message: 'Please try login again'};
				} else {
					let otp = generateVerificationCode();
					let encryptOTP = createHashPwd(otp);
					admin['verification_code'] = encryptOTP;
					admin.markModified('verification_code');
					await admin.save();
					let {error} = await sendAdminVerificationCodeSMS(admin?.phone?.national_number, otp);
					if (error === true) {
						app_warning(
							'Something went wrong during sending SMS! Please try again after sometimes',
							{error},
							adminLoginDetails?.loggedUser,
							'Admin Login'
						);
						return {
							error: true,
							message: 'Something went wrong during sending SMS! Please try again after sometimes'
						};
					}
					return {
						error: false,
						message: 'Please verify the OTP sent.',
						data: 'verify_otp'
					};
				}
			}
		} catch (error) {
			app_error(error, {}, 'Admin Login', adminLoginDetails?.loggedUser);
			return {error: true, message: 'Something Went Wrong!'};
		}
	},
	/**
	 * Admin Login with OTP
	 * @param adminLoginDetails
	 * @param loginDevice
	 * @returns {Promise<{data: {admin: {admin_id: (number|*), auth_token: *}}, error: boolean, message: string}|{error: boolean, message: string}|{error: boolean, message}>}
	 */
	loginVerifyWithOtp: async (adminLoginDetails, loginDevice) => {
		try {
			let queryOptions = {
				condition: {
					email: adminLoginDetails?.email,
					password: createHashPwd(adminLoginDetails?.password),
					status: 'active'
				},
				projection: {
					last_login: 1,
					verification_code: 1,
					createdAt: 1,
					admin_id: 1,
					email: 1,
					password: 1
				},
				options: {
					lean: false
				}
			};
			let admin = await findOneAdmin(queryOptions);
			if (isEmpty(admin)) {
				app_warning('Invalid Credentials!', queryOptions, adminLoginDetails?.loggedUser, 'Admin Verify Login');
				return {error: true, message: 'Invalid Credentials!'};
			} else {
				let encryptOTP = createHashPwd(adminLoginDetails?.otp);
				if (admin?.verification_code === encryptOTP) {
					let lastLogin = {
						from: adminLoginDetails?.login_from || 'web',
						meta: {
							source: loginDevice
						}
					};

					let accountType = 'admin';
					admin['verification_code'] = '';
					admin.markModified('verification_code');
					admin['last_login'] = lastLogin;
					admin.markModified('last_login');
					await admin.save();
					let {error, token} = await generateAuthToken(accountType + '_' + admin?.admin_id);
					if (!isEmpty(token) && error === false) {
						return {
							error: false,
							message: 'Login Success',
							data: {
								admin: {auth_token: token, admin_id: admin?.admin_id}
							}
						};
					}
					app_warning('Please try login again', {error}, adminLoginDetails?.loggedUser, 'Admin Verify Login');
					return {error: true, message: 'Please try login again'};
				} else {
					app_warning(
						'Invalid Otp',
						{origin_sent_otp: admin?.verification_code, provided_otp: adminLoginDetails?.otp},
						adminLoginDetails?.loggedUser,
						'Admin Verify Login'
					);
					return {error: true, message: 'Invalid Otp'};
				}
			}
		} catch (error) {
			app_error(error, {}, 'Admin Verify Login', adminLoginDetails?.loggedUser);
			return {error: true, message: error || 'Something went wrong!'};
		}
	}
};

module.exports = AuthController;
