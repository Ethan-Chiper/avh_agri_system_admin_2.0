const DBConnection = require('../App/Connection');
const TransactionDatabase = DBConnection.getTransactionDBConnection();
const Timestamps = require('mongoose-timestamp');

const disputeSchema = new TransactionDatabase.Schema({
	merchant: {
		id: {type: String},
		name: {type: String}
	},
	dispute_id: {type: String, unique: true},
	trans_id: {type: String},
	reference_id: {type: String},
	due_date: {type: Date},
	dispute_type: {type: String, default: 'dispute'},
	dispute_level: {type: String, default: '1'},
	status: {type: String, default: 'open'},
	dispute_status: {type: String, default: 'raised'},
	issue_type: {type: String, default: ''}, // issue face by merchant
	dispute_for: {type: String, default: ''}, // where dispute raised eg bbps, payouts
	comments: {
		merchant: {type: String, default: ''},
		admin: {type: String, default: ''}
	},
	attachments: [],
	settlement: {
		hold_id: {type: String, default: ''},
		release_id: {type: String, default: ''}
	},
	cost: {
		paid: {type: Number},
		settled: {type: Number}
	},
	history: Object,
	closed_by: {
		id: {type: String},
		name: {type: String}
	},
	level1_admin_date: {type: Date},
	level1_merchant_date: {type: Date}
});

disputeSchema.plugin(Timestamps);

const disputeModel = TransactionDatabase.model('disputes', disputeSchema);

module.exports = disputeModel;
