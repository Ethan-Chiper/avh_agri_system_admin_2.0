const Request = require('supertest');
const Expect = require('chai').expect;
const dotenv = require('dotenv');
dotenv.config();

const Baseurl = 'http://localhost:1507/api/store-admin';

const commonHeader = {
	['x-consumer-username']: 'admin_zoHP@GkUR'
};

let requestData = {
	merchant_id: 'yM6OxST8M',
	loan_id: 'DspByYfdN',
	nbfc_loan_id: '32432ewrf',
	loan_status: 'approved',
	fixed_daily_repayment: '100',
	first_emi_date: '2023-07-11',
	loan_amount: 5001,
	interest: '900',
	tenure: '18',
	agent_id: 'dFfPwV99c',
	tl_id: 'zRkxHotZ3',
	asm_id: 'dFfPwV99c',
	modifier: {
		id: 'yONUgl3Xnk',
		name: 'farooq testing account',
		role: 'super-admin'
	}
};
describe('Loan Updates', function () {
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
	it('1. Should not update a loan data when common headers is not set', function (done) {
		Request(Baseurl)
			.post('/loan/update')
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Wrong CSRF Token');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});
	it('2. Should not update loan data when csrf is not exist', function (done) {
		let invalidToken = {...commonHeader};
		delete invalidToken['x-csrf-token'];
		Request(Baseurl)
			.post('/loan/update')
			.set(invalidToken)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Wrong CSRF Token');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});
	it('3. Should not update loan details as the person is not logged in user', function (done) {
		let invalidToken = {...commonHeader};
		invalidToken['x-consumer-username'] = 'merchant_zoHP@GkUR';
		Request(Baseurl)
			.post('/loan/update')
			.set(invalidToken)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Not a valid user');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});
	it('4. Should update loan details when as the person is admin and provide with all body data fields and loan_status as approved or rejected only at initial once', function (done) {
		Request(Baseurl)
			.post('/loan/update')
			.set(commonHeader)
			.send(requestData)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Loan updated successfully');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});
	it('5. Should not update loan details when loan detail already updated as approved and now the loan_status is send as rejected ', function (done) {
		requestData.loan_status = 'rejected';
		Request(Baseurl)
			.post('/loan/update')
			.set(commonHeader)
			.send(requestData)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Unable to edit loan details');
				requestData.loan_status = 'approved';
				done();
			})
			.catch((error) => {
				requestData.loan_status = 'approved';
				done(error);
			});
	});
	it('6. Should not update loan details when as loan_status is not approved or rejected', function (done) {
		requestData.loan_status = 'pending';
		Request(Baseurl)
			.post('/loan/update')
			.set(commonHeader)
			.send(requestData)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('loan status field must be in [approved, rejected]');
				requestData.loan_status = 'approved';
				done();
			})
			.catch((error) => {
				requestData.loan_status = 'approved';
				done(error);
			});
	});
});
