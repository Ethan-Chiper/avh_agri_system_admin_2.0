// error wrapper for express
require('express-async-errors');

// imports section
const Express = require('express');
const App = Express();
const Morgan = require('morgan');
const Helmet = require('helmet');
const UserAgent = require('express-useragent');
const BoolParser = require('express-query-boolean');
const SwaggerUI = require('swagger-ui-express');
const SwaggerJsDocs = require('swagger-jsdoc');
const Cors = require('cors');
const {isEmpty} = require('./Helpers/Utils');
const CookieSession = require('cookie-session');
const CookieParser = require('cookie-parser');
const CsrfValidation = require('./Helpers/CsurfValidation');
const IdGenerator = require('./Helpers/IdGenerator');
const {app_info} = require('./Helpers/Logger');

// express configurations starting here.
App.use(Morgan('dev'));
App.use(Express.json());
App.use(Helmet());
App.use(BoolParser());
App.use(UserAgent.express());
App.use(
	Cors({
		origin: [
			'http://localhost:3000',
			'http://localhost:3001',
			'http://localhost:3002',
			'http://127.0.0.1:3000',
			'http://localhost/',
			'http://127.0.0.1/',
			'http://15.206.47.231:8086/'
		],
		credentials: true
	})
);
App.use(IdGenerator());

App.use(CookieParser());
App.use(
	CookieSession({
		keys: 'csrfToken'
	})
);
App.use(CsrfValidation);

App.use((request, response, next) => {
	app_info({request});
	const originalSend = response.send;

	response.send = function (body) {
		if (response.locals.middlewareApplied) {
			originalSend.apply(response, arguments);
			return next();
		}
		response.locals.middlewareApplied = true;
		let data = {
			statusCode: response.statusCode,
			headers: response.getHeaders(),
			body,
			log_id: request?.body?.logged_user?.log_id
		};
		app_info({request, data});
		originalSend.apply(response, arguments);
	};

	next();
});

/*----------------------------------------------------------------------------*/
// Routes Configurations
App.use('/api/store-admin/update', require('./Routes/UpdateRouter'));
App.use('/api/store-admin/auth', require('./Routes/AuthRouter'));
App.use('/api/store-admin/admin', require('./Routes/AdminRouter'));
App.use('/api/store-admin/vpa', require('./Routes/VpaRouter'));
App.use('/api/store-admin/bank', require('./Routes/BankRouter'));
App.use('/api/store-admin/store', require('./Routes/StoreRouter'));
App.use('/api/store-admin/sub-user', require('./Routes/SubUserRouter'));
App.use('/api/store-admin/merchant', require('./Routes/MerchantRouter'));
App.use('/api/store-admin/sub-merchant', require('./Routes/SubmerchantRouter'));
App.use('/api/store-admin/properties', require('./Routes/PropertiesRouter'));
App.use('/api/store-admin/agent', require('./Routes/AgentRouter'));
App.use('/api/store-admin/pos/request', require('./Routes/PosRequestRouter'));
App.use('/api/store-admin/pos/category', require('./Routes/CategoryRouter'));
App.use('/api/store-admin/pos/product', require('./Routes/ProductRouter'));
App.use('/api/store-admin/push-notification', require('./Routes/PushNotificationRouter'));
App.use('/api/store-admin/dispute', require('./Routes/DisputeRouter'));
App.use('/api/store-admin/qc/merchant', require('./Routes/QcRouter'));
App.use('/api/store-admin/partner', require('./Routes/PartnerRouter'));
App.use('/api/store-admin/soundbox', require('./Routes/SoundboxRouter'));
App.use('/api/store-admin/soundbox/plan', require('./Routes/PlanRouter'));
App.use('/api/store-admin/insurance', require('./Routes/InsuranceRouter'));
App.use('/api/store-admin/transaction', require('./Routes/TransactionRouter'));
App.use('/api/store-admin/loan', require('./Routes/LoanRouter'));
App.use('/api/store-admin/mandate', require('./Routes/MandateRouter'));
App.use('/api/store-admin/order', require('./Routes/ProductPurchaseRequestRouter'));
App.use('/api/store-admin/survey', require('./Routes/SurveyRouter'));
App.use('/api/store-admin/settlement', require('./Routes/SettlementRouter'));
App.use('/api/store-admin/vpa-reconciliations', require('./Routes/VpaReconciliationsRouter'));
/*----------------------------------------------------------------------------*/

// main error handler middleware for express
App.use((error, request, response, next) => {
	if (!isEmpty(error)) {
		// eslint-disable-next-line no-console
		console.log(error);
		if (error.code === 'EBADCSRFTOKEN') {
			response.status(406);
			return response.send({
				success: false,
				message: 'Wrong CSRF Token'
			});
		}
		return response?.status(500)?.send({
			success: false,
			message: `Internal Server Error: ${error?.message || error}`
		});
	}
	next(error);
});

// swagger section
const SwaggerOptions = SwaggerJsDocs({
	definition: require('../Docs/Swagger.json'),
	apis: []
});
App.use('/api-docs', SwaggerUI.serve, SwaggerUI.setup(SwaggerOptions));

require('./App/Connection')?.establish(App);
module.exports = App;
