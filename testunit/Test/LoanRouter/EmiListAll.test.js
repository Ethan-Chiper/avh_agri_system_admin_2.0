const Request = require('supertest');
const Expect = require('chai').expect;
const dotenv = require('dotenv');
dotenv.config();

const BaseUrl = 'http://localhost:1507/api/store-admin';

let commonHeader = {
	['x-consumer-username']: 'admin_zoHP@GkUR'
};

describe('Emi List All', function () {
	it('1. Should show emi list with common headers set', function (done) {
		Request(BaseUrl)
			.get('/loan/emi/list-all')
			.set(commonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Emi detail');
				Expect(response?.body?.data).to.an('array');
				Expect(response?.body?.data[0]).to.include.keys(
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
					'created_by'
				);
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('2. Should not show emi list with common headers are not set', function (done) {
		Request(BaseUrl)
			.get('/loan/emi/list-all')
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Unauthorized Access!');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});
});
