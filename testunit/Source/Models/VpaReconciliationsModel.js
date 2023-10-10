const DBConnection = require('../App/Connection');
const ReconciliationsDataBase = DBConnection.getReconciliationsDBConnection();
const Timestamps = require('mongoose-timestamp');
// const MongooseSoftDelete = require('mongoose-delete');

const VpaReconciliationsSchema = new ReconciliationsDataBase.Schema({
	recon_id: {type: String, unique: true},
	slot: {type: Number},
	bank: {type: String},
	result: {
		available_transaction_count: {type: Number, default: 0},
		available_transactions: {type: Array, default: []},
		missed_transaction_count: {type: Number, default: 0},
		missed_transactions: {type: Array, default: []},
		other_transaction_count: {type: Number, default: 0},
		other_transactions: {type: Array, default: []}
	}
});

VpaReconciliationsSchema.plugin(Timestamps);
// VpaReconciliationsSchema.plugin(MongooseSoftDelete, {overrideMethods: 'all'});

const VpaReconciliationsModel = ReconciliationsDataBase.model('store_transactions', VpaReconciliationsSchema);

module.exports = VpaReconciliationsModel;
