const Request = require('supertest');
const Expect = require('chai').expect;
const dotenv = require('dotenv');
dotenv.config();

const BaseUrl = 'http://localhost:1507/api/store-admin';

let commonHeader = {
	['x-consumer-username']: 'admin_zoHP@GkUR'
};

describe('Emi Detail', function () {
	it('1. Should show detail with headers set and emi_id given', function (done) {
		Request(BaseUrl)
			.get('/loan/emi/detail/CHvxFVARDya')
			.set(commonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Emi detail');
				Expect(response?.body?.data).to.an('object');
				Expect(response?.body?.data).to.contains.keys(
					'emi_id',
					'merchant_id',
					'loan_id',
					'loan_outstanding_amount',
					'loan_principal',
					'loan_interest',
					'financial_institute_id',
					'tenure_number',
					'tenure_count',
					'payment_due_date',
					'payment_due_amount',
					'emi_last_date',
					'paid_status',
					'notification_status',
					'payment_mode',
					'collection_mode',
					'created_by',
					'merchant_name',
					'merchant_email',
					'merchant_mobile_no',
					'modified_by',
					'settlement'
				);
				Expect(response?.body?.data?.created_by).to.an('object');
				Expect(response?.body?.data?.modified_by).to.an('object');
				Expect(response?.body?.data?.settlement).to.an('array');
				Expect(response?.body?.data?.emi_id).to.be.eql('CHvxFVARDya');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('2. Should not show detail when headers are not set', function (done) {
		Request(BaseUrl)
			.get('/loan/emi/detail/CHvxFVARDya')
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Unauthorized Access!');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('3. Should not show detail when emi_id is invalid', function (done) {
		Request(BaseUrl)
			.get('/loan/emi/detail/invalidID')
			.set(commonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Emi detail not found');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});
});
