const DBConnection = require('../App/Connection');
const AgentDataBase = DBConnection.getAgentDBConnection();
const Timestamps = require('mongoose-timestamp');
const MongooseSoftDelete = require('mongoose-delete');

const subUserSchema = new AgentDataBase.Schema({
	sub_user_id: {type: String},
	name: {type: String, required: true},
	merchant: {
		id: {type: String},
		name: Object,
		code: {type: String}
	},
	store: {
		id: {type: String},
		name: Object
	},
	phone: {
		national_number: {type: String, required: true},
		country_code: {type: String, default: '91'},
		is_verified: {type: Boolean, default: false}
	},
	status: {type: String, default: 'active'},
	vpa_id: {type: String},
	verification: {
		code: {type: String}
	}
});

subUserSchema.plugin(Timestamps);
subUserSchema.plugin(MongooseSoftDelete, {overrideMethods: 'all'});

const SubUsersModel = AgentDataBase.model('sub_users', subUserSchema);

module.exports = SubUsersModel;
