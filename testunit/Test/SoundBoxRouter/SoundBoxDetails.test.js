const Request = require('supertest');
const Expect = require('chai').expect;
const dotenv = require('dotenv');
dotenv.config();

const BaseUrl = 'http://localhost:1507/api/store-admin';

let commonHeader = {
	['x-consumer-username']: 'admin_zoHP@GkUR'
};

describe('Soundbox Details', function () {
	it('1. Should show soundbox details.', function (done) {
		Request(BaseUrl)
			.get('/soundbox/detail/Ogm8MWt6RcnQe')
			.set(commonHeader)
			.expect(200)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Soundbox details are');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('2. Should not show soundbox details as the common header is not set.', function (done) {
		Request(BaseUrl)
			.get('/soundbox/detail/Ogm8MWt6R cnQe')
			.expect(401)
			.then((response) => {
				Expect(response?.body?.message).to.be.include('Unauthorized');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('3. Should not show soundbox details as the person is not logged in user', function (done) {
		Request(BaseUrl)
			.get('/soundbox/detail/Ogm8MWt6RcnQe')
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

	it('4. Should not show soundbox details as the admin id is unauthorized', function (done) {
		Request(BaseUrl)
			.get('/soundbox/detail/Ogm8MWt6RcnQe')
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

	it('5. Should not show soundbox details as the device id is not provided.', function (done) {
		Request(BaseUrl)
			.get('/soundbox/detail/')
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

	it('6. Should not show soundbox details as the store does not exists', function (done) {
		Request(BaseUrl)
			.get('/soundbox/detail/Ogm8MWt6RcnQe')
			.expect(200)
			.set(commonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Soundbox details are');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});
});
