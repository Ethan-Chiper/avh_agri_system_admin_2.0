const Request = require('supertest');
const Expect = require('chai').expect;
const dotenv = require('dotenv');
dotenv.config();

const Baseurl = 'http://localhost:1507/api/store-admin';

let commonHeader = {
	['x-consumer-username']: 'admin_sQPrvf8T9g'
};

describe('Transaction List', function () {
	it('1.Should show all Transaction list', function (done) {
		Request(Baseurl)
			.get('/transaction/list')
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

	it('2.Should not list any transaction as the common header is not admin id', function (done) {
		const invalidAdmin = {
			['x-consumer-username']: 'admin_zoHPhr'
		};
		Request(Baseurl)
			.get('/transaction/list')
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

	it('3.Should not list any transaction as the common header is not set', function (done) {
		Request(Baseurl)
			.get('/transactin/list')
			.expect(200)
			.then((response) => {
				Expect(response.body.message).to.be.eql('Unauthorized Access!');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('4.Should list only 10 transaction as the limit is only 10.', function (done) {
		Request(Baseurl)
			.get('/transactin/list?limit=10')
			.expect(200)
			.then((response) => {
				Expect(response.body.message).to.be.eql(10);
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('5.Should list the transaction as the page is', function (done) {
		Request(Baseurl)
			.get('/transactin/list?page=2')
			.set(commonHeader)
			.expect(200)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Transaction list');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('6.Should list the transaction if the transaction_id given in the query.', function (done) {
		Request(Baseurl)
			.get('transaction/list?trans_id=8329781')
			.expect(200)
			.then((response) => {
				Expect(response.body.message).to.be.eql('8329781');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('7.Should list the transaction if the merchant_id given in the query.', function (done) {
		Request(Baseurl)
			.get('transaction/list?merchant_id=ePPaqTkBS')
			.expect(200)
			.then((response) => {
				Expect(response.body.message).to.be.eql('ePPaqTkBS');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('8.Should list the transaction if the store_id given in the query.', function (done) {
		Request(Baseurl)
			.get('transaction/list?store_id=ePPaqTkBS')
			.expect(200)
			.then((response) => {
				Expect(response.body.message).to.be.eql('ePPaqTkBS');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('9.Should list the transaction if the merchant name given in the query.', function (done) {
		Request(Baseurl)
			.get('transaction/list?merchant_name=Mohan K')
			.expect(200)
			.then((response) => {
				Expect(response.body.message).to.be.eql('Mohan K');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('10.Should list the transaction if the payment mode given in the query.', function (done) {
		Request(Baseurl)
			.get('transaction/list?mode=upi')
			.expect(200)
			.then((response) => {
				Expect(response.body.message).to.be.eql('upi');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('11.Should not list transaction as the from_time is not a date.To insert from_time and to_time', function (done) {
		Request(Baseurl)
			.get('/transaction/list?from_time=asd12')
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

	it('12.Should not list transaction as the to_time is not a date.To insert from_time and to_time', function (done) {
		Request(Baseurl)
			.get('/transaction/list?to_time=asd12')
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

	it('13.Should list the transaction as the from_time and to_time given in the query.', function (done) {
		Request(Baseurl)
			.get('/transaction/list?from_time=2023-06-07&to_time=2023-06-08')
			.set(commonHeader)
			.expect(200)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Transaction list');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('14.Should list the transaction as the date_option given in the query.', function (done) {
		Request(Baseurl)
			.get('/transaction/list?date_option=monthly')
			.set(commonHeader)
			.expect(200)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('monthly');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('15.Should list the transaction as the status given in the query.', function (done) {
		Request(Baseurl)
			.get('/transaction/list?status=success')
			.set(commonHeader)
			.expect(200)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('success');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('16.Should list the transaction as the partner id given in the query.', function (done) {
		Request(Baseurl)
			.get('/transaction/list?partner_id=Ikpsjnbhv')
			.set(commonHeader)
			.expect(200)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Ikpsjnbhv');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('17.Should list the transaction as the partner name given in the query.', function (done) {
		Request(Baseurl)
			.get('/transaction/list?partner_name=Ippopay')
			.set(commonHeader)
			.expect(200)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Ippopay');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('18.Should list the transaction as the utr_number given in the query.', function (done) {
		Request(Baseurl)
			.get('/transaction/list?utr_number=315858906388')
			.set(commonHeader)
			.expect(200)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('315858906388');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});
});
