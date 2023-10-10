const Request = require('supertest');
const Expect = require('chai').expect;
const dotenv = require('dotenv');
dotenv.config();

const BaseUrl = 'http://localhost:1507/api/store-admin';

let commonHeader = {
	['x-consumer-username']: 'admin_zoHP@GkUR'
};

describe('VpaReconciliation Report', function () {
	it('1. Should not Report if the person is not logged user', function (done) {
		Request(BaseUrl)
			.get('/vpa-reconciliations/report')
			.set({['x-consumer-username']: 'merchant_zoHP@GkUR'})
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Not a valid user');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('2. Should not Report, if the admin id is unatuhorized', function (done) {
		Request(BaseUrl)
			.get('/vpa-reconciliations/report')
			.set({['x-consumer-username']: 'admin_456invalid'})
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Not a valid user!');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('3. Should not list, if the admin id is not provided', function (done) {
		Request(BaseUrl)
			.get('/vpa-reconciliations/report')
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Unauthorized Access!');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('4. Should show Report, if the admin id is valid', function (done) {
		Request(BaseUrl)
			.get('/vpa-reconciliations/report')
			.set(commonHeader)
			.then((response) => {
				let headers = response?.text?.split(/\n/g, 1)[0];
				Expect(headers).to.be.eql('recon_id,slot,Bank,M_ID,Available,Missed,Other');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('5. Should show Report if the date_option is provided', function (done) {
		Request(BaseUrl)
			.get('/vpa-reconciliations/report?date_option=2022-12-16')
			.set(commonHeader)
			.then((response) => {
				let row = response?.text?.split(/\n/g)[1]?.split(',');
				Expect(row[1]).to.be.eql(' 20221216');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('6. Should not Report if the date_option is not in format of YYYY-MM-DD', function (done) {
		Request(BaseUrl)
			.get('/vpa-reconciliations/report?date_option=2022-2-16')
			.set(commonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('date_option must have to be a date in YYYY-MM-DD format');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});
});
