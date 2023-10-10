const Request = require('supertest');
const Expect = require('chai').expect;
const dotenv = require('dotenv');
dotenv.config();

const BaseUrl = 'http://localhost:1507/api/store-admin';

let commonHeader = {
	['x-consumer-username']: 'admin_zoHP@GkUR'
};

describe('Bulk Push Notification', function () {
	it('1. Should not send notification as the commonHeader or Kong request header is missing', function (done) {
		Request(BaseUrl)
			.get('/auth/generate-token')
			.then((response) => {
				let csrfToken = {['x-csrf-token']: response.body.data.csrfToken};
				Request(BaseUrl)
					.post('/push-notification/send/push')
					.set(csrfToken)
					.set('Cookie', response.header['set-cookie'])
					.then((response) => {
						Expect(response?.body?.message).to.be.eql('Unauthorized Access!');
						done();
					})
					.catch((error) => {
						done(error);
					});
			})
			.catch((error) => {
				done(error);
			});
	});

	it('2. Should not send notification as user role is not admin', function (done) {
		let invalidToken = {
			['x-consumer-username']: 'notAdmin_2521678'
		};
		Request(BaseUrl)
			.get('/auth/generate-token')
			.then((response) => {
				let csrfToken = {['x-csrf-token']: response.body.data.csrfToken};
				Request(BaseUrl)
					.post('/push-notification/send/push')
					.set(invalidToken)
					.set(csrfToken)
					.set('Cookie', response.header['set-cookie'])
					.then((response) => {
						Expect(response?.body?.message).to.be.eql('Not a valid user');
						done();
					})
					.catch((error) => {
						done(error);
					});
			})
			.catch((error) => {
				done(error);
			});
	});

	it('3. Should not send notification as user id is not valid', function (done) {
		let invalidToken = {
			['x-consumer-username']: 'admin_2521678'
		};
		Request(BaseUrl)
			.get('/auth/generate-token')
			.then((response) => {
				let csrfToken = {['x-csrf-token']: response.body.data.csrfToken};
				Request(BaseUrl)
					.post('/push-notification/send/push/merchant')
					.set(invalidToken)
					.set(csrfToken)
					.set('Cookie', response.header['set-cookie'])
					.then((response) => {
						Expect(response?.body?.message).to.be.eql('Not a valid user!');
						done();
					})
					.catch((error) => {
						done(error);
					});
			})
			.catch((error) => {
				done(error);
			});
	});

	it('4. Should not send notification when requestBody not given', function (done) {
		Request(BaseUrl)
			.get('/auth/generate-token')
			.set(commonHeader)
			.expect(200)
			.then((response) => {
				let csrfToken = {['x-csrf-token']: response.body.data.csrfToken};
				Request(BaseUrl)
					.post('/push-notification/send/push')
					.set(commonHeader)
					.set(csrfToken)
					.set('Cookie', response.header['set-cookie'])
					.then((response) => {
						Expect(response?.body?.message).to.be.eql('Please provide title');
						done();
					})
					.catch((error) => {
						done(error);
					});
			})
			.catch((error) => {
				done(error);
			});
	});

	it('5. Should not send notification when  not given message', function (done) {
		let requestBody = {title: 'test'};
		Request(BaseUrl)
			.get('/auth/generate-token')
			.set(commonHeader)
			.expect(200)
			.then((response) => {
				let csrfToken = {['x-csrf-token']: response.body.data.csrfToken};
				Request(BaseUrl)
					.post('/push-notification/send/push')
					.send(requestBody)
					.set(commonHeader)
					.set(csrfToken)
					.set('Cookie', response.header['set-cookie'])
					.then((response) => {
						Expect(response?.body?.message).to.be.eql('Please provide message');
						done();
					})
					.catch((error) => {
						done(error);
					});
			})
			.catch((error) => {
				done(error);
			});
	});

	it('6. Should not send notification when  not given title', function (done) {
		let requestBody = {message: 'Good Evening'};
		Request(BaseUrl)
			.get('/auth/generate-token')
			.set(commonHeader)
			.expect(200)
			.then((response) => {
				let csrfToken = {['x-csrf-token']: response.body.data.csrfToken};
				Request(BaseUrl)
					.post('/push-notification/send/push')
					.send(requestBody)
					.set(commonHeader)
					.set(csrfToken)
					.set('Cookie', response.header['set-cookie'])
					.then((response) => {
						Expect(response?.body?.message).to.be.eql('Please provide title');
						done();
					})
					.catch((error) => {
						done(error);
					});
			})
			.catch((error) => {
				done(error);
			});
	});

	it('7. Should  send notification when requestBody given', function (done) {
		let requestBody = {title: 'test', message: 'Good Evening'};
		Request(BaseUrl)
			.get('/auth/generate-token')
			.set(commonHeader)
			.expect(200)
			.then((response) => {
				let csrfToken = {['x-csrf-token']: response?.body?.data?.csrfToken};
				Request(BaseUrl)
					.post('/push-notification/send/push')
					.send(requestBody)
					.set(commonHeader)
					.set(csrfToken)
					.set('Cookie', response.header['set-cookie'])
					.then((response) => {
						Expect(response?.body?.message).to.be.eql('Push Notification sent!');
						done();
					})
					.catch((error) => {
						done(error);
					});
			})
			.catch((error) => {
				done(error);
			});
	});
});
