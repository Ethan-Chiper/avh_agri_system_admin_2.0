const Request = require('supertest');
const Expect = require('chai').expect;
const dotenv = require('dotenv');
dotenv.config();

const Baseurl = 'http://localhost:1507/api/store-admin';

const CommonHeader = {
	['x-consumer-username']: 'admin_zoHP@GkUR'
};

describe('Agent list', function () {
	it('Should show agent list', function (done) {
		Request(Baseurl)
			.get('/agent/agent/list')
			.set(CommonHeader)
			.expect(200)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Agent list are.');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('1.Should not list any agent as the common header is not set', function (done) {
		Request(Baseurl)
			.get('/agent/agent/list')
			.expect(401)
			.then((response) => {
				Expect(response.body.message).to.be.eql('Unauthorized Access!');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});
	it('2.Should not list any agent list as the admin id is unauthorized', function (done) {
		Request(Baseurl)
			.get('/agent/agent/list')
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
	it('3.Should list the product as the page is', function (done) {
		Request(Baseurl)
			.get('/agent/agent/list?page=2')
			.set(CommonHeader)
			.expect(200)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Agent list are.');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});
	it('4.Should list the search name', function (done) {
		Request(Baseurl)
			.get('/agent/agent/list?name.full=Anbu')
			.set(CommonHeader)
			.expect(200)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Agent list are.');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});
	it('5.Should list the agent as the agent_id is', function (done) {
		Request(Baseurl)
			.get('/agent/agent/list?agent_id=eK3wN8G2s')
			.set(CommonHeader)
			.expect(200)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Agent list are.');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('6.Should list the agent as the agent_id and state and status filter', function (done) {
		Request(Baseurl)
			.get('/agent/agent/list?page=1&limit=25&state=Tamil%20Nadu&status=active')
			.set(CommonHeader)
			.expect(200)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Agent list are.');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});
});
