const Request = require('supertest');
const Expect = require('chai').expect;
const dotenv = require('dotenv');
dotenv.config();

const BaseUrl = 'http://localhost:1507/api/store-admin';

let commonHeader = {
	['x-consumer-username']: 'admin_BWpaitTqT5'
};

describe('Store List', function () {
	it('1. Should show all store list', function (done) {
		Request(BaseUrl)
			.get('/store/list')
			.set(commonHeader)
			.expect(200)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Stores list are');
				Expect(response?.body?.data).to.include.keys('stores', 'total');
				Expect(response?.body?.data?.stores[0]).to.contains.keys('merchant_id', 'name', 'email', 'store_id');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('2. Should show all store list only with name and Id for drop down.', function (done) {
		Request(BaseUrl)
			.get('/store/list/gSyr95bsg3?request_for=drop_down')
			.set(commonHeader)
			.expect(200)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Stores list are');
				Expect(response?.body?.data?.stores[0]).to.contains.keys('store_id', 'name');
				Expect(response?.body?.data?.stores[0]).to.not.contains.keys('merchant', 'store', 'email');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('3. Should not list any stores as the common header is not set for overall list', function (done) {
		Request(BaseUrl)
			.get('/store/list')
			.expect(200)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Unauthorized Access!');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('4. Should not list any stores as the person is not logged in user for overall list', function (done) {
		Request(BaseUrl)
			.get('/store/list')
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

	it('5. Should not list any stores as the admin id is unauthorized for overall list', function (done) {
		Request(BaseUrl)
			.get('/store/list')
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

	it('6. Should not list any stores as the common header is not set for drop down list.', function (done) {
		Request(BaseUrl)
			.get('/store/list/voZmSx3vC?request_for=drop_down')
			.expect(200)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Unauthorized Access!');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('7. Should not list any stores as the person is not logged in user for drop down list.', function (done) {
		Request(BaseUrl)
			.get('/store/list/voZmSx3vC?request_for=drop_down')
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

	it('8. Should not list any stores as the admin id is unauthorized for drop down list.', function (done) {
		Request(BaseUrl)
			.get('/store/list/voZmSx3vC?request_for=drop_down')
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

	it('9. Should not list any stores as the merchant does not exists', function (done) {
		Request(BaseUrl)
			.get('/store/list/wrong123id?request_for=drop_down')
			.set(commonHeader)
			.expect(200)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Merchant Not Found!');
				Expect(response?.body?.code).to.be.eql(400);
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('10. Should list only 2 stores as the limit is only 2.', function (done) {
		Request(BaseUrl)
			.get('/store/list?limit=2')
			.set(commonHeader)
			.expect(200)
			.then((response) => {
				Expect(response?.body?.data?.total).to.be.eql(2);
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('11. Should list all stores of the merchant given.', function (done) {
		Request(BaseUrl)
			.get('/store/list/gSyr95bsg3/')
			.set(commonHeader)
			.expect(200)
			.then((response) => {
				Expect(response?.body?.data?.total).to.be.eql(2);
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('12. Should list all stores of the merchant id given in the query.', function (done) {
		Request(BaseUrl)
			.get('/store/list?merchant_id=gSyr95bsg3')
			.set(commonHeader)
			.expect(200)
			.then((response) => {
				Expect(response?.body?.data?.total).to.be.eql(2);
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('13. Should list the store of the  given store ID in the search bar.', function (done) {
		Request(BaseUrl)
			.get('/store/list?store_id=gSyr95bsg3')
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

	it('14. Should not list stores as the limit is not a number.', function (done) {
		Request(BaseUrl)
			.get('/store/list?limit=asd12')
			.set(commonHeader)
			.expect(200)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Limit must be a number');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('15. Should not list stores as the page is not a number.', function (done) {
		Request(BaseUrl)
			.get('/store/list?page=asd12')
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

	it('16. Should not list stores as the from_time is not a date.', function (done) {
		Request(BaseUrl)
			.get('/store/list?from_time=asd12')
			.set(commonHeader)
			.expect(200)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Must be a date');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('17. Should not list stores as the to_time is not a date.', function (done) {
		Request(BaseUrl)
			.get('/store/list?to_time=asd12')
			.set(commonHeader)
			.expect(200)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Must be a date');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('18. Should not list stores as the request_for value is not drop_down.', function (done) {
		Request(BaseUrl)
			.get('/store/list?request_for=not_drop_down')
			.set(commonHeader)
			.expect(200)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Request-for must have value drop_down only');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});
});
