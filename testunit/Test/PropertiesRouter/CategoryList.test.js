const Request = require('supertest');
const Expect = require('chai').expect;
const dotenv = require('dotenv');
dotenv.config();

const BaseUrl = 'http://localhost:1507/api/store-admin';

let commonHeader = {
	['x-consumer-username']: 'admin_BWpaitTqT5'
};

describe('Category List And Sub Category List', function () {
	it('1. Should list all the categories', function (done) {
		Request(BaseUrl)
			.get('/properties/category-list')
			.set(commonHeader)
			.expect(200)
			.then((response) => {
				Expect(response?.body?.success).to.be.true;
				Expect(response?.body?.message).to.eql('Category list are');
				Expect(response?.body?.data).to.include.keys('category', 'total');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('2. Should not list categories as the common header is not set.', function (done) {
		Request(BaseUrl)
			.get('/properties/category-list')
			.expect(200)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Unauthorized Access!');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('3. Should not list categories as the person is not logged-in user', function (done) {
		Request(BaseUrl)
			.get('/properties/category-list')
			.set({['x-consumer-username']: 'merchant_BWpaitTqT5'})
			.expect(200)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Not a valid user');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('4. Should not list categories as the admin id is unauthorized', function (done) {
		Request(BaseUrl)
			.get('/properties/category-list')
			.set({['x-consumer-username']: 'admin_123redd'})
			.expect(200)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Not a valid user!');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('5. Should list all the sub categories', function (done) {
		Request(BaseUrl)
			.get('/properties/sub-category-list')
			.set(commonHeader)
			.expect(200)
			.then((response) => {
				Expect(response?.body?.success).to.be.true;
				Expect(response?.body?.message).to.eql('Category list are');
				Expect(response?.body?.data).to.include.keys('category', 'total');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('6. Should not list sub categories as the common header is not set.', function (done) {
		Request(BaseUrl)
			.get('/properties/sub-category-list')
			.expect(200)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Unauthorized Access!');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('7. Should not list sub categories as the person is not logged-in user', function (done) {
		Request(BaseUrl)
			.get('/properties/sub-category-list')
			.set({['x-consumer-username']: 'merchant_BWpaitTqT5'})
			.expect(200)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Not a valid user');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('8. Should not list sub categories as the admin id is unauthorized', function (done) {
		Request(BaseUrl)
			.get('/properties/sub-category-list')
			.set({['x-consumer-username']: 'admin_123redd'})
			.expect(200)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Not a valid user!');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});
});
