const Request = require('supertest');
const Expect = require('chai').expect;
const dotenv = require('dotenv');
dotenv.config();

const Baseurl = 'http://localhost:1507/api/store-admin';

const commonHeader = {
	['x-consumer-username']: 'admin_zoHP@GkUR'
};

describe('Posrequest status update', function () {
	it('should update status', function (done) {
		Request(Baseurl)
			.patch('/pos/request/pos-status/change/fd6675e0-e390-40a9-8047-8a36a0faf2c0')
			.set(commonHeader)
			.expect(200)
			.then((responce) => {
				Expect(responce?.body?.message).to.be.eql('Pos Order Process Successfully');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});
	it('Should not update as pos request status is not admin id', function (done) {
		let invalidAdmin = {
			['x-consumer-username']: 'notAdmin_678'
		};
		Request(Baseurl)
			.patch('/pos/request/pos-status/change/fd6675e0-e390-40a9-8047-8a36a0faf2c0')
			.set(invalidAdmin)
			.then((responce) => {
				Expect(responce?.body?.message).to.be.eql('Unauthorized Access!');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});
	it('Should not change any status pos request as the common header is not set', function (done) {
		Request(Baseurl)
			.patch('/pos/request/pos-status/change/fd6675e0-e390-40a9-8047-8a36a0faf2c0')
			.expect(200)
			.then((response) => {
				Expect(response.body.message).to.be.eql('Unauthorized Access!');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});
	it('Should not update as pos request status is not category id', function (done) {
		Request(Baseurl)
			.patch('/pos/request/pos-status/change/e4Zse')
			.set(commonHeader)
			.then((responce) => {
				Expect(responce?.body?.message).to.be.eql('Not a valid user!');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});
});
