const Express = require('express');
const App = Express();
let helmet = require('helmet');
App.use(Express.json());
App.use(helmet.hidePoweredBy());

const winston = require('winston');
const logger = winston.createLogger({
	transports: [new winston.transports.Console()]
});

require('../Source/App/MultiConnection').establish(App);
require('../Source/Controllers/SettlementController').generateSettlementCron();
/***--------------------------------------------------------------------------***/
App.use('/api/farmer', require('./Routes/FarmerRouter'));
App.use('/api/admin', require('./Routes/AdminRouter'));
App.use('/api/customer', require('./Routes/CustomerRouter'));
App.use('/api/transaction', require('./Routes/TransactionRouter'));
/***--------------------------------------------------------------------------***/
// let server = app.listen(5022, () => {
// 	logger.info('Server is running port on: ' + server.address().port);
// });

module.exports = App;
