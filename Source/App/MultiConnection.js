/* eslint-disable no-unused-vars */
// const admin = require("mongeese").create();
// const farmer = require("mongeese").create();
// const customer = require("mongeese").create();
// const transaction = require("mongeese").create();
const mongoose = require('mongoose');
const Config = require('./Config');
const DB_URL = Config.AGRI_DB_URL;
const winston = require('winston');
const logger = winston.createLogger({
    transports: [new winston.transports.Console()]
});

function MultiDBConnection() {
    this.createConnection = () => {
        mongoose.connect(DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 10000})
            // mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
            .then(() => logger.info('ADMIN DB Connected'))
            .catch(err => logger.info('ADMIN DB Caught', err.stack));
        mongoose.set('debug', true);

        mongoose.connect(DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 10000})
            // mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
            .then(() => logger.info('FARMER DB Connected'))
            .catch(err => logger.info('FARMER DB Caught', err.stack));
        mongoose.set('debug', true);

        mongoose.connect(DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 10000})
            // mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
            .then(() => logger.info('TRANSACTION DB Connected'))
            .catch(err => logger.info('TRANSACTION DB Caught', err.stack));
        mongoose.set('debug', true);
        // customer.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true }).
        //     then(() => console.log('CUSTOMER DB Connected')).
        //     catch(err => console.log('CUSTOMER DB Caught', err.stack));
        mongoose.connect(DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 10000
        })
            .then(() => logger.info('CUSTOMER DB Connected'))
            .catch(error => logger.info(error.message));
        mongoose.set('debug', true);

        mongoose.connect(DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 10000
        })
            .then(() => logger.info('SETTLEMENT DB Connected'))
            .catch(error => logger.info(error.message));
        mongoose.set('debug', true);

    };

    this.getAdminDBConnection = () => {
        return mongoose;
    };

    this.getFarmerDBConnection = () => {
        return mongoose;
    };

    this.getTransactionDBConnection = () => {
        return mongoose;
    };

    this.getCustomerDBConnection = () => {
        return mongoose;
    };

    this.getSettlementUpiConnection = () => {
        return mongoose;
    };
}

module.exports = new MultiDBConnection();