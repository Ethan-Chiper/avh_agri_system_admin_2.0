const Request = require('supertest');
const Expect = require('chai').expect;
const dotenv = require('dotenv');
dotenv.config();

const Baseurl = 'http://localhost:1507/api/store-admin';

const commonHeader = {
	['x-consumer-username']: 'admin_zoHP@GkUR'
};

describe('Category List', function () {
	it('Should show all category list', function (done) {
		Request(Baseurl)
			.get('/pos/category/list')
			.set(commonHeader)
			.expect(200)
			.then((response) => {
				Expect(response.body.message).to.be.eql('Category lists');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});
	it('Should not list any category as the common header is not set', function (done) {
		Request(Baseurl)
			.get('/pos/category/list')
			.expect(200)
			.then((response) => {
				Expect(response.body.message).to.be.eql('Unauthorized Access!');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});
	it('Should not list any category as the admin id is unauthorized', function (done) {
		Request(Baseurl)
			.get('/pos/category/list')
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
	it('Should list only 5 category as the limit is only 5.', function (done) {
		Request(Baseurl)
			.get('/pos/category/list?limit=5')
			.set(commonHeader)
			.expect(200)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql(5);
				done();
			})
			.catch((error) => {
				done(error);
			});
	});
	it('Should list the category if the category id given in the query.', function (done) {
		Request(Baseurl)
			.get('/pos/category/list?category_id=5BZew8Fg5')
			.set(commonHeader)
			.expect(200)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('5BZew8Fg5');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});
	it('Should not list category as the page is not a number.', function (done) {
		Request(Baseurl)
			.get('/merchant/list?page=asd12')
			.set(commonHeader)
			.expect(200)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Page must be a number');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});
	it('Should list the category if the category name given in the query.', function (done) {
		Request(Baseurl)
			.get('/merchant/list?name=books')
			.set(commonHeader)
			.expect(200)
			.then((response) => {
				Expect(response?.body?.data?.total).to.be.eql(1);
				done();
			})
			.catch((error) => {
				done(error);
			});
	});
});
