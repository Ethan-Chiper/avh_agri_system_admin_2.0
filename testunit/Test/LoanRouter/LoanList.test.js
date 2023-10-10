const Request = require('supertest');
const Expect = require('chai').expect;
const dotenv = require('dotenv');
const Moment = require('moment');
dotenv.config();

const BaseUrl = 'http://localhost:1507/api/store-admin';

let commonHeader = {
	['x-consumer-username']: 'admin_zoHP@GkUR'
};

describe('Loan List', function () {
	it('1. Should show all loan list', function (done) {
		Request(BaseUrl)
			.get('/loan/list')
			.set(commonHeader)
			.expect(200)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Loan list are');
				Expect(response?.body).to.include.keys('data');
				Expect(response?.body?.data).to.an('array');
				Expect(response?.body?.data[0]).to.contains.keys(
					'merchant_id',
					'loan_id',
					'loan_status',
					'eligible_loan_id',
					'nbfc_loan_data',
					'reference'
				);
				Expect(response?.body?.data[0]?.reference).to.contains.keys('agent', 'tl', 'asm');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('2. Should not list any loan details as the common header is not set', function (done) {
		Request(BaseUrl)
			.get('/loan/list')
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Unauthorized Access!');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('3. Should not list any loan details as the person is not logged in user', function (done) {
		Request(BaseUrl)
			.get('/loan/list')
			.set({['x-consumer-username']: 'merchant_zoHP@GkUR'})
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Not a valid user');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('4. Should not list any loan details as the admin id is unauthorized', function (done) {
		Request(BaseUrl)
			.get('/loan/list')
			.set({['x-consumer-username']: 'admin_456invalid'})
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Not a valid user!');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('5. Should list the loan detail if the merchant id given in the query.', function (done) {
		Request(BaseUrl)
			.get('/loan/list?merchant_id=wW9R@EmbW')
			.set(commonHeader)
			.expect(200)
			.then((response) => {
				Expect(response?.body?.data[0].merchant_id).to.be.eql('wW9R@EmbW');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('6. Should not list the loan details if the merchant_id is not valid', function (done) {
		Request(BaseUrl)
			.get('/loan/list?merchant_id=errodid134')
			.set(commonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Merchant Not Found!');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('7. Should display all loan details if the merchant_id value passed as empty', function (done) {
		Request(BaseUrl)
			.get('/loan/list?merchant_id=')
			.set(commonHeader)
			.expect(200)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Loan list are');
				Expect(response?.body?.data).to.an('array');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('8. Should list only 3 loan details as the limit is only 3.', function (done) {
		Request(BaseUrl)
			.get('/loan/list?limit=3')
			.set(commonHeader)
			.then((response) => {
				Expect(response?.body?.data).to.have.lengthOf(3);
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('9. Should not list loan details if limit is not a number.', function (done) {
		Request(BaseUrl)
			.get('/loan/list?limit=three3')
			.set(commonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Limit must be a number');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('10. Should list loan list if loan_status is given', function (done) {
		Request(BaseUrl)
			.get('/loan/list?loan_status=applied')
			.set(commonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Loan list are');
				Expect(response?.body?.data[0]?.loan_status).to.be.eql('applied');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('11. Should not list if loan_status is not valid', function (done) {
		Request(BaseUrl)
			.get('/loan/list?loan_status=active')
			.set(commonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql(
					'Please provide status as applied, disbursed, pending, approved, or rejected!'
				);
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('12. Should list Loan if eligible_loan_id is given', function (done) {
		Request(BaseUrl)
			.get('/loan/list?eligible_loan_id=bTPJJ$hLG')
			.set(commonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Loan list are');
				Expect(response?.body?.data[0]?.eligible_loan_id).to.be.eql('bTPJJ$hLG');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('13. Should not list loan details if eligible_loan_id is not valid', function (done) {
		Request(BaseUrl)
			.get('/loan/list?eligible_loan_id=error13id')
			.set(commonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('No loans found');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('14. Should list loan details if loan_id is given and valid', function (done) {
		Request(BaseUrl)
			.get('/loan/list?loan_id=BVWa@YVrL')
			.set(commonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Loan list are');
				Expect(response?.body?.data[0]?.loan_id).to.be.eql('BVWa@YVrL');
				Expect(response?.body?.data[0]?.merchant_id).to.be.eql('VUhuahniR');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('15. Should not list loan details if the loan_id is not valid', function (done) {
		Request(BaseUrl)
			.get('/loan/list?loan_id=error123id')
			.set(commonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('No loans found');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('16. Should list loan details if date_option is given with today, yesterday, weekly, monthly, or yearly', function (done) {
		Request(BaseUrl)
			.get('/loan/list?date_option=monthly')
			.set(commonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Loan list are');
				Expect(response?.body?.data).to.an('array');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('17. Should not list loan details if date_option is not given as with today, yesterday, weekly, monthly, or yearly', function (done) {
		Request(BaseUrl)
			.get('/loan/list?date_option=ndajcin')
			.set(commonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql(
					'Please provide date_option as today, yesterday, weekly, monthly, or yearly!'
				);
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('18. Should list loan if from_date is given in date format YYYY-MM-DD', function (done) {
		Request(BaseUrl)
			.get('/loan/list?from_date=2023-01-01')
			.set(commonHeader)
			.then((response) => {
				let check_createdAt =
					Moment(response?.body?.data[0].createdAt, 'YYYY-MM-DD') >= Moment('2023-01-01') ? 'true' : 'false';
				Expect(response?.body?.message).to.be.eql('Loan list are');
				Expect(check_createdAt).to.be.eql('true');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('19. Should list loan if to_date is given in date format YYYY-MM-DD', function (done) {
		Request(BaseUrl)
			.get('/loan/list?to_date=2023-06-30')
			.set(commonHeader)
			.then((response) => {
				let check_createdAt =
					Moment(response?.body?.data[0].createdAt, 'YYYY-MM-DD') <= Moment('2023-06-30') ? 'true' : 'false';
				Expect(response?.body?.message).to.be.eql('Loan list are');
				Expect(check_createdAt).to.be.eql('true');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('20. Should list loan only with createdAt between from_date and To_date', function (done) {
		Request(BaseUrl)
			.get('/loan/list?from_date=2023-01-01&to_date=2023-06-30')
			.set(commonHeader)
			.then((response) => {
				let createdAt = Moment(response?.body?.data[0].createdAt, 'YYYY-MM-DD');
				let check_createdAt =
					createdAt >= Moment('2023-01-01') && createdAt <= Moment('2023-06-30') ? 'true' : 'false';
				Expect(response?.body?.message).to.be.eql('Loan list are');
				Expect(check_createdAt).to.be.eql('true');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('21. Should not list loan when from_date is not date format', function (done) {
		Request(BaseUrl)
			.get('/loan/list?from_date=20231-3-12')
			.set(commonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Must be a date');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('22. Should not list loan when to_date is not a date format', function (done) {
		Request(BaseUrl)
			.get('/loan/list?to_date=202306-30')
			.set(commonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Must be a date');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('23. Should not list loan when from_date or to_date or both are not given as date format', function (done) {
		Request(BaseUrl)
			.get('/loan/list?from_date=2023-01-01&to_date=202306-30')
			.set(commonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Must be a date');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('24. Should not list loan when page is not a number', function (done) {
		Request(BaseUrl)
			.get('/loan/list?limit=10&page=one')
			.set(commonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('page must be a number');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('25. Should list loan even when limit is not given but page is given', function (done) {
		Request(BaseUrl)
			.get('/loan/list?page=1')
			.set(commonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Loan list are');
				Expect(response?.body?.data).to.an('array');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});
});
