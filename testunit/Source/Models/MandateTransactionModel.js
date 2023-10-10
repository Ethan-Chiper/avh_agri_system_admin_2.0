const DBConnection = require('../App/Connection');
const AgentDatabase = DBConnection.getAgentDBConnection();
const Timestamp = require('mongoose-timestamp');

const MandateTransactionSchema = new AgentDatabase.Schema({
	transaction_id: {type: String, required: true},
	merchant_id: {type: String, required: true},
	mandate_id: {type: String, required: true},
	store_id: {type: String, required: true},
	merchant_details: {
		notification_for: {type: String, required: true},
		device_id: {type: String, required: true}
	},
	amount: {type: String, required: true},
	notification_id: {type: String, default: ''},
	notification_date: {type: Date, required: true},
	notification_status: {type: String, default: 'pending', enum: ['pending', 'success', 'failed']},
	notification_retry: {type: Number, default: 0},
	sequence_number: {type: String, default: ''},
	collection_id: {type: String, default: ''},
	collection_date: {type: Date},
	collection_status: {
		type: String,
		default: 'initiated',
		enum: ['initiated', 'pending', 'success', 'failed', 'declined', 'acknowledged']
	},
	collection_retry: {type: Number, default: 0},
	collection_till: {type: Date},
	collected_date: {type: Date},
	created_on: {type: Number, default: 0},
	transaction_details: {type: Object},
	internal: {
		notification_meta: {type: Array, default: []},
		collection_meta: {type: Array, default: []}
	},
	acknowledgements: {
		reason: {type: String, default: ''},
		acknowledged_at: {type: Date},
		type: {type: String, default: 'payment', enum: ['payment', 'retry_collection']},
		meta: {
			type: Array,
			default: []
		}
	}
});

MandateTransactionSchema.plugin(Timestamp);

const MandateTransactionModel = AgentDatabase.model('mandate_transaction', MandateTransactionSchema);

module.exports = MandateTransactionModel;
