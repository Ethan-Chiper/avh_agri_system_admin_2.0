/* eslint-disable no-useless-catch */
/* eslint-disable no-unused-vars */
// const admin = require("mongeese").create();
// const farmer = require("mongeese").create();
// const customer = require("mongeese").create();
// const transaction = require("mongeese").create();
const mongoose = require('mongoose');
const Config = require('./Config');
const DB_URL = Config.AGRI_DB_URL;

const MultiDBConnection = {
	establish: async (Express) => {
		return await new Promise((resolve) => {
			let adminDBCheck = false;
			mongoose.set('strictQuery', true);
			try {
				mongoose.connect(DB_URL, {
					useNewUrlParser: true,
					useUnifiedTopology: true
				});
				console.log('admin database connection established');
				adminDBCheck = true;
			} catch (error) {
				throw error;
			}
			mongoose.set('debug', true);

			let farmerDBCheck = false;
			mongoose.set('strictQuery', true);
			try {
				mongoose.connect(DB_URL, {
					useNewUrlParser: true,
					useUnifiedTopology: true
				});
				console.log('farmer database connection established');
				farmerDBCheck = true;
			} catch (error) {
				throw error;
			}
			mongoose.set('debug', true);

			let transactionDBCheck = false;
			mongoose.set('strictQuery', true);
			try {
				mongoose.connect(DB_URL, {
					useNewUrlParser: true,
					useUnifiedTopology: true
				});
				console.log('transaction database connection established');
				transactionDBCheck = true;
			} catch (error) {
				throw error;
			}
			mongoose.set('debug', true);

			let customerDBCheck = false;
			mongoose.set('strictQuery', true);
			try {
				mongoose.connect(DB_URL, {
					useNewUrlParser: true,
					useUnifiedTopology: true
				});
				console.log('customer database connection established');
				customerDBCheck = true;
			} catch (error) {
				throw error;
			}
			mongoose.set('debug', true);

			let settlementDBCheck = false;
			mongoose.set('strictQuery', true);
			try {
				mongoose.connect(DB_URL, {
					useNewUrlParser: true,
					useUnifiedTopology: true
				});
				console.log('settelment database connection established');
				settlementDBCheck = true;
			} catch (error) {
				throw error;
			}
			mongoose.set('debug', true);

			resolve([
				adminDBCheck,
				farmerDBCheck,
				transactionDBCheck,
				customerDBCheck,
				settlementDBCheck
			]);
		})
			.then(() => {
				Express.listen('5022', () => {
					console.log('server is running in 5022');
				});
			})
			.catch((error) => {
				throw error;
			});
	},

	// mongoose
	// 	.connect(DB_URL, {
	// 		useNewUrlParser: true,
	// 		useUnifiedTopology: true,
	// 		serverSelectionTimeoutMS: 10000
	// 	})
	// 	.then(() => logger.info('ADMIN DB Connected'))
	// 	.catch((err) => logger.info('ADMIN DB Caught', err.stack));
	// mongoose.set('debug', true);

	// mongoose
	// 	.connect(DB_URL, {
	// 		useNewUrlParser: true,
	// 		useUnifiedTopology: true,
	// 		serverSelectionTimeoutMS: 10000
	// 	})
	// 	.then(() => logger.info('FARMER DB Connected'))
	// 	.catch((err) => logger.info('FARMER DB Caught', err.stack));
	// mongoose.set('debug', true);

	// mongoose
	// 	.connect(DB_URL, {
	// 		useNewUrlParser: true,
	// 		useUnifiedTopology: true,
	// 		serverSelectionTimeoutMS: 10000
	// 	})
	// 	.then(() => logger.info('TRANSACTION DB Connected'))
	// 	.catch((err) => logger.info('TRANSACTION DB Caught', err.stack));
	// mongoose.set('debug', true);

	// mongoose
	// 	.connect(DB_URL, {
	// 		useNewUrlParser: true,
	// 		useUnifiedTopology: true,
	// 		serverSelectionTimeoutMS: 10000
	// 	})
	// 	.then(() => logger.info('CUSTOMER DB Connected'))
	// 	.catch((error) => logger.info(error.message));
	// mongoose.set('debug', true);

	// mongoose
	// 	.connect(DB_URL, {
	// 		useNewUrlParser: true,
	// 		useUnifiedTopology: true,
	// 		serverSelectionTimeoutMS: 10000
	// 	})
	// 	.then(() => logger.info('SETTLEMENT DB Connected'))
	// 	.catch((error) => logger.info(error.message));
	// mongoose.set('debug', true);

	getAdminDBConnection: () => {
		return mongoose;
	},

	getFarmerDBConnection: () => {
		return mongoose;
	},

	getTransactionDBConnection: () => {
		return mongoose;
	},

	getCustomerDBConnection: () => {
		return mongoose;
	},

	getSettlementUpiConnection: () => {
		return mongoose;
	}
};

module.exports = MultiDBConnection;
