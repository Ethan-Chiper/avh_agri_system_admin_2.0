const Request = require('supertest');
const Expect = require('chai').expect;
const dotenv = require('dotenv');
dotenv.config();

const Baseurl = 'http://localhost:1507/api/store-admin';

const CommonHeader = {
	['x-consumer-username']: 'admin_zoHP@GkUR'
};

describe('Product detail', function () {
	it('Should show product detail', function (done) {
		Request(Baseurl)
			.get('/pos/product/detail/Xy@@GJQ5u')
			.set(CommonHeader)
			.expect(200)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Product details are');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});
	it('Should not show product detail', function (done) {
		Request(Baseurl)
			.get('/pos/product/detail/u5@@GJkji')
			.set(CommonHeader)
			.expect(200)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Not a valid user');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});
	it('Should not show product details as the common header is not set.', function (done) {
		let invalidAdmin = {
			['x-consumer-username']: 'admin_e43P@Gmjr'
		};
		Request(Baseurl)
			.get('/pos/product/detail/Xy@@GJQ5u')
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
	it('Should not view any product as the common header is not set', function (done) {
		Request(Baseurl)
			.post('/pos/product/detail/Xy@@GJQ5u')
			.expect(200)
			.then((response) => {
				Expect(response.body.message).to.be.eql('Unauthorized Access!');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});
});
