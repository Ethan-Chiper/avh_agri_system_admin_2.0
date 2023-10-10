/* eslint-disable no-console,no-useless-catch */
const AdminDB = require('./MongooseConnection').create();
const AgentDB = require('./MongooseConnection').create();
const LeadsDB = require('./MongooseConnection').create();
const TransactionDB = require('./MongooseConnection').create();
const PropertyDB = require('./MongooseConnection').create();
const ReconciliationsDB = require('./MongooseConnection').create();
const mongoose = require('mongoose');
const Config = require('./Config');
const DBUrl = Config.DB_URL;

const DBConnection = {
	establish: async (Express) => {
		return await new Promise((resolve) => {
			let adminDBCheck = false;

			AdminDB.set('strictQuery', true);
			try {
				AdminDB.connect(DBUrl.ADMIN, {useNewUrlParser: true, useUnifiedTopology: true});
				console.log('Admin database connection established');
				adminDBCheck = true;
			} catch (error) {
				throw error;
			}
			AdminDB.set('debug', true);

			let agentDBCheck = false;
			AgentDB.set('strictQuery', true);
			try {
				AgentDB.connect(DBUrl.AGENT, {useNewUrlParser: true, useUnifiedTopology: true});
				console.log('Agent database connection established');
				agentDBCheck = true;
			} catch (error) {
				throw error;
			}
			AgentDB.set('debug', true);

			let transactionDBCheck = false;
			TransactionDB.set('strictQuery', true);
			try {
				TransactionDB.connect(DBUrl.TRANSACTION, {useNewUrlParser: true, useUnifiedTopology: true});
				console.log('Transaction database connection established');
				transactionDBCheck = true;
			} catch (error) {
				throw error;
			}
			TransactionDB.set('debug', true);

			let propertyDBCheck = false;
			PropertyDB.set('strictQuery', true);
			try {
				PropertyDB.connect(DBUrl.PROPERTY, {useNewUrlParser: true, useUnifiedTopology: true});
				console.log('Property database connection established');
				propertyDBCheck = true;
			} catch (error) {
				throw error;
			}
			PropertyDB.set('debug', true);

			let leadsDBCheck = false;

			LeadsDB.set('strictQuery', true);
			try {
				LeadsDB.connect(DBUrl.LEADS, {useNewUrlParser: true, useUnifiedTopology: true});
				console.log('Leads database connection established');
				leadsDBCheck = true;
			} catch (error) {
				throw error;
			}
			LeadsDB.set('debug', true);

			let reconciliationsDBCheck = false;
			ReconciliationsDB.set('strictQuery', true);
			try {
				ReconciliationsDB.connect(DBUrl.RECONCILIATIONS, {useNewUrlParser: true, useUnifiedTopology: true});
				console.log('Reconciliations database connection established');
				reconciliationsDBCheck = true;
			} catch (error) {
				throw error;
			}
			ReconciliationsDB.set('debug', true);

			let testProductDBCheck = false;
			mongoose.set('strictQuery', true);
			try {
				mongoose.connect('mongodb://192.168.0.108:27017/Product', {
					useNewUrlParser: true,
					useUnifiedTopology: true
				});
				console.log('test_product database connection established');
				testProductDBCheck = true;
			} catch (error) {
				throw error;
			}

			resolve([
				adminDBCheck,
				agentDBCheck,
				transactionDBCheck,
				propertyDBCheck,
				leadsDBCheck,
				reconciliationsDBCheck,
				testProductDBCheck
			]);
		})
			.then(() => {
				Express.listen('1507', () => {
					console.log('server is running in 1507');
				});
			})
			.catch((error) => {
				throw error;
			});
	},

	/**
	 * To Get Admin DB Connection
	 * @returns {*}
	 */
	getAdminDBConnection: () => {
		return AdminDB;
	},

	/**
	 * To Get Agent DB Connection
	 * @returns {*}
	 */
	getAgentDBConnection: () => {
		return AgentDB;
	},

	/**
	 * To Get Property DB Connection
	 * @returns {*}
	 */
	getPropertyDBConnection: () => {
		return PropertyDB;
	},

	getLeadsDBConnection: () => {
		return LeadsDB;
	},

	/**
	 * To Get Transaction DB Connection
	 * @returns {*}
	 */
	getTransactionDBConnection: () => {
		return TransactionDB;
	},

	/**
	 * To Get Reconciliations DB Connection
	 * @returns {*}
	 */
	getReconciliationsDBConnection: () => {
		return ReconciliationsDB;
	},
	getTestProductDBConnection: () => {
		return mongoose;
	}
};

module.exports = DBConnection;
