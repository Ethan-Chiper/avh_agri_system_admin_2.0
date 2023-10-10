const Request = require('supertest');
const Expect = require('chai').expect;
const dotenv = require('dotenv');
dotenv.config();

const BaseUrl = 'http://localhost:1507/api/store-admin';

let commonHeader = {
	['x-consumer-username']: 'admin_BWpaitTqT5'
};

describe('Dispute Details', function () {
	it('1. Should show dispute details.', function (done) {
		Request(BaseUrl)
			.get('/dispute/details/disp_tuG3VVvoz')
			.set(commonHeader)
			.expect(200)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Dispute details');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('2. Should not show dispute details as the common header is not set.', function (done) {
		Request(BaseUrl)
			.get('/dispute/details/disp_tuG3VVvoz')
			.expect(200)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Unauthorized Access!');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('3. Should not show dispute details as the person is not logged in user', function (done) {
		Request(BaseUrl)
			.get('/dispute/details/disp_tuG3VVvoz')
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

	it('4. Should not show dispute details as the admin id is unauthorized', function (done) {
		Request(BaseUrl)
			.get('/dispute/details/disp_tuG3VVvoz')
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

	it('5. Should not show dispute details as the dispute id is not provided.', function (done) {
		Request(BaseUrl)
			.get('/dispute/details')
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

	it('6. Should not show dispute details as the dispute does not exists', function (done) {
		Request(BaseUrl)
			.get('/dispute/details/wrong124id')
			.expect(200)
			.set(commonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Dispute Not Found');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});
});
