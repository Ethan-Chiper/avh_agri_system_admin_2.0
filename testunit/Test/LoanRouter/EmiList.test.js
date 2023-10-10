const Request = require('supertest');
const Expect = require('chai').expect;
const dotenv = require('dotenv');
dotenv.config();

const BaseUrl = 'http://localhost:1507/api/store-admin';

let commonHeader = {
	['x-consumer-username']: 'admin_zoHP@GkUR'
};

describe('Emi List', function () {
	it('1. Should show emi list with common headers set and merchant_id and loan_id is given', function (done) {
		Request(BaseUrl)
			.get('/loan/emi/list/Xr6jPBmM0/71OcngJk$')
			.set(commonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('emi list');
				Expect(response?.body?.data).to.include.keys('emilist', 'emiStats');
				Expect(response?.body?.data?.emilist[0]).to.include.keys(
					'emi_id',
					'merchant_id',
					'loan_id',
					'financial_institute_id',
					'tenure_number',
					'tenure_count',
					'payment_due_date',
					'payment_due_amount',
					'emi_last_date',
					'paid_status',
					'payment_mode',
					'collection_mode',
					'created_by'
				);
				Expect(response?.body?.data?.emilist[0]?.merchant_id).to.be.eql('Xr6jPBmM0');
				Expect(response?.body?.data?.emilist[0]?.loan_id).to.be.eql('71OcngJk$');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('2. Should not show emi list with common headers are not set', function (done) {
		Request(BaseUrl)
			.get('/loan/emi/list/Xr6jPBmM0/71OcngJk$')
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Unauthorized Access!');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('3. Should not show emi list if merchant id is not valid', function (done) {
		Request(BaseUrl)
			.get('/loan/emi/list/invalidID/71OcngJk$')
			.set(commonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Emi data not found');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('4. Should not show emi list if loan id is not valid', function (done) {
		Request(BaseUrl)
			.get('/loan/emi/list/Xr6jPBmM0/invalidID')
			.set(commonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Emi data not found');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('5. Should not show emi list if both loan_id and merchant_id is not valid', function (done) {
		Request(BaseUrl)
			.get('/loan/emi/list/invalidID/invalidID')
			.set(commonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Emi data not found');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});
});
