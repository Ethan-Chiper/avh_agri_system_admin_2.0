const Request = require('supertest');
const Expect = require('chai').expect;
const dotenv = require('dotenv');
dotenv.config();

const BaseUrl = 'http://localhost:1507/api/store-admin';

let commonHeader = {
	['x-consumer-username']: 'admin_zoHP@GkUR'
};

describe('Loan Details', function () {
	it('1. Should show loan details with merchantId and loanId', function (done) {
		Request(BaseUrl)
			.get('/loan/details/wW9R@EmbW/UXQXWO3fS')
			.set(commonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Loan detail');
				Expect(response?.body).to.include.keys('data');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('2. Should not show loan details as the common headers is not set.', function (done) {
		Request(BaseUrl)
			.get('/loan/details/wW9R@EmbW/UXQXWO3fS')
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Unauthorized Access!');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('3. Should not show loan details as the person is not logged in user', function (done) {
		Request(BaseUrl)
			.get('/loan/details/wW9R@EmbW/UXQXWO3fS')
			.set({['x-consumer-username']: 'merchant_zoHP@GkUR'})
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Not a valid user');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('4. Should not show loan details as the admin id is unauthorized', function (done) {
		Request(BaseUrl)
			.get('/loan/details/wW9R@EmbW/UXQXWO3fS')
			.set({['x-consumer-username']: 'admin_1223radsa'})
			.expect(401)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Not a valid user!');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('5. Should not show loan details as the merchant id and loan id is not provided.', function (done) {
		Request(BaseUrl)
			.get('/loan/details/')
			.expect(404)
			.set(commonHeader)
			.then((response) => {
				Expect(response?.res?.statusMessage).to.be.eql('Not Found');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('6. Should not show loan details as the merchant_id does not exists', function (done) {
		Request(BaseUrl)
			.get('/loan/details/error123id/UXQXWO3fS')
			.set(commonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Merchant Not Found!');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('7. Should not show loan details as the loan_id does not exists', function (done) {
		Request(BaseUrl)
			.get('/loan/details/wW9R@EmbW/error123loanid')
			.set(commonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.eql('No loan data found for given loan id');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('8. Should show url not found when only one parameter(merchant_id/loan_id) is passed', function (done) {
		Request(BaseUrl)
			.get('/loan/details/UXQXWO3fS')
			.set(commonHeader)
			.then((response) => {
				Expect(response?.res?.statusMessage).to.be.eql('Not Found');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('9. Should show all details with all related fields present', function (done) {
		Request(BaseUrl)
			.get('/loan/details/wW9R@EmbW/UXQXWO3fS')
			.set(commonHeader)
			.expect(200)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Loan detail');
				Expect(response?.body).to.include.keys('data');
				Expect(response?.body?.data).to.be.an('object');
				Expect(response?.body?.data?.merchant_id).to.be.eql('wW9R@EmbW');
				Expect(response?.body?.data?.loan_id).to.be.eql('UXQXWO3fS');
				Expect(response?.body?.data).to.contains.keys(
					'merchant_id',
					'loan_id',
					'loan_status',
					'internal_loan_status',
					'loan_product_data',
					'nbfc_loan_data',
					'collection_mode',
					'collection_by',
					'eligible_loan_id',
					'loan_approved_date',
					'reference'
				);
				Expect(response?.body?.data?.reference).to.be.an('object');
				Expect(response?.body?.data?.reference).to.contains.keys('agent', 'tl', 'asm');
				Expect(response?.body?.data?.internal_loan_status).to.be.an('object');
				Expect(response?.body?.data?.internal_loan_status).to.contains.keys('agent', 'merchant');
				Expect(response?.body?.data?.loan_product_data).to.be.an('object');
				Expect(response?.body?.data?.loan_product_data).to.contains.keys(
					'id',
					'type',
					'name',
					'financial_institute_id'
				);
				Expect(response?.body?.data?.nbfc_loan_data).to.be.an('object');
				Expect(response?.body?.data?.nbfc_loan_data).to.contains.keys(
					'first_emi_date',
					'last_emi_date',
					'last_emi_paid_date',
					'last_scheduled_emi_date',
					'loan_parameters',
					'repayment_frequency',
					'current_outstanding',
					'fixed_daily_repayment',
					'days_overdue'
				);
				done();
			})
			.catch((error) => {
				done(error);
			});
	});
});
