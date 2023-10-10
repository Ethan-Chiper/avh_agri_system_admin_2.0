const Request = require('supertest');
const Expect = require('chai').expect;
const dotenv = require('dotenv');
dotenv.config();

const BaseUrl = 'http://localhost:1507/api/store-admin';

let requestData = {
	store_category: 'Agricultural co-operatives',
	category_code: '0763',
	store_subCategory: 'Agricultural co-operatives'
};

let commonHeader = {
	['x-consumer-username']: 'admin_zoHP@GkUR'
};

describe('Update Category', function () {
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
	it('1.Should create a update phone with valid request data', function (done) {
		Request(BaseUrl)
			.patch('/qc/merchant/update-category/Fp$KvIwjI')
			.send(requestData)
			.expect(200)
			.set(commonHeader)
			.then((responce) => {
				Expect(responce?.body?.message).to.be.eql('Category Updated successfully!');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('2.Should not view any soundbox as the common header is not set', function (done) {
		Request(BaseUrl)
			.patch('/qc/merchant/update-category/Fp$KvIwjI')
			.expect(406)
			.then((response) => {
				Expect(response.body.message).to.be.eql('Wrong CSRF Token');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('3.Should update category with valid request data', function (done) {
		delete requestData.category_code;
		Request(BaseUrl)
			.patch('/qc/merchant/update-category/Fp$KvIwjI')
			.send(requestData)
			.expect(400)
			.set(commonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Please provide category code.');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});
});
