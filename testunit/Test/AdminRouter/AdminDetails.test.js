const Request = require('supertest');
const Expect = require('chai').expect;
const dotenv = require('dotenv');
dotenv.config();

const BaseUrl = 'http://localhost:1507/api/store-admin';

let commonHeader = {
	['x-consumer-username']: 'admin_BWpaitTqT5'
};

describe('Admin Details', function () {
	it('1. Should show admin details.', function (done) {
		Request(BaseUrl)
			.get('/admin/get-details')
			.set(commonHeader)
			.expect(200)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Admin Details:');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('2. Should not show admin details as the common header is not set.', function (done) {
		Request(BaseUrl)
			.get('/admin/get-details')
			.expect(200)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Unauthorized Access!');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('3. Should not show admin details as the person is not logged-in user', function (done) {
		Request(BaseUrl)
			.get('/admin/get-details')
			.set({['x-consumer-username']: 'merchant_BWpaitTqT5'})
			.expect(200)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Not a valid user');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('4. Should not show admin details as the admin id is unauthorized', function (done) {
		Request(BaseUrl)
			.get('/admin/get-details')
			.set({['x-consumer-username']: 'admin_123redd'})
			.expect(200)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Not a valid user!');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});
});
