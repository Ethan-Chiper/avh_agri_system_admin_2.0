const Request = require('supertest');
const Expect = require('chai').expect;
const dotenv = require('dotenv');
dotenv.config();

const BaseUrl = 'http://localhost:1507/api/store-admin';

let requestData = {
	agent_id: 'GbLZaePp3',
	new_role: 'asm'
};

let commonHeader = {
	['x-consumer-username']: 'admin_zoHP@GkUR'
};

describe('Agent Change role', function () {
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
	it('1.Should update phone with valid request data', function (done) {
		Request(BaseUrl)
			.post('/agent/change-role')
			.send(requestData)
			.expect(200)
			.set(commonHeader)
			.then((responce) => {
				Expect(responce?.body?.message).to.be.eql('Role changed successfully!');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('2.Should not create map location as the common header is not set.', function (done) {
		Request(BaseUrl)
			.get('/agent/change-role')
			.expect(401)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Unauthorized Access!');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});
	describe('Agent Change role', function () {
		it('3.Should change role data with valid request', function (done) {
			let invalidData = structuredClone(requestData);
			delete invalidData.agent_id;
			Request(BaseUrl)
				.post('/agent/change-role')
				.send(invalidData)
				.expect(422)
				.set(commonHeader)
				.then((responce) => {
					Expect(responce?.body?.message).to.be.eql('Please provide agentId.');
					done();
				})
				.catch((error) => {
					done(error);
				});
		});
	});
});
