const Request = require('supertest');
const Expect = require('chai').expect;
const dotenv = require('dotenv');
dotenv.config();

const BaseUrl = 'http://localhost:1507/api/store-admin';

let commonHeader = {
	['x-consumer-username']: 'admin_BWpaitTqT5'
};

describe('Dispute List', function () {
	it('1. Should show all dispute', function (done) {
		Request(BaseUrl)
			.get('/dispute/list')
			.set(commonHeader)
			.expect(200)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Disputes list are');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('2. Should not list any disputes as the common header is not set', function (done) {
		Request(BaseUrl)
			.get('/dispute/list')
			.expect(200)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Unauthorized Access!');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('3. Should not list any disputes as the user is not logged in user', function (done) {
		Request(BaseUrl)
			.get('/dispute/list')
			.set({['x-consumer-username']: 'merchant_BWpaitTqT5'})
			.expect(200)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Not a valid user');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('4. Should not list any disputes as the admin id is unauthorized', function (done) {
		Request(BaseUrl)
			.get('/dispute/list')
			.set({['x-consumer-username']: 'admin_123redd'})
			.expect(200)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Not a valid user!');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('5. Should list only 2 disputes as the limit is only 2.', function (done) {
		Request(BaseUrl)
			.get('/dispute/list?limit=2')
			.set(commonHeader)
			.expect(200)
			.then((response) => {
				Expect(response?.body?.data?.total).to.be.eql(2);
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('6. Should list the dispute if the dispute id given in the query.', function (done) {
		Request(BaseUrl)
			.get('/dispute/list?dispute_id=disp_tuG3VVvoz')
			.set(commonHeader)
			.expect(200)
			.then((response) => {
				Expect(response?.body?.data?.disputes[0].dispute_id).to.be.eql('disp_tuG3VVvoz');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('7. Should not list disputes as the limit is not a number.', function (done) {
		Request(BaseUrl)
			.get('/dispute/list?limit=asd12')
			.set(commonHeader)
			.expect(200)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Limit must be a number');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('8. Should not list disputes as the page is not a number.', function (done) {
		Request(BaseUrl)
			.get('/dispute/list?page=asd12')
			.set(commonHeader)
			.expect(200)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Page must be a number');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('9. Should not list disputes as the from_time is not a date.', function (done) {
		Request(BaseUrl)
			.get('/dispute/list?from_time=asd12')
			.set(commonHeader)
			.expect(200)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Must be a date');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('10. Should not list disputes as the to_time is not a date.', function (done) {
		Request(BaseUrl)
			.get('/dispute/list?to_time=asd12')
			.set(commonHeader)
			.expect(200)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Must be a date');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('11. Should list the dispute if the dispute_for given in the query.', function (done) {
		Request(BaseUrl)
			.get('/dispute/list?dispute_for=upi')
			.set(commonHeader)
			.expect(200)
			.then((response) => {
				Expect(response?.body?.data?.total).to.be.eql(1);
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('12. Should list the dispute if the issue_type given in the query.', function (done) {
		Request(BaseUrl)
			.get('/dispute/list?issue_type=fraud_or_scam')
			.set(commonHeader)
			.expect(200)
			.then((response) => {
				Expect(response?.body?.data?.total).to.be.eql(1);
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('13. Should list the disputes based on the status given in the query.', function (done) {
		Request(BaseUrl)
			.get('/dispute/list?status=open')
			.set(commonHeader)
			.expect(200)
			.then((response) => {
				let disputes = response?.body?.data?.disputes;
				for (let dispute of disputes) {
					Expect(dispute.status).to.be.eql('open');
				}
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('14. Should not list disputes as the status is neither open nor closed', function (done) {
		Request(BaseUrl)
			.get('/dispute/list?status=neitherOpenNorClosed')
			.set(commonHeader)
			.expect(200)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Status should be either open or closed');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('15. Should not list disputes as the issue_type given is not in options.', function (done) {
		Request(BaseUrl)
			.get('/dispute/list?issue_type=notInOptions')
			.set(commonHeader)
			.expect(200)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql(
					'Issue Types should be payment_type, fraud_or_scam, missing_reward, or other_issues'
				);
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('16. Should not list disputes as the dispute_for given is not in options.', function (done) {
		Request(BaseUrl)
			.get('/dispute/list?dispute_for=notInOptions')
			.set(commonHeader)
			.expect(200)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql(
					'Dispute For should be UPI, BBPS, Paylink, Payouts, or Insurance'
				);
				done();
			})
			.catch((error) => {
				done(error);
			});
	});
});
