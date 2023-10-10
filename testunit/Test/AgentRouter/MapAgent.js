const Request = require('supertest');
const Expect = require('chai').expect;
const dotenv = require('dotenv');
dotenv.config();

const BaseUrl = 'http://localhost:1507/api/store-admin';

let requestData = {
	phone_number: '6666319919'
};

let commonHeader = {
	['x-consumer-username']: 'admin_zoHP@GkUR'
};

describe('approve Clockin', function () {
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
	it('1.Should create a update phone with valid request data', function (done) {
		Request(BaseUrl)
			.post('/agent/edit-agent')
			.send(requestData)
			.expect(200)
			.set(commonHeader)
			.then((responce) => {
				Expect(responce?.body?.message).to.be.eql('Update success');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('2.Should not create category as the common header is not set.', function (done) {
		Request(BaseUrl)
			.get('/agent/edit-agent')
			.expect(401)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Unauthorized Access!');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});
	describe('Agent name', function () {
		it('3.Should update data with valid request', function (done) {
			let invalidData = structuredClone(requestData);
			delete invalidData.agent_name;
			Request(BaseUrl)
				.post('/agent/edit-agent')
				.send(invalidData)
				.expect(422)
				.set(commonHeader)
				.then((responce) => {
					Expect(responce?.body?.message).to.be.eql('Please provide agent name.');
					done();
				})
				.catch((error) => {
					done(error);
				});
		});
	});
});
