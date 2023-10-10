const Request = require('supertest');
const Expect = require('chai').expect;
const dotenv = require('dotenv');
dotenv.config();

const Baseurl = 'http://localhost:1507/api/store-admin';

const commonHeader = {
	['x-consumer-username']: 'admin_zoHP@GkUR'
};

describe('Pos request reject reason', function () {
	it('Should show reject reson', function (done) {
		Request(Baseurl)
			.patch('/pos/request/reject/reason')
			.set(commonHeader)
			.expect(200)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Pos reject reason is updated Successfully');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});
	it('Should not update as pos request reject reason is not admin id', function (done) {
		let invalidAdmin = {
			['x-consumer-username']: 'notAdmin_678'
		};
		Request(Baseurl)
			.patch('/pos/request/reject/reason/dfgherty')
			.set(invalidAdmin)
			.then((responce) => {
				Expect(responce?.body?.message).to.be.eql('Unauthorized Access!');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});
	it('Should not update any pos request as the common header is not set', function (done) {
		Request(Baseurl)
			.patch('/pos/request/reject/reason/dfgherty')
			.expect(200)
			.then((response) => {
				Expect(response.body.message).to.be.eql('Unauthorized Access!');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});
	it('Should not update as pos request reject reason is not pos request id', function (done) {
		Request(Baseurl)
			.patch('/pos/request/reject/reason/e4Zse')
			.set(commonHeader)
			.then((responce) => {
				Expect(responce?.body?.message).to.be.eql('Unauthorized Access!');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});
});
