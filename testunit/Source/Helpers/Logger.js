/* eslint-disable jsdoc/check-param-names,security/detect-object-injection */
const Config = require('../App/Config');
const FluentClient = require('@fluent-org/logger').FluentClient;
const Moment = require('moment-timezone');

//Fluentd Logger section
const Log = new FluentClient('ippopay-store-admin-node-api', {
	socket: {
		host: Config.ELASTIC.IP,
		port: Config.ELASTIC.PORT,
		timeout: Config.ELASTIC.TIMEOUT
	}
});

const Logger = {
	/**
	 * Info for logger
	 * @param request.request
	 * @param request
	 * @param data
	 * @param request.data
	 */
	app_info: ({request, data}) => {
		try {
			if (data) {
				let result, isoConverted;
				if (data?.body?.data) {
					result = JSON.parse(JSON.stringify(data?.body?.data));
					isoConverted = Logger?.formatAndMaskData(result, request);
				}
				Log.emit({
					microservice: 'store-admin-node-api',
					level: 'info',
					body: isoConverted || {},
					headers: data?.headers,
					statusCode: data?.statusCode,
					message: JSON.stringify(data?.body?.message) || '',
					log_id: request?.body?.loggedUser?.log_id || ''
				});
			} else {
				Log.emit({
					microservice: 'store-admin-node-api',
					level: 'info',
					path: request?.path || '/',
					headers: request?.headers || {},
					body: request?.body || {},
					'Request-query': request?.query || {},
					log_id: request?.body?.loggedUser?.log_id || ''
				});
			}
		} catch (error) {
			// eslint-disable-next-line no-console
			console.log(error);
		}
	},

	/**
	 * Error for logger
	 * @param error
	 * @param request
	 * @param functionName
	 * @param loggedUser
	 */
	app_error: (error, request, functionName, loggedUser) => {
		try {
			Log.emit({
				microservice: 'store-admin-node-api',
				level: 'error',
				path: request?.path || '/',
				'Error-Message': error?.message || '',
				headers: request?.headers || {},
				'Request-data': request?.body || {},
				'Request-params': request?.params || {},
				'Request-query': request?.query || {},
				'error-description': error.stack,
				position: functionName || '',
				log_id: request?.body?.loggedUser?.log_id || loggedUser?.log_id || ''
			});
		} catch (error) {
			// eslint-disable-next-line no-console
			console.log(error);
		}
	},
	/**
	 * Warning for Logger
	 * @param error
	 * @param data
	 * @param loggedUser
	 * @param functionName
	 */
	app_warning: (error, data, loggedUser, functionName) => {
		try {
			let result = JSON.parse(JSON.stringify(data));
			let isoConverted = Logger?.formatAndMaskData(result);
			Log.emit({
				microservice: 'store-admin-node-api',
				level: 'warning',
				'Error-Message': error || '',
				body: isoConverted || {},
				position: functionName || '',
				log_id: loggedUser?.log_id
			});
		} catch (error) {
			// eslint-disable-next-line no-console
			console.log(error);
		}
	},

	/**
	 * Notice for validation errors
	 * @param error
	 * @param loggedUser
	 * @param functionName
	 */
	app_notice: (error, loggedUser, functionName) => {
		try {
			Log.emit({
				microservice: 'store-admin-node-api',
				level: 'warning',
				'Error-Message': error?.msg || '',
				'Error-Data': error?.value || '',
				position: functionName || '',
				log_id: loggedUser?.log_id || ''
			});
		} catch (error) {
			// eslint-disable-next-line no-console
			console.log(error);
		}
	},
	/**
	 * to convert data formats
	 * @param data
	 * @param request
	 * @returns {*}
	 */
	formatAndMaskData: (data, request) => {
		try {
			if (Array.isArray(data)) {
				return data.map((object) => Logger?.formatAndMaskData(object));
			}

			let phReg = /^[6-9]\d{9}$/;
			let emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]{2,3}$/;
			let dateRegex =
				// eslint-disable-next-line unicorn/better-regex
				/^(\d{4}-\d{2}-\d{2} (?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d\.\d{6}) ([A-Za-z]{3}) \(GMT [+-]\d{2}(?::[0-5]\d)?|\d{2}([0-5]\d)\)$/;
			let maskLength = 4;
			let formats = [
				'YYYY-MM-DD HH:mm:ss.SSSSSS z [(GMT] Z[)]',
				'YYYY-MM-DD',
				'DD/MM/YYYY',
				'YYYY-MM-DDTHH:mm:ssZ',
				'YYYY-MM-DDTHH:mm:ss.SSSZ',
				'DD-MM-YYYY',
				'YYYY/MM/DD',
				'YYYY.MM.DD',
				'YYYY_MM_DD',
				'YYYY-MM-DD HH:mm',
				'YYYY.MM.DD HH:mm',
				'YYYY/MM/DD HH:mm',
				'YYYY_MM_DD HH:mm',
				'YYYY-MM-DDTHH:mm',
				'YYYY.MM.DDTHH:mm',
				'YYYY/MM/DDTHH:mm',
				'YYYY_MM_DDTHH:mm',
				'YYYY-MM-DD HH:mm:ss',
				'YYYY.MM.DD HH:mm:ss',
				'YYYY/MM/DD HH:mm:ss',
				'YYYY_MM_DDTHH:mm:ss',
				'YYYY-MM-DDTHH:mm:ss',
				'YYYY.MM.DDTHH:mm:ss',
				'YYYY/MM/DDTHH:mm:ss',
				'YYYY_MM_DDTHH:mm:ss'
			];

			for (let parse in data) {
				// eslint-disable-next-line no-prototype-builtins
				if (data.hasOwnProperty(parse)) {
					let value = data[parse];
					if (value !== null && typeof value === 'object') {
						if (Array.isArray(value)) {
							data[parse] = value.map((object) => Logger?.formatAndMaskData(object));
						} else {
							Logger?.formatAndMaskData(value);
						}
					}
					let parsedDate;
					for (const format of formats) {
						parsedDate = Moment(value, format, true);
						if (parsedDate?.isValid()) {
							break;
						}
					}
					if (!parsedDate?.isValid() && dateRegex.test(value)) {
						parsedDate = Moment.tz(value, 'YYYY-MM-DD HH:mm:ss.SSSSSS z [(GMT] Z[)]', Moment.tz.guess());
					}
					if (parsedDate && parsedDate?.isValid()) {
						data[parse] = parsedDate.format('YYYY-MM-DD');
					}

					if (typeof value === 'string' && phReg.test(value)) {
						data[parse] = value.slice(0, -maskLength).replaceAll(/./g, '*') + value.slice(-maskLength);
					}
					if (emailReg.test(value)) {
						const [x, y] = value.split('@');
						if (x.length <= maskLength) maskLength = x.length - 1;
						if (y.length <= maskLength) maskLength = y.length - 1;
						data[parse] =
							x.slice(0, maskLength) +
							'*'.repeat(x.length - maskLength) +
							'@' +
							y.slice(0, maskLength) +
							'*'.repeat(y.length - maskLength);
					}
				}
			}
			return data;
		} catch (error) {
			Logger.app_error(error, request, 'Format and Mask Data Logger');
		}
	}
};

module.exports = Logger;
