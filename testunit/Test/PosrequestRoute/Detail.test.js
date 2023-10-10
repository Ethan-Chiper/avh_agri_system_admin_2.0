const Request = require('supertest');
const Expect = require('chai').expect;
const dotenv = require('dotenv');
dotenv.config();

const Baseurl = 'http://localhost:1507/api/store-admin';

const commonHeader = {
	['x-consumer-username']: 'admin_zoHP@GkUR'
};

describe('Posrequest detail', function () {
	it('should show posrequest detail', function (done) {
		Request(Baseurl)
			.get('/pos/request/detail/fd6675e0-e390-40a9-8047-8a36a0faf2c0')
			.set(commonHeader)
			.expect(200)
			.then((responce) => {
				Expect(responce?.body?.data?.message).to.be.eql('Pos request detail are');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});
	it('Should not view pos request detail', function (done) {
		let invalidAdmin = {
			['x-consumer-username']: 'notAdmin_2521678'
		};
		Request(Baseurl)
			.get('/pos/request/detail/fd6675e0-e390-40a9-8047-8a36a0fafsdew')
			.set(invalidAdmin)
			.expect(200)
			.then((responce) => {
				Expect(responce?.body?.message).to.be.eql('Unauthorized Access!');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});
	it('Should not show any pos request as the common header is not set', function (done) {
		Request(Baseurl)
			.get('/pos/request/detail/fd6675e0-e390-40a9-8047-8a36a0fafsdew')
			.expect(200)
			.then((response) => {
				Expect(response.body.message).to.be.eql('Unauthorized Access!');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});
	it('Should not show pos request detail', function (done) {
		Request(Baseurl)
			.get('/pos/request/detail/fd6675e0-e390-40a9-8047-8a36a0fafsdew')
			.set(commonHeader)
			.expect(200)
			.then((responce) => {
				Expect(responce?.body?.data?.message).to.be.eql('Not a valid pos request id');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});
});
