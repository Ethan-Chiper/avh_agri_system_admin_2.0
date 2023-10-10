const Request = require('supertest');
const Expect = require('chai').expect;
const dotenv = require('dotenv');
const Moment = require('moment');
dotenv.config();

const BaseUrl = 'http://localhost:1507/api/store-admin';

let commonHeader = {
	['x-consumer-username']: 'admin_zoHP@GkUR'
};

describe('VpaReconciliation List', function () {
	it('1. Should not list if the person is not logged user', function (done) {
		Request(BaseUrl)
			.get('/vpa-reconciliations/list')
			.set({['x-consumer-username']: 'merchant_zoHP@GkUR'})
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Not a valid user');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('2. Should not list, if the admin id is unatuhorized', function (done) {
		Request(BaseUrl)
			.get('/vpa-reconciliations/list')
			.set({['x-consumer-username']: 'admin_456invalid'})
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Not a valid user!');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('3. Should not list, if the admin id is not provided', function (done) {
		Request(BaseUrl)
			.get('/vpa-reconciliations/list')
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Unauthorized Access!');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('4. Should show only 5 store_transactions if the limit is provided as 5', function (done) {
		Request(BaseUrl)
			.get('/vpa-reconciliations/list?limit=5')
			.set(commonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Store Transaction List are');
				Expect(response?.body?.data).to.an('object');
				Expect(response?.body?.data?.length).to.be.eql(5);
				Expect(response?.body?.data).to.have.keys('store_transactions', 'length');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('5. Should not list store_transactions if the limit is not valid', function (done) {
		Request(BaseUrl)
			.get('/vpa-reconciliations/list?limit=asdv')
			.set(commonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Limit must have to be number');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('6. Should not list store_transactions when page is not a number', function (done) {
		Request(BaseUrl)
			.get('/vpa-reconciliations/list?limit=10&page=one')
			.set(commonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('page must have to be a number');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('7. Should list store_transactions even when limit is not given but page is given', function (done) {
		Request(BaseUrl)
			.get('/vpa-reconciliations/list?page=2')
			.set(commonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Store Transaction List are');
				Expect(response?.body?.data).to.an('object');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('8. Should not list store_transactions when from_date is not date format', function (done) {
		Request(BaseUrl)
			.get('/vpa-reconciliations/list?from_date=20231-3-12')
			.set(commonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('must have to be a date');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('9. Should not list store_transactions when to_date is not a date format', function (done) {
		Request(BaseUrl)
			.get('/vpa-reconciliations/list?to_date=202306-30')
			.set(commonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('must have to be a date');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('10. Should not list store_transactions when from_date or to_date or both are not given as date format', function (done) {
		Request(BaseUrl)
			.get('/vpa-reconciliations/list?from_date=2023-01-01&to_date=202306-30')
			.set(commonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('must have to be a date');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('11. Should list store_transactions if from_date is given in date format YYYY-MM-DD', function (done) {
		Request(BaseUrl)
			.get('/vpa-reconciliations/list?from_date=2023-01-01')
			.set(commonHeader)
			.then((response) => {
				let slotDate =
					response?.body?.data?.store_transactions[0]?.slot >=
					Number.parseInt(Moment('2023-01-01').format('YYYYMMDD'))
						? 'true'
						: 'false';
				Expect(response?.body?.message).to.be.eql('Store Transaction List are');
				Expect(slotDate).to.be.eql('true');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('12. Should list store_transactions if to_date is given in date format YYYY-MM-DD', function (done) {
		Request(BaseUrl)
			.get('/vpa-reconciliations/list?to_date=2023-06-30')
			.set(commonHeader)
			.then((response) => {
				let slotDate =
					response?.body?.data?.store_transactions[0]?.slot <=
					Number.parseInt(Moment('2023-06-30').format('YYYYMMDD'))
						? 'true'
						: 'false';
				Expect(response?.body?.message).to.be.eql('Store Transaction List are');
				Expect(slotDate).to.be.eql('true');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('13. Should list store_transactions only with createdAt between from_date and To_date', function (done) {
		Request(BaseUrl)
			.get('/vpa-reconciliations/list?from_date=2023-01-01&to_date=2023-06-30')
			.set(commonHeader)
			.then((response) => {
				let slotDate = response?.body?.data?.store_transactions[0]?.slot;
				let check_slotDate =
					slotDate >= Number.parseInt(Moment('2023-01-01').format('YYYYMMDD')) &&
					slotDate <= Number.parseInt(Moment('2023-06-30').format('YYYYMMDD'))
						? 'true'
						: 'false';
				Expect(response?.body?.message).to.be.eql('Store Transaction List are');
				Expect(check_slotDate).to.be.eql('true');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('14. Should list store_transactions details if date_option is given with today, yesterday, weekly, monthly, or yearly', function (done) {
		Request(BaseUrl)
			.get('/vpa-reconciliations/list?date_option=yearly')
			.set(commonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Store Transaction List are');
				Expect(response?.body?.data).to.an('object');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('15. Should not list store_transactions details if date_option is not given as with today, yesterday, weekly, monthly, or yearly', function (done) {
		Request(BaseUrl)
			.get('/vpa-reconciliations/list?date_option=ndajcin')
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
});
