const Request = require('supertest');
const Expect = require('chai').expect;
const dotenv = require('dotenv');
const Moment = require('moment');
dotenv.config();

const Baseurl = 'http://localhost:1507/api/store-admin';

const commonHeader = {
	['x-consumer-username']: 'admin_zoHP@GkUR'
};

let requestData = {
	merchant_id: 'wW9R@EmbW',
	loan_id: 'UXQXWO3fS',
	start_date: Moment().format('YYYY-MM-DD'),
	modifier: {
		id: 'zoHP@GkUR',
		name: 'admin',
		role: 'super-admin'
	}
};
describe('Emi Reschedule', function () {
	before(function (done) {
		Request(Baseurl)
			.get('/auth/generate-token')
			.then((response) => {
				commonHeader['x-csrf-token'] = response.body.data.csrfToken;
				commonHeader['Cookie'] = response.header['set-cookie'];
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('1. Should not update emi data when common headers is not set', function (done) {
		Request(Baseurl)
			.post('/loan/emi/reschedule')
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Wrong CSRF Token');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('2. Should not update emi details as the person is not logged in user', function (done) {
		let invalidToken = {...commonHeader};
		invalidToken['x-consumer-username'] = 'merchant_zoHP@GkUR';
		Request(Baseurl)
			.post('/loan/emi/reschedule')
			.set(invalidToken)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Not a valid user');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('3. Should not update emi details as the person is not authorized', function (done) {
		let invalidToken = {...commonHeader};
		invalidToken['x-consumer-username'] = 'sdfetvberve';
		Request(Baseurl)
			.post('/loan/emi/reschedule')
			.set(invalidToken)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Unauthorized Access!');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('4. Should update emi detail as the start_date is within 15 days from now', function (done) {
		let sampleRequestData = requestData;
		let date = new Date(sampleRequestData?.start_date);
		let start_date = Moment(date.setDate(date.getDate() + 1)).format('YYYY-MM-DD');
		sampleRequestData.start_date = start_date;
		Request(Baseurl)
			.post('/loan/emi/reschedule')
			.set(commonHeader)
			.send(sampleRequestData)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Emi rescheduled successfully');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('5. Should not update emi detail as the start_date is within 15 days from now', function (done) {
		let sampleRequestData = requestData;
		let date = new Date(sampleRequestData?.start_date);
		let start_date = Moment(date.setDate(date.getDate() - 5)).format('YYYY-MM-DD');
		sampleRequestData.start_date = start_date;
		Request(Baseurl)
			.post('/loan/emi/reschedule')
			.set(commonHeader)
			.send(sampleRequestData)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql(
					'Start date cannot be in past or more than 15 days in future'
				);
				done();
			})
			.catch((error) => {
				done(error);
			});
	});
});
