const Request = require('supertest');
const Expect = require('chai').expect;
const dotenv = require('dotenv');
dotenv.config();

const Baseurl = 'http://localhost:1507/api/store-admin';

const CommonHeader = {
	['x-consumer-username']: 'admin_zoHP@GkUR'
};

describe('Agent Details', function () {
	it('1. Should show agent details.', function (done) {
		Request(Baseurl)
			.get('/agent/details/Xc0nc2t23')
			.set(CommonHeader)
			.expect(200)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Agent details.');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('2. Should not show agent details as the common header is not set.', function (done) {
		Request(Baseurl)
			.get('/agent/details/Xc0nc2t23')
			.expect(401)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Unauthorized Access!');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('3. Should not show agent details as the person is not logged in user', function (done) {
		Request(Baseurl)
			.get('/agent/details/Xc0nc2t23')
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

	it('4. Should not show agent details as the admin id is unauthorized', function (done) {
		Request(Baseurl)
			.get('/agent/details/Xc0nc2t23')
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

	it('5. Should not show agent details as the agent id is not provided.', function (done) {
		Request(Baseurl)
			.get('/agent/details/')
			.expect(404)
			.set(CommonHeader)
			.then((response) => {
				Expect(response?.res?.statusMessage).to.be.eql('Not Found');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('6. Should not show agent does not exist', function (done) {
		Request(Baseurl)
			.get('/agent/details/wrong123id')
			.expect(400)
			.set(CommonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('No agent found!');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});
});
