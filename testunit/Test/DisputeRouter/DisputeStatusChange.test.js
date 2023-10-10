const Request = require('supertest');
const Expect = require('chai').expect;

const BaseUrl = 'http://localhost:1507/api/store-admin';

let commonHeader = {
	['x-consumer-username']: 'admin_BWpaitTqT5'
};

describe('Dispute Change Status', function () {
	before(function (done) {
		Request(BaseUrl)
			.get('/auth/generate-token')
			.expect(200)
			.then((response) => {
				commonHeader['x-csrf-token'] = response.body.data.csrfToken;
				commonHeader['Cookie'] = response.header['set-cookie'];
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('1. Should change the status of the dispute id given', function (done) {
		Request(BaseUrl)
			.patch('/dispute/change-status/disp_tuG3VVvoz')
			.set(commonHeader)
			.send({comment: 'this is a comment'})
			.expect(200)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Status Changed!');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('2. Should not change the status as the dispute id is not given', function (done) {
		Request(BaseUrl)
			.patch('/dispute/change-status')
			.set(commonHeader)
			.send({comment: 'this is a comment'})
			.expect(404)
			.then((response) => {
				Expect(response?.res?.statusMessage).to.be.eql('Not Found');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('3. Should not change the status as the headers is not set', function (done) {
		Request(BaseUrl)
			.patch('/dispute/change-status/disp_tuG3VVvoz')
			.send({comment: 'this is a comment'})
			.expect(406)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Wrong CSRF Token');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('4. Should not change the status as the csrf is set but the x-consumer-username is not set.', function (done) {
		let noadminId = {...commonHeader};
		delete noadminId['x-consumer-username'];
		Request(BaseUrl)
			.patch('/dispute/change-status/disp_tuG3VVvoz')
			.send({comment: 'this is a comment'})
			.set(noadminId)
			.expect(200)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Unauthorized Access!');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('5. Should not change the status as the csrf is set but the kong role is wrong.', function (done) {
		let noadminId = {...commonHeader};
		noadminId['x-consumer-username'] = 'merch_BWpaitTqT5';
		Request(BaseUrl)
			.patch('/dispute/change-status/disp_tuG3VVvoz')
			.send({comment: 'this is a comment'})
			.set(noadminId)
			.expect(200)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Not a valid user');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('6. Should not change the status as the csrf is set but the kong id is wrong.', function (done) {
		let noadminId = {...commonHeader};
		noadminId['x-consumer-username'] = 'admin_zoHPgvbn';
		Request(BaseUrl)
			.patch('/dispute/change-status/disp_tuG3VVvoz')
			.send({comment: 'this is a comment'})
			.set(noadminId)
			.expect(200)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Not a valid user!');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('7. Should not change the status as the no csrf token is set.', function (done) {
		let noCsrfToken = {...commonHeader};
		delete noCsrfToken['x-csrf-token'];
		Request(BaseUrl)
			.patch('/dispute/change-status/disp_tuG3VVvoz')
			.send({comment: 'this is a comment'})
			.set(noCsrfToken)
			.expect(406)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Wrong CSRF Token');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('8. Should not change the status as the wrong csrf token is set.', function (done) {
		let noCsrfToken = {...commonHeader};
		noCsrfToken['x-csrf-token'] = 'gjsddiwefbcxnnliuwewkjdndskwhd';
		Request(BaseUrl)
			.patch('/dispute/change-status/disp_tuG3VVvoz')
			.send({comment: 'this is a comment'})
			.set(noCsrfToken)
			.expect(406)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Wrong CSRF Token');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('9. Should not change the status as the comment is not given', function (done) {
		Request(BaseUrl)
			.patch('/dispute/change-status/disp_tuG3VVvoz')
			.set(commonHeader)
			.expect(200)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Please provide comments. Comments is a required field.');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('10. Should not change the status as the comment is an empty string', function (done) {
		Request(BaseUrl)
			.patch('/dispute/change-status/disp_tuG3VVvoz')
			.set(commonHeader)
			.send({comment: ''})
			.expect(200)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Please provide comments. Comments is a required field.');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('11. Should not change the status as the comment is just white space', function (done) {
		Request(BaseUrl)
			.patch('/dispute/change-status/disp_tuG3VVvoz')
			.set(commonHeader)
			.send({comment: '    '})
			.expect(200)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Please provide comments. Comments is a required field.');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});
});
