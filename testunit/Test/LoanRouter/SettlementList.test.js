const Request = require('supertest');
const Expect = require('chai').expect;
const dotenv = require('dotenv');
const Moment = require('moment');
dotenv.config();

const BaseUrl = 'http://localhost:1507/api/store-admin';

let commonHeader = {
	['x-consumer-username']: 'admin_zoHP@GkUR'
};

describe('Settlement List', function () {
	it('1. Should show all settlement list when user is admin', function (done) {
		Request(BaseUrl)
			.get('/loan/upi-mandate/settlement/list')
			.set(commonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('settlement list');
				Expect(response?.body).to.include.keys('data');
				Expect(response?.body?.data).to.an('array');
				Expect(response?.body?.data[0]?.settlement_id).not.to.be.eql('');
				Expect(response?.body?.data[0]).to.contains.keys(
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
				Expect(response?.body?.data[0]?.mandate_details).to.contains.keys(
					'customer_ref_no',
					'bank_ref_no',
					'payer_virtual_address',
					'umn'
				);
				Expect(response?.body?.data[0]?.bank_info).to.contains.keys(
					'bank_name',
					'payer_acc_no',
					'payer_acc_name',
					'payer_ifsc_code'
				);
				Expect(response?.body?.data[0]?.payer_info).to.contains.keys(
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

	it('2. Should not list Settlement, as the common header is not set', function (done) {
		Request(BaseUrl)
			.get('/loan/upi-mandate/settlement/list')
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Unauthorized Access!');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('3. Should not list Settlement, as the person is not logged in user', function (done) {
		Request(BaseUrl)
			.get('/loan/upi-mandate/settlement/list')
			.set({['x-consumer-username']: 'merchant_zoHP@GkUR'})
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Not a valid user');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('4. Should not list Settlement, as the admin id is unauthorized', function (done) {
		Request(BaseUrl)
			.get('/loan/upi-mandate/settlement/list')
			.set({['x-consumer-username']: 'admin_456invalid'})
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Not a valid user!');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('5. Should show list settlement if the loan_id given', function (done) {
		Request(BaseUrl)
			.get('/loan/upi-mandate/settlement/list?loan_id=28m5HFumT')
			.set(commonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('settlement list');
				Expect(response?.body).to.include.keys('data');
				Expect(response?.body?.data).to.an('array');
				Expect(response?.body?.data[0]?.settlement_id).not.to.be.eql('');
				Expect(response?.body?.data[0].loan_id).to.be.eql('28m5HFumT');
				Expect(response?.body?.data[0]).to.contains.keys(
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
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('6. Should show list settlement if the emi_id given', function (done) {
		Request(BaseUrl)
			.get('/loan/upi-mandate/settlement/list?emi_id=CHvxFVARDya')
			.set(commonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('settlement list');
				Expect(response?.body).to.include.keys('data');
				Expect(response?.body?.data).to.an('array');
				Expect(response?.body?.data[0]?.settlement_id).not.to.be.eql('');
				Expect(response?.body?.data[0].emi_id).to.be.eql('CHvxFVARDya');
				Expect(response?.body?.data[0]).to.contains.keys(
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
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('7. Should show list settlement if the settlement_id given', function (done) {
		Request(BaseUrl)
			.get('/loan/upi-mandate/settlement/list?settlement_id=EFyJmFf')
			.set(commonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('settlement list');
				Expect(response?.body).to.include.keys('data');
				Expect(response?.body?.data).to.an('array');
				Expect(response?.body?.data[0]?.settlement_id).to.be.eql('EFyJmFf');
				Expect(response?.body?.data[0]).to.contains.keys(
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
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('8. Should show list settlement if enach_transaction_id is given', function (done) {
		Request(BaseUrl)
			.get('/loan/upi-mandate/settlement/list?enach_transaction_id=28m5HFdumT')
			.set(commonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('settlement list');
				Expect(response?.body).to.include.keys('data');
				Expect(response?.body?.data).to.an('array');
				Expect(response?.body?.data[0]?.enach_transaction_id).to.be.eql('28m5HFdumT');
				Expect(response?.body?.data[0]).to.contains.keys(
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
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('9. Should show empty list settlement if enach_transaction_id is not valid', function (done) {
		Request(BaseUrl)
			.get('/loan/upi-mandate/settlement/list?enach_transaction_id=UXQXWOgfg3fS')
			.set(commonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('settlement list');
				Expect(response?.body).to.include.keys('data');
				Expect(response?.body?.data).to.an('array').to.be.empty;
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('10. Should show list settlement if user_onboar_id is given', function (done) {
		Request(BaseUrl)
			.get('/loan/upi-mandate/settlement/list?user_onboar_id=28m5HFumTsa')
			.set(commonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('settlement list');
				Expect(response?.body).to.include.keys('data');
				Expect(response?.body?.data).to.an('array');
				Expect(response?.body?.data[0]?.user_onboar_id).to.be.eql('28m5HFumTsa');
				Expect(response?.body?.data[0]).to.contains.keys(
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
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('11. Should show empty list settlement if user_onboar_id is not valid', function (done) {
		Request(BaseUrl)
			.get('/loan/upi-mandate/settlement/list?user_onboar_id=UXQXWOgfg3fS')
			.set(commonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('settlement list');
				Expect(response?.body).to.include.keys('data');
				Expect(response?.body?.data).to.an('array').to.be.empty;
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('12. Should show list settlement if settlement_date_option is from [today, yesterday, weekly, monthly, yearly]', function (done) {
		Request(BaseUrl)
			.get('/loan/upi-mandate/settlement/list?settlement_date_option=yearly')
			.set(commonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('settlement list');
				Expect(response?.body?.data).to.an('array');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('13. Should not show list settlement if settlement_date_option is not from [today, yesterday, weekly, monthly, yearly]', function (done) {
		Request(BaseUrl)
			.get('/loan/upi-mandate/settlement/list?settlement_date_option=sdjad')
			.set(commonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('settlement list');
				Expect(response?.body?.data).to.an('array').to.be.empty;
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('14. Should show list settlement if transaction_date_option is from [today, yesterday, weekly, monthly, yearly]', function (done) {
		Request(BaseUrl)
			.get('/loan/upi-mandate/settlement/list?transaction_date_option=yearly')
			.set(commonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('settlement list');
				Expect(response?.body?.data).to.an('array');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('15. Should not show list settlement if transaction_date_option is not from [today, yesterday, weekly, monthly, yearly]', function (done) {
		Request(BaseUrl)
			.get('/loan/upi-mandate/settlement/list?transaction_date_option=sdjad')
			.set(commonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('settlement list');
				Expect(response?.body?.data).to.an('array').to.be.empty;
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('16. Should show list settlement if settlement_from_date and settlement_to_date are given', function (done) {
		Request(BaseUrl)
			.get('/loan/upi-mandate/settlement/list?settlement_from_date=2023-06-18&settlement_to_date=2023-06-19')
			.set(commonHeader)
			.then((response) => {
				let checkSettlementDate =
					Moment(response?.body?.data[0]?.settlement_date, 'YYYY-MM-DD') >= Moment('2023-06-18')
						? 'true'
						: 'false';
				Expect(response?.body?.message).to.be.eql('settlement list');
				Expect(checkSettlementDate).to.be.eql('true');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('17. Should show list settlement if transaction_from_date and transaction_to_date are given', function (done) {
		Request(BaseUrl)
			.get('/loan/upi-mandate/settlement/list?transaction_from_date=2023-06-18&transaction_to_date=2023-06-19')
			.set(commonHeader)
			.then((response) => {
				let checkTransactionDate =
					Moment(response?.body?.data[0]?.transaction_date, 'YYYY-MM-DD') >= Moment('2023-06-18')
						? 'true'
						: 'false';
				Expect(response?.body?.message).to.be.eql('settlement list');
				Expect(checkTransactionDate).to.be.eql('true');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('18. Should list only 5 loan details as the limit is only 5', function (done) {
		Request(BaseUrl)
			.get('/loan/upi-mandate/settlement/list?limit=5')
			.set(commonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('settlement list');
				Expect(response?.body?.data).to.have.lengthOf(5);
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('19. Should show all list loan details if limit is not a number.', function (done) {
		Request(BaseUrl)
			.get('/loan/upi-mandate/settlement/list?limit=five5')
			.set(commonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('settlement list');
				Expect(response?.body?.data[0]).to.contains.keys(
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
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('20. Should list only 3 list if limit is 3 and page is given', function (done) {
		Request(BaseUrl)
			.get('/loan/upi-mandate/settlement/list?page=3&limit=3')
			.set(commonHeader)
			.then((response) => {
				Expect(response?.body?.data).to.have.lengthOf(3);
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('21. Should not show list settlement if settlement_from_date or settlement_to_date are not in format of YYYY-MM-DD', function (done) {
		Request(BaseUrl)
			.get('/loan/upi-mandate/settlement/list?settlement_from_date=2023-66-108&settlement_to_date=2023-8-119')
			.set(commonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Something Went wrong');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('22. Should not show list settlement if transaction_from_date or transaction_to_date are not in format of YYYY-MM-DD', function (done) {
		Request(BaseUrl)
			.get('/loan/upi-mandate/settlement/list?transaction_from_date=2023-66-108&transaction_to_date=2023-8-119')
			.set(commonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Something Went wrong');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});
});
