const Request = require('supertest');
const Expect = require('chai').expect;
const dotenv = require('dotenv');
dotenv.config();

const BaseUrl = 'http://localhost:1507/api/store-admin';

let commonHeader = {
	['x-consumer-username']: 'admin_zoHP@GkUR'
};

describe('Settlement Detail', function () {
	it('1. Should show settlement detail with valid settlement ID', function (done) {
		Request(BaseUrl)
			.get('/loan/upi-mandate/settlement/detail/TuX9e5e')
			.set(commonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('settlement details');
				Expect(response?.body).to.include.keys('data');
				Expect(response?.body?.data?.settlement_id).to.be.eql('TuX9e5e');
				Expect(response?.body?.data).to.contains.keys(
					'settlement_id',
					'settlement_date',
					'loan_id',
					'enach_transaction_id',
					'user_onboar_id',
					'emi_id',
					'dba_name',
					'customer_id',
					'trans_ref_no',
					'cp_ref_no',
					'payment_type',
					'status',
					'transaction_amount',
					'transaction_date',
					'settlement_status',
					'payout_status',
					'mandate_details',
					'bank_info',
					'payer_info'
				);
				Expect(response?.body?.data?.mandate_details).to.contains.keys(
					'customer_ref_no',
					'bank_ref_no',
					'payer_virtual_address',
					'umn'
				);
				Expect(response?.body?.data?.bank_info).to.contains.keys(
					'bank_name',
					'payer_acc_no',
					'payer_acc_name',
					'payer_ifsc_code'
				);
				Expect(response?.body?.data?.payer_info).to.contains.keys(
					'payee_vpa',
					'reg_acc_n',
					'payout_ref_no',
					'device_type'
				);
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('2. Should not show Settlement details as the common headers is not set.', function (done) {
		Request(BaseUrl)
			.get('/loan/upi-mandate/settlement/detail/TuX9e5e')
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Unauthorized Access!');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('3. Should not show Settlement details as the person is not logged in user', function (done) {
		Request(BaseUrl)
			.get('/loan/upi-mandate/settlement/detail/TuX9e5e')
			.set({['x-consumer-username']: 'merchant_zoHP@GkUR'})
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Not a valid user');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('4. Should not show Settlement details as the admin id is unauthorized', function (done) {
		Request(BaseUrl)
			.get('/loan/upi-mandate/settlement/detail/TuX9e5e')
			.set({['x-consumer-username']: 'admin_1223radsa'})
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Not a valid user!');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('5. Should show empty Settlement details as the Settlement id is not valid', function (done) {
		Request(BaseUrl)
			.get('/loan/upi-mandate/settlement/detail/invalidID999')
			.set(commonHeader)
			.then((response) => {
				Expect(response?.body?.data).to.an('object').to.be.empty;
				done();
			})
			.catch((error) => {
				done(error);
			});
	});
});
