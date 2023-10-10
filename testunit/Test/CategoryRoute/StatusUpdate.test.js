const Request = require('supertest');
const Expect = require('chai').expect;
const dotenv = require('dotenv');
dotenv.config();

const Baseurl = 'http://localhost:1507/api/store-admin';

const commonHeader = {
	['x-consumer-username']: 'admin_zoHP@GkUR'
};

describe('Category status update', function () {
	it('should update status', function (done) {
		Request(Baseurl)
			.patch('/change-status/oYUR@EoD$')
			.expect(200)
			.set(commonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Category status changed successfully');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});
	it('Should not update as category status is not admin id', function (done) {
		let invalidAdmin = {
			['x-consumer-username']: 'notAdmin_js21is8'
		};
		Request(Baseurl)
			.post('/pos/category/update/5BZew8Fg5')
			.set(invalidAdmin)
			.then((responce) => {
				Expect(responce?.body?.message).to.be.eql('Unauthorized Access!');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});
	it('Should not update any category as the common header is not set', function (done) {
		Request(Baseurl)
			.post('/pos/category/update/5BZew8Fg5')
			.expect(200)
			.then((response) => {
				Expect(response.body.message).to.be.eql('Unauthorized Access!');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});
	it('Should not update as category status is not category id', function (done) {
		Request(Baseurl)
			.post('/pos/category/update/e4Zew8jse')
			.set(commonHeader)
			.then((responce) => {
				Expect(responce?.body?.message).to.be.eql('Not a valid user!');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});
});
