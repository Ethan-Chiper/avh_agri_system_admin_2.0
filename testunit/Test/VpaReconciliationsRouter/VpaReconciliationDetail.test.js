const Request = require('supertest');
const Expect = require('chai').expect;
const dotenv = require('dotenv');
dotenv.config();

const BaseUrl = 'http://localhost:1507/api/store-admin';

let commonHeader = {
	['x-consumer-username']: 'admin_zoHP@GkUR'
};

describe('VpaReconciliation Detail', function () {
	it('1. Should not detail if the person is not logged user', function (done) {
		Request(BaseUrl)
			.get('/vpa-reconciliations/detail/RDI59psOb')
			.set({['x-consumer-username']: 'merchant_zoHP@GkUR'})
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Not a valid user');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('2. Should not detail, if the admin id is unatuhorized', function (done) {
		Request(BaseUrl)
			.get('/vpa-reconciliations/detail/RDI59psOb')
			.set({['x-consumer-username']: 'admin_456invalid'})
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Not a valid user!');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('3. Should not detail, if the admin id is not provided', function (done) {
		Request(BaseUrl)
			.get('/vpa-reconciliations/detail/RDI59psOb')
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Unauthorized Access!');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('4. Should show detail when recon_id is provided correctly', function (done) {
		Request(BaseUrl)
			.get('/vpa-reconciliations/detail/RDI59psOb')
			.set(commonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Store Transaction Detail');
				Expect(response?.body?.data).to.an('object');
				Expect(response?.body?.data).to.have.keys('recon_id', 'slot', 'bank', 'result');
				Expect(response?.body?.data?.result).to.have.keys('other_transaction_count', 'other_transactions');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('5. Should not detail when recon_id is not valid', function (done) {
		Request(BaseUrl)
			.get('/vpa-reconciliations/detail/invalidId')
			.set(commonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('recon_id is not found');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});
});
