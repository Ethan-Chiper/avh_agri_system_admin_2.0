const Request = require('supertest');
const Expect = require('chai').expect;
const dotenv = require('dotenv');
dotenv.config();

const Baseurl = 'http://localhost:1507/api/store-admin';

const CommonHeader = {
	['x-consumer-username']: 'admin_zoHP@GkUR'
};

describe('Product status update', function () {
	it('Should update status', function (done) {
		Request(Baseurl)
			.post('pos/product/change-status/amDzg33oE')
			.set(CommonHeader)
			.expect(200)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Product status changed successfully');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});
	it('Should not update as product status is not admin id', function (done) {
		let invalidAdmin = {
			['x-consumer-username']: 'notAdmin_hdee2is8'
		};
		Request(Baseurl)
			.post('/pos/product/change-status/amDzg33oE')
			.set(invalidAdmin)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Unauthorized Access!');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});
	it('Should not view any product as the common header is not set', function (done) {
		Request(Baseurl)
			.post('/pos/product/change-status/amDzg33oE')
			.expect(200)
			.then((response) => {
				Expect(response.body.message).to.be.eql('Unauthorized Access!');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});
	it('Should not update as product status is nod product id', function (done) {
		Request(Baseurl)
			.post('/pos/product/change-status/dfh654')
			.set(CommonHeader)
			.expect(200)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Not a valid user');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});
});
