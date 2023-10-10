const DBConnection = require('../App/Connection');
const AgentDataBase = DBConnection.getAgentDBConnection();
const Timestamps = require('mongoose-timestamp');
const MongooseSoftDelete = require('mongoose-delete');

const partnerSchema = new AgentDataBase.Schema({
	partner_id: {type: String, unique: true},
	name: {
		first: {type: String},
		full: {type: String, default: ''},
		last: {type: String}
	},
	image: {type: String, default: ''},
	password: {type: String, default: ''},
	will_agent_onboard: {type: Boolean, default: false},
	vpa_prefix: {type: String, default: ''},
	is_listed: {type: String, default: 'active'},
	dashboard_option: {type: String, default: 'active'},
	phone: {
		national_number: {type: String},
		country_code: {type: String, default: '91'}
	},
	keys: {
		test: {
			public_key: {type: String},
			private_key: {type: String},
			whitelisted_ips: [String]
		},
		live: {
			public_key: {type: String},
			private_key: {type: String},
			whitelisted_ips: [String]
		},
		callback_url: {type: String}
	},
	is_approval_enabled: {type: Boolean, default: true},
	settings: {
		is_approval_enabled: {type: Boolean, default: true},
		is_business_proof_mandatory: {type: Boolean, default: true}
	},
	email: {type: String, default: ''},
	status: {type: String, default: 'active'}
});

partnerSchema.plugin(Timestamps);
partnerSchema.plugin(MongooseSoftDelete, {overrideMethods: 'all'});

let PartnerModel = AgentDataBase.model('partners', partnerSchema);

module.exports = PartnerModel;
