const Request = require('supertest');
const Expect = require('chai').expect;
const dotenv = require('dotenv');
dotenv.config();

const Baseurl = 'http://localhost:1507/api/store-admin';

const CommonHeader = {
	['x-consumer-username']: 'admin_zoHP@GkUR'
};

let requestData = {
	name: 'Android',
	price: '5000',
	tax: '20',
	image: 'test',
	mcc: 'test-mcc'
};
describe('product update', function () {
	it('Should update a product data', function (done) {
		Request(Baseurl)
			.post('/pos/product/update/amDzg33oE')
			.send(requestData)
			.expect(200)
			.set(CommonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Pos product updated successfully');
				done();
			});
	});
	it('Should not update as product value is not admin id', function (done) {
		let invalidAdmin = {
			['x-consumer-username']: 'notAdmin_1678'
		};
		Request(Baseurl)
			.post('/pos/product/update/5BZew8Fg5')
			.set(invalidAdmin)
			.then((responce) => {
				Expect(responce?.body?.message).to.be.eql('Unauthorized Access!');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});
	it('Should not update any product as the common header is not set', function (done) {
		Request(Baseurl)
			.post('/pos/product/update/5w8Fg5')
			.expect(200)
			.then((response) => {
				Expect(response.body.message).to.be.eql('Unauthorized Access!');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});
	it('Should not update as product value is not product id', function (done) {
		Request(Baseurl)
			.post('/pos/product/update/e4Zse')
			.set(CommonHeader)
			.then((responce) => {
				Expect(responce?.body?.message).to.be.eql('Unauthorized Access!');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});
});
