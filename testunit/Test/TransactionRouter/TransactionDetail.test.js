const Request = require('supertest');
const Expect = require('chai').expect;
const dotenv = require('dotenv');
dotenv.config();

const Baseurl = 'http://localhost:1507/api/store-admin';

describe('Transaction detail', function () {
	it('1.Should show Transaction detail', function (done) {
		Request(Baseurl)
			.get('/transaction/detail/JS9zGRFwd/1552540417533')
			.expect(200)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Transaction detail');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('2.Should not show Transaction detail.incorrect merchant id', function (done) {
		Request(Baseurl)
			.get('/transaction/detail/JS9d/1552540417533')
			.expect(200)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('JS9d');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('3.Should not show Transaction detail.incorrect transaction id', function (done) {
		Request(Baseurl)
			.get('/transaction/detail/JS9zGRFwd/153')
			.expect(200)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('153');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('4.Should not show Transaction detail.Is not empty transaction_id and merchant_id', function (done) {
		Request(Baseurl)
			.get('/transaction/detail/')
			.expect(200)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('incorrect url.');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});
});
