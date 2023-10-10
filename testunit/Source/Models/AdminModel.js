const DBConnection = require('../App/Connection');
const AdminDatabase = DBConnection.getAdminDBConnection();
const Timestamps = require('mongoose-timestamp');
const MongooseSoftDelete = require('mongoose-delete');

const adminSchema = new AdminDatabase.Schema({
	admin_id: {type: String, unique: true},
	name: {
		full: {type: String, default: ''}
	},
	phone: {
		country_code: {type: String, default: '+91'},
		national_number: {type: String},
		is_verified: {type: Boolean, default: false}
	},
	last_login: {
		from: {type: String, default: 'web'},
		meta: Object
	},
	email: {type: String, default: ''},
	verification_code: {type: String},
	role: {type: String, require: true},
	is_verified: {type: Boolean, default: false},
	password: {type: String},
	acc_type: {type: String, default: 'sub-admin'},
	status: {type: String, default: 'active'},
	whitelisted_routes: {type: Array},
	kong_termination_id: {type: String, default: ''}
});

adminSchema.plugin(Timestamps);
adminSchema.plugin(MongooseSoftDelete, {overrideMethods: 'all'});

const adminModel = AdminDatabase.model('admin_users', adminSchema);

module.exports = adminModel;
