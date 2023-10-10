const Request = require('supertest');
const Expect = require('chai').expect;
const dotenv = require('dotenv');
dotenv.config();

const BaseUrl = 'http://localhost:1507';

let loginRequestData = {
	email: 'testing@ippopay.com',
	password: 'thisistestingpassword'
};

describe('Login Route', function () {
	it('1. should ask for otp as the correct data is given and logging in from a new device', function (done) {
		Request(BaseUrl)
			.post('/api/store-admin/auth/login')
			.send(loginRequestData)
			.expect(200)
			.set('User-agent', 'PostMan12')
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Please verify the OTP sent.');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});
	it('2. should login as the otp is given correctly', function (done) {
		loginRequestData.otp = '1234';
		Request(BaseUrl)
			.post('/api/store-admin/auth/login/verify-otp')
			.send(loginRequestData)
			.expect(200)
			.set('User-agent', 'PostMan12')
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Login Success');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});
	it('3. should login as the correct data is given and logging in from the same device', function (done) {
		Request(BaseUrl)
			.post('/api/store-admin/auth/login')
			.send(loginRequestData)
			.expect(200)
			.set('User-agent', 'PostMan12')
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Login Success');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});
	it('4. should not login as the email ID is not valid', function (done) {
		loginRequestData.email = 'awedggg';
		Request(BaseUrl)
			.post('/api/store-admin/auth/login')
			.send(loginRequestData)
			.expect(200)
			.set('User-agent', 'PostMan12')
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Please enter a valid email ID.');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});
	it('5. should not login as the email ID is an empty string', function (done) {
		loginRequestData.email = '';
		Request(BaseUrl)
			.post('/api/store-admin/auth/login')
			.send(loginRequestData)
			.expect(200)
			.set('User-agent', 'PostMan12')
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Please provide email ID.');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});
	it('6. should not login as the email ID is not provided', function (done) {
		delete loginRequestData.email;
		Request(BaseUrl)
			.post('/api/store-admin/auth/login')
			.send(loginRequestData)
			.expect(200)
			.set('User-agent', 'PostMan12')
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Please provide email ID.');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});
	it('7. should not login as the email ID is wrong', function (done) {
		loginRequestData.email = 'premaydsfdmt@gmail.com';
		Request(BaseUrl)
			.post('/api/store-admin/auth/login')
			.send(loginRequestData)
			.expect(200)
			.set('User-agent', 'PostMan12')
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Invalid Credentials!');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});
	it('8. should not login as the password is an empty string', function (done) {
		loginRequestData.email = 'testing@ippopay.com';
		loginRequestData.password = '';
		Request(BaseUrl)
			.post('/api/store-admin/auth/login')
			.send(loginRequestData)
			.expect(200)
			.set('User-agent', 'PostMan12')
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Please enter your password.');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});
	it('9. should not login as the password is wrong', function (done) {
		loginRequestData.password = '1w';
		Request(BaseUrl)
			.post('/api/store-admin/auth/login')
			.send(loginRequestData)
			.expect(200)
			.set('User-agent', 'PostMan12')
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Invalid Credentials!');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});
	it('10. should not login as the login device is empty', function (done) {
		Request(BaseUrl)
			.post('/api/store-admin/auth/login')
			.send(loginRequestData)
			.expect(200)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Invalid Credentials!');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});
});
