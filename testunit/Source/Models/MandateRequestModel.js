const DBConnection = require('../App/Connection');
const AgentDatabase = DBConnection.getAgentDBConnection();
const Timestamp = require('mongoose-timestamp');

const MandateRequestSchema = new AgentDatabase.Schema({
	mandate_request_id: {type: String, default: ''},
	merchant: {
		id: {type: String, default: ''},
		name: {type: String, default: ''}
	},
	store: {
		id: {type: String, default: ''},
		name: {type: String, default: ''}
	},
	status: {type: String, default: 'pending'},
	mandate_amount: {type: String, default: ''},
	registration_fees: {type: String, default: ''},
	subscription_fees: {type: String, default: ''},
	mandate_asset_details: {
		mandate_for: {type: String, default: 'sound_box', enum: ['sound_box', 'pos']},
		device_reference_id: {type: String, default: ''}
	},
	plan: {
		plan_id: {type: String, default: ''},
		plan_name: {type: String, default: ''},
		tenure_type: {type: String, default: ''},
		emi_start: {type: Date},
		emi_end: {type: Date},
		subscription_start: {type: Date},
		registration_fees: {type: String, default: ''},
		subscription_fees: {type: String, default: ''}
	},
	tenure: {
		type: {type: String, default: 'daily', enum: ['daily', 'monthly', 'yearly', 'weekly']},
		value: {type: Number, default: 1}
	},
	phone: {
		national_number: {type: String},
		country_code: {type: String, default: '91'}
	},
	mandate: {
		qr: {type: String},
		upi_string: {type: String},
		collect_by: {type: String, default: ''},
		validity_start_date: {type: String, default: ''},
		validity_end_date: {type: String, default: ''},
		status: {type: String, default: 'pending'},
		merchant_tran_id: {type: String, default: ''},
		mandate_id: {type: String, default: ''},
		umn: {type: String, default: ''}
	},
	recurring: {
		previous_recurring_date_utc: {type: Date},
		previous_recurring_date: {type: String},
		next_recurring_date_utc: {type: Date},
		next_recurring_date: {type: String}
	},
	created_on: {type: Number},
	transactions_details: {type: Object},
	paused_at: {type: Date},
	revoked_at: {type: Date},
	internal: {
		meta: {type: Array, default: []},
		logs: {type: Array, default: []}
	}
});
MandateRequestSchema.plugin(Timestamp);
const MandateModel = AgentDatabase.model('mandate_request', MandateRequestSchema);

module.exports = MandateModel;
