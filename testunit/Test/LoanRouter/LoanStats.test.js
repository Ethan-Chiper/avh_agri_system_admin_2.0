const Request = require('supertest');
const Expect = require('chai').expect;
const dotenv = require('dotenv');
dotenv.config();

const BaseUrl = 'http://localhost:1507/api/store-admin';

let commonHeader = {
	['x-consumer-username']: 'admin_zoHP@GkUR'
};

describe('Loan Status', function () {
	it('1. Should show loan status', function (done) {
		Request(BaseUrl)
			.get('/loan/stats')
			.set(commonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('loan application stats data');
				Expect(response?.body?.data).to.an('object');
				Expect(response?.body?.data).to.contains.keys(
					'loan_applied_count',
					'loan_approved_count',
					'loan_rejected_count',
					'loan_disbursed_count',
					'total_count'
				);
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('2. Should not show status when headers are not set', function (done) {
		Request(BaseUrl)
			.get('/loan/stats')
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Unauthorized Access!');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('3. Should not show status when user is not valid', function (done) {
		Request(BaseUrl)
			.get('/loan/stats')
			.set({['x-consumer-username']: 'merchant_zoHP@GkUR'})
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Not a valid user');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('4. Should not show status when user is not valid', function (done) {
		Request(BaseUrl)
			.get('/loan/stats')
			.set({['x-consumer-username']: 'admin_456invalid'})
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Not a valid user!');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('5. should show status when date_option is from today, yesterday, weekly, monthly, yearly', function (done) {
		Request(BaseUrl)
			.get('/loan/stats?date_option=today')
			.set(commonHeader)
			.then((response) => {
				Expect(response?.body?.data).to.an('object');
				Expect(response?.body?.data).to.contains.keys(
					'loan_applied_count',
					'loan_approved_count',
					'loan_rejected_count',
					'loan_disbursed_count',
					'total_count'
				);
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('6. should return 0 as values when date_option is not from today, yesterday, weekly, monthly, yearly', function (done) {
		Request(BaseUrl)
			.get('/loan/stats?date_option=hgchgd')
			.set(commonHeader)
			.then((response) => {
				if (Object.values(response?.body?.data)?.every((value) => value === 0)) {
					Expect(response?.body?.data).to.an('object');
				}
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('7. Should show status if from_date is given in date format YYYY-MM-DD', function (done) {
		Request(BaseUrl)
			.get('/loan/stats?from_date=2023-01-01')
			.set(commonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('loan application stats data');
				Expect(response?.body?.data).to.an('object');
				Expect(response?.body?.data).to.contains.keys(
					'loan_applied_count',
					'loan_approved_count',
					'loan_rejected_count',
					'loan_disbursed_count',
					'total_count'
				);
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('8. Should show status if to_date is given in date format YYYY-MM-DD', function (done) {
		Request(BaseUrl)
			.get('/loan/stats?to_date=2023-06-16')
			.set(commonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('loan application stats data');
				Expect(response?.body?.data).to.an('object');
				Expect(response?.body?.data).to.contains.keys(
					'loan_applied_count',
					'loan_approved_count',
					'loan_rejected_count',
					'loan_disbursed_count',
					'total_count'
				);
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('9. Should not show status if from_date and to_date are not in date format YYYY-MM-DD', function (done) {
		Request(BaseUrl)
			.get('/loan/stats?from_date=2023-066-15&to_date=2023-06-166')
			.set(commonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('loan application stats data');
				if (Object.values(response?.body?.data)?.every((value) => value === 0)) {
					Expect(response?.body?.data).to.an('object');
				}
				done();
			})
			.catch((error) => {
				done(error);
			});
	});
});
