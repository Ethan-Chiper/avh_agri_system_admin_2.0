const Express = require('express');
const app = Express();
let helmet = require('helmet');
app.use(Express.json());
app.use(helmet.hidePoweredBy());

const winston = require('winston');
const logger = winston.createLogger({
    transports: [new winston.transports.Console(),]
});

require('../Source/App/MultiConnection').createConnection();
require('../Source/Controllers/SettlementController').generateSettlementCron();


app.use('/api/farmer', require('./Routes/FarmerRouter'));
app.use('/api/admin', require('./Routes/AdminRouter'));
app.use('/api/customer', require('./Routes/CustomerRouter'));
app.use('/api/transaction', require('./Routes/TransactionRouter'));

let server = app.listen(5022, () => {
    logger.info('Server is running port on: ' + server.address().port);
});

module.exports = app;

