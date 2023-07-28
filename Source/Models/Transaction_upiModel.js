const DBConnections = require('../App/MultiConnection');
const getTransactionDB = DBConnections.getTransactionDBConnection();
const timestamps = require('mongoose-timestamp');
const mongoose = require('mongoose');

function Schema() {
	let transactionUpiSchema = new getTransactionDB.Schema({
		merchant: {
			id: {type: String},
			name: {type: String}
		},
		store: {
			id: {type: String},
			name: {type: String}
		},
		created_on: {type: Number},
		transaction: {
			volume: {type: Number},
			count: {type: Number}
		}
	});

	let getTransactionUpiSchema = new getTransactionDB.Schema(transactionUpiSchema);
	getTransactionUpiSchema.plugin(timestamps);

	let TransactionUpiModel = mongoose.model('transactions_upi', getTransactionUpiSchema);

	this.getTransactioUpiModel = () => {
		return TransactionUpiModel;
	};
}

module.exports = new Schema();
