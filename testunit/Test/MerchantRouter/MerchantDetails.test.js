const Request = require('supertest');
const Expect = require('chai').expect;
const dotenv = require('dotenv');
dotenv.config();

const BaseUrl = 'http://localhost:1507/api/store-admin';

let commonHeader = {
	['x-consumer-username']: 'admin_BWpaitTqT5'
};

describe('Merchant Details', function () {
	it('1. Should show merchant details.', function (done) {
		Request(BaseUrl)
			.get('/merchant/details/gSyr95bsg3')
			.set(commonHeader)
			.expect(200)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Merchant details');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('2. Should not show merchant details as the common header is not set.', function (done) {
		Request(BaseUrl)
			.get('/merchant/details/gSyr95bsg3')
			.expect(401)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Unauthorized Access!');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('3. Should not show merchant details as the person is not logged in user', function (done) {
		Request(BaseUrl)
			.get('/merchant/details/gSyr95bsg3')
			.set({['x-consumer-username']: 'merchant_BWpaitTqT5'})
			.expect(401)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Not a valid user');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('4. Should not show merchant details as the admin id is unauthorized', function (done) {
		Request(BaseUrl)
			.get('/merchant/details/gSyr95bsg3')
			.set({['x-consumer-username']: 'admin_123redd'})
			.expect(401)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Not a valid user!');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('5. Should not show merchant details as the merchant id is not provided.', function (done) {
		Request(BaseUrl)
			.get('/merchant/details/')
			.expect(404)
			.set(commonHeader)
			.then((response) => {
				Expect(response?.res?.statusMessage).to.be.eql('Not Found');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('6. Should not show store details as the sub user does not exists', function (done) {
		Request(BaseUrl)
			.get('/merchant/details/wrong123id')
			.expect(200)
			.set(commonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Merchant Not Found!');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});
});
