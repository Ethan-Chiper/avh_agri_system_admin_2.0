const Request = require('supertest');
const Expect = require('chai').expect;
const dotenv = require('dotenv');
dotenv.config();

const Baseurl = 'http://localhost:1507/api/store-admin';

const commonHeader = {
	['x-consumer-username']: 'admin_zoHP@GkUR'
};

let requestData = {
	name: 'soundbox',
	mcc: '1234098765',
	mdr: '14'
};

describe('Category create', function () {
	it('should create a category with valid request data', function (done) {
		Request(Baseurl)
			.post('pos/category/create')
			.send(requestData)
			.expect(200)
			.set(commonHeader)
			.then((responce) => {
				Expect(responce?.body?.message).to.be.eql('Pos Category Created Successfully');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});
	it('Should not create category value', function (done) {
		let invalidAdmin = {
			['x-consumer-username']: 'notAdmin_678'
		};
		Request(Baseurl)
			.post('/pos/category/create')
			.set(invalidAdmin)
			.expect(200)
			.then((responce) => {
				Expect(responce?.body?.message).to.be.eql('Unauthorized Access!');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});
	it('Should not create category as the common header is not set.', function (done) {
		Request(Baseurl)
			.get('/pos/category/create')
			.expect(200)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Unauthorized Access!');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});
	describe('Category name', function () {
		it('should create a category with name valid request data', function (done) {
			let invalidData = requestData;
			delete invalidData.name;
			Request(Baseurl)
				.post('pos/category/create')
				.send(invalidData)
				.expect(200)
				.set(commonHeader)
				.then((responce) => {
					Expect(responce?.body?.message).to.be.eql('please provide category name');
					done();
				})
				.catch((error) => {
					done(error);
				});
		});
	});
	describe('Category mcc', function () {
		it('should create a category with mcc valid request data', function (done) {
			let invalidData = structuredClone(requestData);
			delete invalidData.mcc;
			Request(Baseurl)
				.post('pos/category/create')
				.send(invalidData)
				.expect(200)
				.set(commonHeader)
				.then((responce) => {
					Expect(responce?.body?.message).to.be.eql('please provide category mcc');
					done();
				})
				.catch((error) => {
					done(error);
				});
		});
	});
	describe('Category mdr', function () {
		it('should create a category with mdr valid request data', function (done) {
			let invalidData = structuredClone(requestData);
			delete invalidData.mdr;
			Request(Baseurl)
				.post('pos/category/create')
				.send(invalidData)
				.expect(200)
				.set(commonHeader)
				.then((responce) => {
					Expect(responce?.body?.message).to.be.eql('please provide category mdr');
					done();
				})
				.catch((error) => {
					done(error);
				});
		});
	});
});
