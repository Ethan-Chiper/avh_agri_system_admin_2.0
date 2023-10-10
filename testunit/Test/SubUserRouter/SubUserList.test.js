const Request = require('supertest');
const Expect = require('chai').expect;
const dotenv = require('dotenv');
dotenv.config();

const BaseUrl = 'http://localhost:1507/api/store-admin';

let commonHeader = {
	['x-consumer-username']: 'admin_BWpaitTqT5'
};

describe('Sub User List', function () {
	it('1. Should show all sub user list', function (done) {
		Request(BaseUrl)
			.get('/sub-user/list')
			.set(commonHeader)
			.expect(200)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Sub user list');
				Expect(response?.body?.data).to.include.keys('subUser', 'total');
				Expect(response?.body?.data?.subUser[0]).to.contains.keys(
					'merchant',
					'store',
					'phone',
					'name',
					'sub_user_id'
				);
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('2. Should show all sub user list only with name and Id for drop down.', function (done) {
		Request(BaseUrl)
			.get('/sub-user/list/gSyr95bsg3?request_for=drop_down')
			.set(commonHeader)
			.expect(200)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Sub user list');
				Expect(response?.body?.data?.subUser[0]).to.contains.keys('_id', 'sub_user_id', 'name');
				Expect(response?.body?.data?.subUser[0]).to.not.contains.keys('merchant', 'store', 'phone');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('3. Should not list any sub users as the common header is not set for overall list', function (done) {
		Request(BaseUrl)
			.get('/sub-user/list')
			.expect(200)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Unauthorized Access!');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('4. Should not list any sub users as the person is not logged in user for overall list', function (done) {
		Request(BaseUrl)
			.get('/sub-user/list')
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

	it('5. Should not list any sub users as the admin id is unauthorized for overall list', function (done) {
		Request(BaseUrl)
			.get('/sub-user/list')
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

	it('6. Should not list any sub users as the common header is not set for drop down list.', function (done) {
		Request(BaseUrl)
			.get('/sub-user/list/voZmSx3vC?request_for=drop_down')
			.expect(200)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Unauthorized Access!');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('7. Should not list any sub users as the person is not logged in user for drop down list.', function (done) {
		Request(BaseUrl)
			.get('/sub-user/list/voZmSx3vC?request_for=drop_down')
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

	it('8. Should not list any sub users as the admin id is unauthorized for drop down list.', function (done) {
		Request(BaseUrl)
			.get('/sub-user/list/voZmSx3vC?request_for=drop_down')
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

	it('9. Should not list any sub users as the merchant does not exists', function (done) {
		Request(BaseUrl)
			.get('/sub-user/list/wrong123id?request_for=drop_down')
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

	it('10. Should list only 2 sub users as the limit is only 2.', function (done) {
		Request(BaseUrl)
			.get('/sub-user/list?limit=2')
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

	it('11. Should list all sub users of the merchant given.', function (done) {
		Request(BaseUrl)
			.get('/sub-user/list/gSyr95bsg3/')
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

	it('12. Should list all sub users of the merchant id given in the query.', function (done) {
		Request(BaseUrl)
			.get('/sub-user/list?merchant_id=gSyr95bsg3')
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

	it('13. Should list all sub users of the store id given in the search bar.', function (done) {
		Request(BaseUrl)
			.get('/sub-user/list?store_id=gSyr95bsg3')
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

	it('14. Should list one sub user based on the mobile number provided.', function (done) {
		Request(BaseUrl)
			.get('/sub-user/list?phone=9840808709')
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

	it('15. Should not list sub users as the page is not a number.', function (done) {
		Request(BaseUrl)
			.get('/sub-user/list?page=asd12')
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

	it('16. Should not list sub users as the from_time is not a date.', function (done) {
		Request(BaseUrl)
			.get('/sub-user/list?from_time=asd12')
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

	it('17. Should not list sub users as the to_time is not a date.', function (done) {
		Request(BaseUrl)
			.get('/sub-user/list?to_time=asd12')
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

	it('18. Should not list sub users as the request_for value is not drop_down.', function (done) {
		Request(BaseUrl)
			.get('/sub-user/list?request_for=not_drop_down')
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

	it('19. Should not list sub users as the limit is not a number.', function (done) {
		Request(BaseUrl)
			.get('/sub-user/list?limit=asd12')
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

	it('20. Should not list sub users as the phone number provided in the query is not valid', function (done) {
		Request(BaseUrl)
			.get('/sub-user/list?phone=asd12')
			.set(commonHeader)
			.expect(200)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Please provide a valid Phone Number');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});
});
