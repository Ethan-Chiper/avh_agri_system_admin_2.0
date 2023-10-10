const Request = require('supertest');
const Expect = require('chai').expect;
const dotenv = require('dotenv');
dotenv.config();

const BaseUrl = 'http://localhost:1507';

const CommonHeader = {
	['x-consumer-username']: 'admin_zoHP@GkUR'
};

const MerchantId = {
	valid: 'MqakJjLkg',
	invalid: 'MqajLkg'
};

const StoreId = {
	valid: 'MqakJjLkg',
	invalid: 'Nb0fpth'
};

describe('VPA List ', function () {
	it('Should not fetch list when no UserRole and UserId given', function (done) {
		Request(BaseUrl)
			.get(`/api/store-admin/vpa/list/${MerchantId.valid}`)
			.then((response) => {
				Expect(response.body.message).to.be.eql('Unauthorized Access!');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('Should not fetch list when no UserRole and UserId given with StoreId', function (done) {
		Request(BaseUrl)
			.get(`/api/store-admin/vpa/list/${MerchantId.valid}/${StoreId.valid}`)
			.then((response) => {
				Expect(response.body.message).to.be.eql('Unauthorized Access!');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('Should not fetch list when correct UserRole and incorrect UserId given', function (done) {
		let headers = {...CommonHeader};
		headers['x-consumer-username'] = 'admin_zoHPrRdUR';
		Request(BaseUrl)
			.get(`/api/store-admin/vpa/list/${MerchantId.valid}`)
			.set(headers)
			.then((response) => {
				Expect(response.body.message).to.be.eql('Not a valid user!');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('Should not fetch list when correct UserRole and incorrect UserId given with StoreId', function (done) {
		let headers = {...CommonHeader};
		headers['x-consumer-username'] = 'admin_zoHPrRdUR';
		Request(BaseUrl)
			.get(`/api/store-admin/vpa/list/${MerchantId.valid}/${StoreId.valid}`)
			.set(headers)
			.then((response) => {
				Expect(response.body.message).to.be.eql('Not a valid user!');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('Should not fetch list when incorrect UserRole and correct UserId given', function (done) {
		let headers = {...CommonHeader};
		headers['x-consumer-username'] = 'wrongrole_zoHP@GKUR';

		Request(BaseUrl)
			.get(`/api/store-admin/vpa/list/${MerchantId.valid}`)
			.set(headers)
			.then((response) => {
				Expect(response.body.message).to.be.eql('Not a valid user');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('Should not fetch list when incorrect UserRole and correct UserId given with StoreId', function (done) {
		let headers = {...CommonHeader};
		headers['x-consumer-username'] = 'wrongrole_zoHP@GKUR';

		Request(BaseUrl)
			.get(`/api/store-admin/vpa/list/${MerchantId.valid}/${StoreId.valid}`)
			.set(headers)
			.then((response) => {
				Expect(response.body.message).to.be.eql('Not a valid user');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('should return the vpa list for a valid merchantId, UserId and UserRole without StoreId', function (done) {
		Request(BaseUrl)
			.get(`/api/store-admin/vpa/list/${MerchantId.valid}`)
			.set(CommonHeader)
			.then((response) => {
				Expect(response?.body?.success).to.be.true;
				Expect(response?.body?.message).to.be.eql('Vpa List.');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('should return the vpa list for a valid merchantId, UserId and UserRole with StoreId', function (done) {
		Request(BaseUrl)
			.get(`/api/store-admin/vpa/list/${MerchantId.valid}/${StoreId.valid}`)
			.set(CommonHeader)
			.then((response) => {
				Expect(response?.body?.success).to.be.true;
				Expect(response?.body?.message).to.be.eql('Vpa List.');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('should return an error message for an invalid merchantId but correct UserRole and Id', function (done) {
		Request(BaseUrl)
			.get(`/api/store-admin/vpa/list/${MerchantId.invalid}`)
			.set(CommonHeader)
			.then((response) => {
				Expect(response?.body?.success).to.be.false;
				Expect(response?.body?.message).to.be.eql('Merchant Not Found!');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('should return an error message for an valid merchantId but invalid StoreId', function (done) {
		Request(BaseUrl)
			.get(`/api/store-admin/vpa/list/${MerchantId.invalid}/${StoreId.invalid}`)
			.set(CommonHeader)
			.then((response) => {
				Expect(response?.body?.success).to.be.false;
				Expect(response?.body?.message).to.be.eql('Store Not Found!');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it(' Should not give list as the merchantId is not provided.', function (done) {
		Request(BaseUrl)
			.post('/vpa/list')
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
