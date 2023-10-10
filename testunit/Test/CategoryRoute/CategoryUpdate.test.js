const Request = require('supertest');
const Expect = require('chai').expect;
const dotenv = require('dotenv');
dotenv.config();

const Baseurl = 'http://localhost:1507/api/store-admin';

const commonHeader = {
	['x-consumer-username']: 'admin_zoHP@GkUR'
};

let requestData = {
	name: 'test books',
	mcc: '876056',
	mdr: {}
};

describe('Update category', function () {
	it('should update a category date', function (done) {
		Request(Baseurl)
			.post('/pos/category/update/5BZew8Fg5')
			.send(requestData)
			.expect(200)
			.set(commonHeader)
			.then((responce) => {
				Expect(responce?.body?.message).to.be.eql('Pos Category Updated Successfully');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});
	it('Should not update as category value is not admin id', function (done) {
		let invalidAdmin = {
			['x-consumer-username']: 'notAdmin_2521678'
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
	it('Should not update as category value is not category id', function (done) {
		Request(Baseurl)
			.post('/pos/category/update/e4Zew8jse')
			.set(commonHeader)
			.then((responce) => {
				Expect(responce?.body?.message).to.be.eql('Unauthorized Access!');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});
});
