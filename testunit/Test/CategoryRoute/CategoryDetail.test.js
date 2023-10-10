const Request = require('supertest');
const Expect = require('chai').expect;
const dotenv = require('dotenv');
dotenv.config();

const Baseurl = 'http://localhost:1507/api/store-admin';

const commonHeader = {
	['x-consumer-username']: 'admin_zoHP@GkUR'
};

describe('Category detail', function () {
	it('should show category detail', function (done) {
		Request(Baseurl)
			.get('/pos/category/detail/jaXA2iBSO')
			.set(commonHeader)
			.expect(200)
			.then((responce) => {
				Expect(responce?.body?.message).to.be.eql('Category details are');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});
	it('Should not show category detail', function (done) {
		Request(Baseurl)
			.get('/pos/category/detail/lnQr95bses')
			.set(commonHeader)
			.expect(200)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Not a valid id');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});
	it('Should not show category details as the common header is not set.', function (done) {
		Request(Baseurl)
			.get('/pos/category/detail/lnQr95bses')
			.expect(200)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Unauthorized Access!');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});
	it('Should not view category detail', function (done) {
		let invalidAdmin = {
			['x-consumer-username']: 'notAdmin_678'
		};
		Request(Baseurl)
			.post('/pos/category/detail/jaXA2iBSO')
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
});
