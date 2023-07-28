const Connection = require('../App/MultiConnection');
const adminConnection = Connection.getAdminDBConnection();
const timestamps = require('mongoose-timestamp');
const mongoose = require('mongoose');

function Schema() {
	let adminSchema = new adminConnection.Schema({
		admin_id: String,
		name: {
			full: {type: String, default: ''}
		},
		phone: {
			country_code: {type: String, default: '+91'},
			national_number: String,
			is_verified: {type: Boolean, default: false},
			otp: {type: String, default: ''}
		},
		last_login: {
			from: {type: String, default: 'web'},
			meta: {type: Object, default: ''}
		},
		email: {type: String, default: ''},
		verification_code: {type: String, default: ''},
		role: {type: String, require: true},
		is_verified: {type: Boolean, default: false},
		password: {typr: Number},
		acc_type: {type: String, default: 'super-admin'},
		status: {type: String, default: 'approved'}
	});
	adminSchema.plugin(timestamps);

	let adminModel = mongoose.model('admin', adminSchema);

	this.getAdminModel = () => {
		return adminModel;
	};
}
module.exports = new Schema();
