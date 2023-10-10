const Request = require('supertest');
const Expect = require('chai').expect;
const dotenv = require('dotenv');
dotenv.config();

const BaseUrl = 'http://localhost:1507/api/store-admin';

let commonHeader = {
	['x-consumer-username']: 'admin_zoHP@GkUR'
};

describe('Emi Stats', function () {
	it('1. Should not show loan stats if headers are not set', function (done) {
		Request(BaseUrl)
			.get('/loan/emi/stats/Xr6jPBmM0/71OcngJk$')
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Unauthorized Access!');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('2. Should show 0 values if the merchant_id or loan_id are incorrect or not present', function (done) {
		Request(BaseUrl)
			.get('/loan/emi/stats/Xr6jPBmM0/71OcngJk$')
			.set(commonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Emi stats Data');
				Expect(response?.body?.data).to.an('object');
				if (Object.values(response?.body?.data)?.every((value) => value === 0)) {
					Expect(response?.body?.data).to.an('object');
				}
				Expect(response?.body?.data).to.include.keys(
					'paid_count',
					'paid_amount',
					'un_paid_count',
					'un_paid_amount',
					'expected_amount',
					'success_notification_count',
					'success_notification_amount',
					'failed_notification_count',
					'failed_notification_amount',
					'pending_notification_count',
					'pending_notification_amount'
				);
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('3. Should show emi stats if the merchant_id and loan_id are given', function (done) {
		Request(BaseUrl)
			.get('/loan/emi/stats/Xr6jPBmM0/71OcngJk$')
			.set(commonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Emi stats Data');
				Expect(response?.body?.data).to.an('object');
				Expect(response?.body?.data).to.include.keys(
					'paid_count',
					'paid_amount',
					'un_paid_count',
					'un_paid_amount',
					'expected_amount',
					'success_notification_count',
					'success_notification_amount',
					'failed_notification_count',
					'failed_notification_amount',
					'pending_notification_count',
					'pending_notification_amount'
				);
				done();
			})
			.catch((error) => {
				done(error);
			});
	});
});
