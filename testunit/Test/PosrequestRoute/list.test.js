const Request = require('supertest');
const Expect = require('chai').expect;
const dotenv = require('dotenv');
dotenv.config();

const Baseurl = 'http://localhost:1507/api/store-admin';

const commonHeader = {
	['x-consumer-username']: 'admin_zoHP@GkUR'
};

describe('Posrequest list', function () {
	it('Should show all pos_request list', function (done) {
		Request(Baseurl)
			.get('/pos/request/list')
			.set(commonHeader)
			.expect(200)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Pos request list');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});
	it('Should not list any pos_request as the common header is not admin id', function (done) {
		const invalidAdmin = {
			['x-consumer-username']: 'admin_zoHP@kjhr'
		};
		Request(Baseurl)
			.get('/pos/request/list')
			.expect(200)
			.set(invalidAdmin)
			.then((response) => {
				Expect(response.body.message).to.be.eql('Unauthorized Access!');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});
	it('Should not list any pos request as the common header is not set', function (done) {
		Request(Baseurl)
			.get('/pos/request/list')
			.expect(200)
			.then((response) => {
				Expect(response.body.message).to.be.eql('Unauthorized Access!');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});
	it('Should list only 5 posrequest as the limit is only 5.', function (done) {
		Request(Baseurl)
			.get('/pos/request/list?limit=5')
			.set(commonHeader)
			.expect(200)
			.then((response) => {
				Expect(response?.body?.data?.total).to.be.eql(5);
				done();
			})
			.catch((error) => {
				done(error);
			});
	});
	it('Should list the posrequest if the transaction_id given in the query.', function (done) {
		Request(Baseurl)
			.get('/pod/request/list?transaction_id=3900949')
			.set(commonHeader)
			.expect(200)
			.then((response) => {
				Expect(response?.body?.data[0]?.transaction_no).to.be.eql('3900949');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});
	it('Should list the posrequest as the page is', function (done) {
		Request(Baseurl)
			.get('/pos/request/list?page=2')
			.set(commonHeader)
			.expect(200)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Pos request list');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});
	it('Should not list posrequest as the from_date is not a date.', function (done) {
		Request(Baseurl)
			.get('/pos/request/list?from_date=asd12')
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
	it('Should not list posrequest as the end_date is not a date.', function (done) {
		Request(Baseurl)
			.get('/pos/request/list?end_date=asd12')
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
	it('Should list the posrequest if the merchant id given in the query.', function (done) {
		Request(Baseurl)
			.get('/pos/request/list?merchant_id=EVWNCyxsq')
			.set(commonHeader)
			.expect(200)
			.then((response) => {
				Expect(response?.body?.data[0].merchants.id).to.be.eql('EVWNCyxsq');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});
	it('Should list the payment_status if the payment_status given in the query.', function (done) {
		Request(Baseurl)
			.get('/pos/request/list?payment_status=processing')
			.set(commonHeader)
			.expect(200)
			.then((response) => {
				Expect(response?.body?.data?.payment_status).to.be.eql('processing');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});
	it('Should list the pos_status if the pos_status given in the query.', function (done) {
		Request(Baseurl)
			.get('/pos/request/list?pos_status=pending')
			.set(commonHeader)
			.expect(200)
			.then((response) => {
				Expect(response?.body?.data[0]?.pos_status).to.be.eql('pending');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});
});
