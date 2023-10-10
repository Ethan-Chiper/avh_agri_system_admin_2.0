const Request = require('supertest');
const Expect = require('chai').expect;
const dotenv = require('dotenv');
dotenv.config();
const mongoose = require('mongoose');
const ProductTestCaseModel = require('../TestCaseModel/ProductTestCaseModel');
const Baseurl = 'http://localhost:1507/api/store-admin';

const CommonHeader = {
	['x-consumer-username']: 'admin_zoHP@GkUR'
};

let requestData = {
	name: 'mactest',
	price: '1002',
	tax: '20'
};

describe('Create product', function () {
	this.timeout(12_000);

	before(async function () {
		await mongoose.connect('mongodb://192.168.0.108:27017/Product', {
			useNewUrlParser: true,
			useUnifiedTopology: true
		});
	});
	describe('Saving a Product', function () {
		it('Should create a product with valid request data', function (done) {
			Request(Baseurl)
				.get('/auth/generate-token')
				.then((response) => {
					let csrfToken = {['x-csrf-token']: response.body.data.csrfToken};
					Request(Baseurl)
						.post('/pos/product/create')
						.send(requestData)
						.set(CommonHeader)
						.set(csrfToken)
						.set('Cookie', response.header['set-cookie'])
						.then(async (response) => {
							try {
								Expect(response?.body?.message).to.be.eql('Pos product created successfully');
								// eslint-disable-next-line mocha/no-nested-tests
								describe('Saving a Product', function () {
									// eslint-disable-next-line mocha/no-nested-tests
									it('should save a new product to the database', async function () {
										let resultObject = new ProductTestCaseModel({
											success: response?.body?.success,
											message: response?.body?.message,
											data: {
												product_id: response?.body?.data?.product_id,
												name: response?.body?.data?.name,
												price: response?.body?.data?.price,
												tax: response?.body?.data?.tax,
												image: response?.body?.data?.image,
												mmc: response?.body?.data?.mmc,
												status: response?.body?.data?.status
											}
										});
										const savedProduct = await ProductTestCaseModel.create(resultObject);
										Expect(savedProduct).to.be.an('object');
									});
								});
							} catch (error) {
								done(error);
							}
						})
						.catch((error) => {
							done(error);
						});
				})
				.catch((error) => {
					throw error;
				});
			done();
		});
	});
	it('Should not create product value as the common header is not set.', function (done) {
		Request(Baseurl)
			.get('/auth/generate-token')
			.then((response) => {
				let csrfToken = {['x-csrf-token']: response.body.data.csrfToken};
				let invalidAdmin = {
					['x-consumer-username']: 'admin_e43r'
				};
				Request(Baseurl)
					.post('/pos/product/create')
					.set(invalidAdmin)
					.set(csrfToken)
					.set('Cookie', response.header['set-cookie'])
					.expect(401)
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
	it('Should not create any product as the common header is not set', function (done) {
		Request(Baseurl)
			.get('/auth/generate-token')
			.then((response) => {
				let csrfToken = {['x-csrf-token']: response.body.data.csrfToken};
				Request(Baseurl)
					.post('/pos/product/create')
					.expect(401)
					.set(csrfToken)
					.set('Cookie', response.header['set-cookie'])
					.then((response) => {
						Expect(response.body.message).to.be.eql('Unauthorized Access!');
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
	describe('Product name', function () {
		it('should create a product with name valid request data', function (done) {
			Request(Baseurl)
				.get('/auth/generate-token')
				.then((response) => {
					let csrfToken = {['x-csrf-token']: response.body.data.csrfToken};
					let invalidData = structuredClone(requestData);
					delete invalidData.name;
					Request(Baseurl)
						.post('/pos/product/create')
						.send(invalidData)
						.expect(400)
						.set(CommonHeader)
						.set(csrfToken)
						.set('Cookie', response.header['set-cookie'])
						.then((response) => {
							Expect(response?.body?.message).to.be.eql('please check insert value');
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
	describe('Product price', function () {
		it('should create a product with price valid request data', function (done) {
			Request(Baseurl)
				.get('/auth/generate-token')
				.then((response) => {
					let csrfToken = {['x-csrf-token']: response.body.data.csrfToken};
					let invalidData = structuredClone(requestData);
					delete invalidData.price;
					Request(Baseurl)
						.post('/pos/product/create')
						.send(invalidData)
						.expect(400)
						.set(CommonHeader)
						.set(csrfToken)
						.set('Cookie', response.header['set-cookie'])
						.then((response) => {
							Expect(response?.body?.message).to.be.eql('please check insert value');
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
	describe('Product tax', function () {
		it('should create a product with tax valid request data', function (done) {
			Request(Baseurl)
				.get('/auth/generate-token')
				.then((response) => {
					let csrfToken = {['x-csrf-token']: response.body.data.csrfToken};
					let invalidData = structuredClone(requestData);
					delete invalidData.tax;
					Request(Baseurl)
						.post('/pos/product/create')
						.send(invalidData)
						.expect(400)
						.set(CommonHeader)
						.set(csrfToken)
						.set('Cookie', response.header['set-cookie'])
						.then((response) => {
							Expect(response?.body?.message).to.be.eql('please check insert value');
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
});
