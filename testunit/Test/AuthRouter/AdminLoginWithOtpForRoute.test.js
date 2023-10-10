const Request = require('supertest');
const Expect = require('chai').expect;
const dotenv = require('dotenv');
dotenv.config();

const BaseUrl = 'http://localhost:1507';

let loginRequestData = {
	email: 'testing@ippopay.com',
	password: 'thisistestingpassword',
	otp: '1234'
};

describe('Login With Verify', function () {
	it('1. should not login as the user has already logged in', function (done) {
		Request(BaseUrl)
			.post('/api/store-admin/auth/login/verify-otp')
			.set('User-agent', 'PostMan')
			.send(loginRequestData)
			.expect(200)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Invalid Otp');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});
	it('2. should ask for otp as the correct data is given and logging in from a new device', function (done) {
		Request(BaseUrl)
			.post('/api/store-admin/auth/login')
			.set('User-agent', 'NewUserAgent')
			.send(loginRequestData)
			.expect(200)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Please verify the OTP sent.');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});
	it('3. should ask for otp as the otp is not given', function (done) {
		delete loginRequestData.otp;
		Request(BaseUrl)
			.post('/api/store-admin/auth/login/verify-otp')
			.set('User-agent', 'NewUserAgent')
			.send(loginRequestData)
			.expect(200)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Please enter the OTP sent to your number');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});
	it('4. should ask to provide email ID as the email ID is not given', function (done) {
		loginRequestData.otp = '1234';
		delete loginRequestData.email;
		Request(BaseUrl)
			.post('/api/store-admin/auth/login/verify-otp')
			.set('User-agent', 'NewUserAgent')
			.send(loginRequestData)
			.expect(200)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Please provide email ID.');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});
	it('5. should ask for valid email ID as the email ID is not valid', function (done) {
		loginRequestData.email = '12esdcb';
		Request(BaseUrl)
			.post('/api/store-admin/auth/login/verify-otp')
			.set('User-agent', 'NewUserAgent')
			.send(loginRequestData)
			.expect(200)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Please enter a valid email ID.');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});
	it('6. should ask to provide email ID as the email ID is an empty string', function (done) {
		loginRequestData.email = '';
		Request(BaseUrl)
			.post('/api/store-admin/auth/login/verify-otp')
			.set('User-agent', 'NewUserAgent')
			.send(loginRequestData)
			.expect(200)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Please provide email ID.');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});
	it('7. should not login as the email ID is wrong', function (done) {
		loginRequestData.email = 'predvdfbmt@gmail.com';
		Request(BaseUrl)
			.post('/api/store-admin/auth/login/verify-otp')
			.send(loginRequestData)
			.expect(200)
			.set('User-agent', 'NewUserAgent')
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
			.post('/api/store-admin/auth/login/verify-otp')
			.send(loginRequestData)
			.expect(200)
			.set('User-agent', 'NewUserAgent')
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
			.post('/api/store-admin/auth/login/verify-otp')
			.send(loginRequestData)
			.expect(200)
			.set('User-agent', 'NewUserAgent')
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Invalid Credentials!');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});
	it('10. Should login', function (done) {
		loginRequestData.password = 'thisistestingpassword';
		Request(BaseUrl)
			.post('/api/store-admin/auth/login/verify-otp')
			.set('User-agent', 'NewUserAgent')
			.send(loginRequestData)
			.expect(200)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Login Success');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});
});
