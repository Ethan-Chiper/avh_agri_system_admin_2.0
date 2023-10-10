const Request = require('supertest');
const Expect = require('chai').expect;
const dotenv = require('dotenv');
dotenv.config();

const Baseurl = 'http://localhost:1507/api/store-admin';

const CommonHeader = {
	['x-consumer-username']: 'admin_zoHP@GkUR'
};

// eslint-disable-next-line mocha/no-exclusive-tests
describe('Soundbox list', function () {
	it('Should show soundbox list', function (done) {
		Request(Baseurl)
			.get('/soundbox/list')
			.set(CommonHeader)
			.expect(200)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Soundbox lists');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});
	it('Should not list any soundboox as the common header is not set', function (done) {
		Request(Baseurl)
			.get('/soundbox/list')
			.expect(401)
			.then((response) => {
				Expect(response.body.message).to.be.eql('Unauthorized Access!');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});
	it('Should not list any soundbox as the admin id is unauthorized', function (done) {
		Request(Baseurl)
			.get('/soundbox/list')
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
	it('Should list the soundbox as the page is', function (done) {
		Request(Baseurl)
			.get('/soundbox/list?page=2')
			.set(CommonHeader)
			.expect(200)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Soundbox lists');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});
});
