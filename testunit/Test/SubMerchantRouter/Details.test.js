const Request = require('supertest');
const Expect = require('chai').expect;
const dotenv = require('dotenv');
dotenv.config();

const BaseUrl = 'http://localhost:1507';
const CommonHeader = {
	['x-consumer-username']: 'admin_zoHP@GkUR'
};

const SubMerchantId = {
	valid: 'xj@fTCYeN',
	invalid: 'tyjkfgh'
};

describe('Fetch Details of SubMerchant', function () {
	it('1. must not give details when correct UserRole and incorrect UserId given', function (done) {
		let headers = Object.assign({}, CommonHeader);
		headers['x-consumer-username'] = 'admin_zoHP@GR';
		Request(BaseUrl)
			.get(`/api/store-admin/sub-merchant/details/${SubMerchantId.valid}`)
			.set(headers)
			.then((response) => {
				Expect(response.body.message).to.be.eql('Not a valid user!');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});
	it('2. must not give details when incorrect UserRole and correct UserId given', function (done) {
		let headers = Object.assign({}, CommonHeader);
		headers['x-consumer-username'] = 'wrongrole_zoHP@GKUR';

		Request(BaseUrl)
			.get(`/api/store-admin/sub-merchant/details/${SubMerchantId.valid}`)
			.set(headers)
			.then((response) => {
				Expect(response.body.message).to.be.eql('Not a valid user');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('3. Should not give details when no UserRole and UserId given', function (done) {
		Request(BaseUrl)
			.get(`/api/store-admin/sub-merchant/details/${SubMerchantId.valid}`)
			.then((response) => {
				Expect(response.body.message).to.be.eql('Unauthorized Access!');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('4. Should not give details when invalid SubMerchantId provided ', function (done) {
		Request(BaseUrl)
			.get(`/api/store-admin/sub-merchant/details/${SubMerchantId.invalid}`)
			.set(CommonHeader)
			.then((response) => {
				Expect(response.body.success).to.be.false;
				//Expect(response.body.message).to.be.eql('Merchant Not Found!');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('5. Must fetch details when valid SubMerchantId provided ', function (done) {
		Request(BaseUrl)
			.get(`/api/store-admin/sub-merchant/details/${SubMerchantId.valid}`)
			.set(CommonHeader)
			.then((response) => {
				//Expect(response.body.success).to.be.true;
				Expect(response.body.message).to.be.eql('SubMerchants list are');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('6. Should not fetch as the submerchantId is not provided.', function (done) {
		Request(BaseUrl)
			.get('/sub-merchant/details')
			.expect(404)
			.set(CommonHeader)
			.then((response) => {
				Expect(response?.res?.statusMessage).to.be.eql('Not Found');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});
});
