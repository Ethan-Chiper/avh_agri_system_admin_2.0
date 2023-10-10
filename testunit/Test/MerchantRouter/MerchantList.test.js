const Request = require('supertest');
const Expect = require('chai').expect;
const dotenv = require('dotenv');
dotenv.config();

const BaseUrl = 'http://localhost:1507/api/store-admin';

let commonHeader = {
	['x-consumer-username']: 'admin_BWpaitTqT5'
};

describe('Merchant List', function () {
	it('1. Should show all merchants list', function (done) {
		Request(BaseUrl)
			.get('/merchant/list')
			.set(commonHeader)
			.expect(200)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Merchants list are');
				Expect(response?.body?.data).to.include.keys('merchants', 'total');
				Expect(response?.body?.data?.merchants[0]).to.contains.keys(
					'merchant_id',
					'role',
					'name',
					'phone',
					'location'
				);
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('2. Should not list any merchants as the common header is not set', function (done) {
		Request(BaseUrl)
			.get('/merchant/list')
			.expect(401)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Unauthorized Access!');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('3. Should not list any merchants as the person is not logged in user', function (done) {
		Request(BaseUrl)
			.get('/merchant/list')
			.set({['x-consumer-username']: 'merchant_BWpaitTqT5'})
			.expect(401)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Not a valid user');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('4. Should not list any merchants as the admin id is unauthorized', function (done) {
		Request(BaseUrl)
			.get('/merchant/list')
			.set({['x-consumer-username']: 'admin_123redd'})
			.expect(401)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Not a valid user!');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('5. Should list only 2 merchants as the limit is only 2.', function (done) {
		Request(BaseUrl)
			.get('/merchant/list?limit=2')
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

	it('6. Should list the merchant if the merchant id given in the query.', function (done) {
		Request(BaseUrl)
			.get('/merchant/list?merchant_id=gSyr95bsg3')
			.set(commonHeader)
			.expect(200)
			.then((response) => {
				Expect(response?.body?.data?.merchants[0].merchant_id).to.be.eql('gSyr95bsg3');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('7. Should not list merchants as the limit is not a number.', function (done) {
		Request(BaseUrl)
			.get('/merchant/list?limit=asd12')
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

	it('8. Should not list merchants as the page is not a number.', function (done) {
		Request(BaseUrl)
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

	it('9. Should not list merchants as the from_time is not a date.', function (done) {
		Request(BaseUrl)
			.get('/merchant/list?from_time=asd12')
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

	it('10. Should not list merchants as the to_time is not a date.', function (done) {
		Request(BaseUrl)
			.get('/merchant/list?to_time=asd12')
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

	it('11. Should list the merchant if the merchant name given in the query.', function (done) {
		Request(BaseUrl)
			.get('/merchant/list?merchant_name=YMT')
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

	it('12. Should list the merchant if the phone number given in the query.', function (done) {
		Request(BaseUrl)
			.get('/merchant/list?phone=9955663459')
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

	it('13. Should list the merchants based on the business type given in the query.', function (done) {
		Request(BaseUrl)
			.get('/merchant/list?business_type=trade')
			.set(commonHeader)
			.expect(200)
			.then((response) => {
				let merchants = response?.body?.data?.merchants;
				for (let merchant of merchants) {
					Expect(merchant.business_type).to.be.eql('trade');
				}
				done();
			})
			.catch((error) => {
				done(error);
			});
	});
});
