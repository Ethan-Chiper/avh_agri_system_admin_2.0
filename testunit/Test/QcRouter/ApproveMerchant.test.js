const Request = require('supertest');
const Expect = require('chai').expect;
const dotenv = require('dotenv');
dotenv.config();

const BaseUrl = 'http://localhost:1507/api/store-admin';

let requestData = {
	merchant_id: 'nRDlZjC@F',
	document_status: 'approved'
};

let commonHeader = {
	['x-consumer-username']: 'admin_zoHP@GkUR'
};

describe('Approve Merchant', function () {
	before(function (done) {
		Request(BaseUrl)
			.get('/auth/generate-token')
			.expect(200)
			.then((response) => {
				commonHeader['x-csrf-token'] = response.body.data.csrfToken;
				commonHeader['Cookie'] = response.header['set-cookie'];
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('1.Should approve merchant with valid request data', function (done) {
		Request(BaseUrl)
			.patch('/qc/merchant/approve-merchant')
			.send(requestData)
			.expect(200)
			.set(commonHeader)
			.then((responce) => {
				Expect(responce?.body?.message).to.be.eql('Merchant approved successfully!');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	describe('3.Approve merchant with invalid merchant', function () {
		it('3.Should not approve without valid merchant', function (done) {
			requestData.merchant_id = 'nomerchant123';
			Request(BaseUrl)
				.patch('/qc/merchant/approve-merchant')
				.expect(400)
				.set(commonHeader)
				.send(requestData)
				.then((responce) => {
					Expect(responce?.body?.message).to.be.eql('Store documents not verified or store not found');
					done();
				})
				.catch((error) => {
					done(error);
				});
		});
	});

	describe('4.Reject Merchant with reject reason', function () {
		it('3.Should not approve without valid merchant', function (done) {
			requestData.document_status = 'rejected';
			requestData.reject_reason = 'unit test rejected';
			requestData.merchant_id = 'nRDlZjC@F';
			Request(BaseUrl)
				.patch('/qc/merchant/approve-merchant')
				.expect(200)
				.set(commonHeader)
				.send(requestData)
				.then((responce) => {
					Expect(responce?.body?.message).to.be.eql('Merchant rejected successfully!');
					done();
				})
				.catch((error) => {
					done(error);
				});
		});
	});

	describe('5.Reject Merchant without reject reason', function () {
		it('3.Should not approve without valid merchant', function (done) {
			requestData.document_status = 'rejected';
			requestData.reject_reason = '';
			requestData.merchant_id = 'nRDlZjC@F';
			Request(BaseUrl)
				.patch('/qc/merchant/approve-merchant')
				.expect(400)
				.set(commonHeader)
				.send(requestData)
				.then((responce) => {
					Expect(responce?.body?.message).to.be.eql('Please provide rejected reason');
					done();
				})
				.catch((error) => {
					done(error);
				});
		});
	});
});
