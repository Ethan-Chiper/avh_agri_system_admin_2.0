/* eslint-disable unicorn/prevent-abbreviations */
const Express = require('express');
const Router = Express.Router();
const TransactionController = require('../Controllers/TransactionController');

Router.post('/create', (req, res) => {
	return TransactionController.createTransaction(req, res);
});
Router.get('/upi_dashboard', (req, res) => {
	return TransactionController.transactionUPIDashboard(req, res);
});

module.exports = Router;
