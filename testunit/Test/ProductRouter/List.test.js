const Request = require('supertest');
const Expect = require('chai').expect;
const dotenv = require('dotenv');
dotenv.config();

const Baseurl = 'http://localhost:1507/api/store-admin';

const CommonHeader = {
	['x-consumer-username']: 'admin_zoHP@GkUR'
};

describe('Product list', function () {
	it('Should show product list', function (done) {
		Request(Baseurl)
			.get('pos/product/list')
			.set(CommonHeader)
			.expect(200)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Product lists');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});
	it('Should not list any product as the common header is not set', function (done) {
		Request(Baseurl)
			.get('/pos/product/list')
			.expect(200)
			.then((response) => {
				Expect(response.body.message).to.be.eql('Unauthorized Access!');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});
	it('Should not list any product as the admin id is unauthorized', function (done) {
		Request(Baseurl)
			.get('/pos/product/list')
			.set({['x-consumer-username']: 'admin_123redd'})
			.expect(200)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Unauthorized Access!');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});
	it('Should list only 2 product as the limit is only 2.', function (done) {
		Request(Baseurl)
			.get('/pos/product/list?limit=2')
			.set(CommonHeader)
			.expect(200)
			.then((response) => {
				Expect(response?.body?.data?.total).to.be.eql(2);
				done();
			})
			.catch((error) => {
				done(error);
			});
	});
	it('Should list the product as the page is', function (done) {
		Request(Baseurl)
			.get('/pos/product/list?page=2')
			.set(CommonHeader)
			.expect(200)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Pos request list');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});
	it('Should list the product as the name is', function (done) {
		Request(Baseurl)
			.get('pos/product/list?name=Linux')
			.set(CommonHeader)
			.expect(200)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Pos request list');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});
	it('Should list the product as the product_id is', function (done) {
		Request(Baseurl)
			.get('pos/product/list?product_id=G26WWgLOu')
			.set(CommonHeader)
			.expect(200)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Pos request list');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});
});
