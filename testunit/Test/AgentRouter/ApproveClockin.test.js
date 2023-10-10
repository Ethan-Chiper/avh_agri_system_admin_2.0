const Request = require('supertest');
const Expect = require('chai').expect;
const dotenv = require('dotenv');
dotenv.config();

const BaseUrl = 'http://localhost:1507/api/store-admin';

let requestData = {
	phone_number: '8015073014'
};

let commonHeader = {
	['x-consumer-username']: 'admin_zoHP@GkUR'
};

describe('Approve Clock In', function () {
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
	it('1.Should update a approve clock in with valid request data', function (done) {
		Request(BaseUrl)
			.post('/agent/approve-clockin')
			.send(requestData)
			.expect(200)
			.set(commonHeader)
			.then((responce) => {
				Expect(responce?.body?.message).to.be.eql('Clock in approved');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('2.Should not approve clockin as the common header is not set.', function (done) {
		Request(BaseUrl)
			.get('/agent/approve-clockin')
			.expect(401)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Unauthorized Access!');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});
	describe('Approve Clock In', function () {
		it('3.Should update data with valid request', function (done) {
			let invalidData = structuredClone(requestData);
			delete invalidData.phone_number;
			Request(BaseUrl)
				.post('/agent/approve-clockin')
				.send(invalidData)
				.expect(422)
				.set(commonHeader)
				.then((responce) => {
					Expect(responce?.body?.message).to.be.eql('Please provide agent phone number');
					done();
				})
				.catch((error) => {
					done(error);
				});
		});
	});
});
