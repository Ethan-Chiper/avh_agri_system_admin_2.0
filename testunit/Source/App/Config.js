const Dotenv = require('dotenv');
Dotenv.config({path: 'Source/App/.env'});
const environment = process.env;

module.exports = {
	DB_URL: {
		ADMIN:
			environment.DB_URL_ADMIN ||
			'mongodb+srv://offline-development:wrV3Qx9Mgtvnfj5R@offline-development.tuq1l.mongodb.net/admins',
		AGENT:
			environment.DB_URL_AGENT ||
			'mongodb+srv://offline-development:wrV3Qx9Mgtvnfj5R@offline-development.tuq1l.mongodb.net/agent',
		TRANSACTION:
			environment.DB_URL_TRANSACTION ||
			'mongodb+srv://offline-development:wrV3Qx9Mgtvnfj5R@offline-development.tuq1l.mongodb.net/transactions',
		PROPERTY:
			environment.DB_URL_PROPERTY ||
			'mongodb+srv://offline-development:wrV3Qx9Mgtvnfj5R@offline-development.tuq1l.mongodb.net/properties',
		LEADS:
			environment.DB_URL_LEADS ||
			'mongodb+srv://offline-development:wrV3Qx9Mgtvnfj5R@offline-development.tuq1l.mongodb.net/leads',
		RECONCILIATIONS:
			environment.DB_URL_RECONCILIATIONS ||
			'mongodb+srv://offline-development:wrV3Qx9Mgtvnfj5R@offline-development.tuq1l.mongodb.net/reconciliations',
		TESTPRODUCTS: environment.URL_TESTPRODUCTS || 'mongodb://localhost:27017/Product'
	},
	KONG_URL: environment.KONG_API || 'http://localhost:8001/consumers/',
	IMAGE_BASE_URL: environment.IMAGE_BASE_URL || 'https://ippo-staging.s3.ap-south-1.amazonaws.com/',
	PRE_SIGNED_URL: environment.PRE_SIGNED_URL || 'https://ippo-staging.s3.ap-south-1.amazonaws.com/',
	PRE_SIGNED_CHANGE_URL: environment.PRE_SIGNED_CHANGE_URL || 'https://ippouat.ippopay.com/ippo-staging/',
	SERVICE: {
		TEMPLATE_REF_ID: environment.TEMPLATE_REF_ID,
		AUTH_SERVICE_URL: environment.AUTH_SERVICE_URL || 'http://3.109.238.48:6000/api/auth',
		BANKING_SERVICE_URL: environment.BANKING_SERVICE_URL || 'http://3.109.238.48:7003/api/upi-service',
		PROPERTIES_SERVICE_URL: environment.PROPERTIES_SERVICE_URL || 'http://3.109.238.48:3001/api/properties',
		POS_SERVICE_URL: environment.POS_SERVICE_URL || 'http://3.109.238.48:6003/api/pos',
		COMMON_SERVICE_URL: environment.COMMON_SERVICE_URL || 'http://3.109.238.48:3005/api/common',
		SOUNDBOX_SERVICE: environment.SOUNDBOX_SERVICE_URL || 'http://192.168.0.106:6005/api/soundbox',
		INSURANCE_SERVICE_URL: environment.INSURANCE_SERVICE_URL || 'http://3.109.238.48:4050/api/insurance',
		SETTLEMENT_URL: process.env.SETTLEMENT_URL || 'http://3.109.238.48:3301/api/settlement',
		TRANSACTION_SERVICE_URL:
			environment.TRANSACTION_SERVICE_URL || 'http://3.109.238.48:7004/api/store-transaction',
		LOAN_SERVICE_URL: environment.LOAN_SERVICE_URL || 'http://3.109.238.48:5500/api/lending',
		MANDATE_COLLECTION: {
			ICICI: {
				BASE_URL: environment.ICICI_MANDATE_BASE_URL || 'http://3.109.238.48:5454/api/icici-mandate',
				MERCHANT_ID: environment.ICICI_MANDATE_MERCHANT_ID || 'QTV3MGVPb1pEb1JmeG5LNmY1VlZ5',
				API_KEY: environment.ICICI_MANDATE_API_KEY || 'YzNCV28yb0QzWWZWaXA2'
			}
		}
	},

	PUSH: {
		android: {
			serverKey:
				environment.PUSH_IOS_ANDROID_SERVER_KEY ||
				'AAAA-QwK29o:APA91bFyfAQbTBnEB00InW32GDqU7xXJggwLJSx6bH31odgpn-1FxAOwyaFp-JYW-vPWTvOOghGEQ5vLTQ5uWGIWqkv-ff371wbcU_uBdYH5M1af5_XpH9kHli_8w4SFlln1ugMJVeIL'
		}
	},
	MERCHANT_ID: environment.MERCHANT_ID || 'soToErirP',

	ELASTIC: {
		IP: '13.235.122.192',
		PORT: 9880,
		TIMEOUT: 3000
	},
	FIREBASE_DYN_URL:
		'https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=AIzaSyD9PkJAA9h4bJ6u120uWDJ1QuraKnMc0Zk'
};
