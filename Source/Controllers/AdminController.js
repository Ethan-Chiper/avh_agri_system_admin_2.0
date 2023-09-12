const Responder = require('../App/Responder');
const {getNanoId} = require('../Helpers/Utils');
const AdminModel = require('../Models/AdminModel');
const Controllers = {
	/**
	 * Admin SignUp
	 * @param {*} req
	 * @param {*} res
	 */
	signUp: (req, res) => {
		let data = req.body;

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

		AdminModel.create(adminData, (err, createData) => {
			if (!err && createData) return Responder.sendSuccessData(res, 'Admin create', createData);
			return Responder.sendFailureMessage(res, 'Admin create failure');
		});
	},

	/**
	 * Admin list
	 */
	details: (adminId, res) => {
		AdminModel.find({admin_id: adminId}, (err, getAdminData) => {
			if (!err && getAdminData) return Responder.sendSuccessData(res, 'Admin Details', getAdminData);
			return Responder.sendFailureMessage(res, 'Data not Found');
		});
	}
};

module.exports = Controllers;
