const Request = require('supertest');
const Expect = require('chai').expect;
const dotenv = require('dotenv');
dotenv.config();

const BaseUrl = 'http://localhost:1507';

const CommonHeader = {
	['x-consumer-username']: 'admin_zoHP@GkUR'
};

const MerchantId = {
	valid: 'voZmSx3vC',
	invalid: 'NbFx0fp'
};

describe('Bank List ', function () {
	it('should return the bank list for a valid merchantId, UserId and valid UserRole', function (done) {
		Request(BaseUrl)
			.get('/api/store-admin/auth/generate-token')
			.then((response) => {
				let csrfToken = {['x-csrf-token']: response.body.data.csrfToken};
				Request(BaseUrl)
					.get(`/api/store-admin/bank/list/${MerchantId.valid}`)
					.set(CommonHeader)
					.set(csrfToken)
					.set('Cookie', response.header['set-cookie'])
					.then((response) => {
						Expect(response?.body?.success).to.be.true;
						Expect(response?.body?.message).to.be.eql('Beneficiary list.');
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

	it('should return an error message for an invalid merchantId but correct UserRole and Id', function (done) {
		Request(BaseUrl)
			.get('/api/store-admin/auth/generate-token')
			.then((response) => {
				let csrfToken = {['x-csrf-token']: response.body.data.csrfToken};
				Request(BaseUrl)
					.get(`/api/store-admin/bank/list/ ${MerchantId.invalid}`)
					.set(CommonHeader)
					.set(csrfToken)
					.set('Cookie', response.header['set-cookie'])
					.then((response) => {
						Expect(response?.body?.success).to.be.false;
						Expect(response?.body?.message).to.be.eql('Merchant Not Found!');
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
	it('Should not fetch list when no UserRole and UserId given', function (done) {
		Request(BaseUrl)
			.get('/api/store-admin/auth/generate-token')
			.then((response) => {
				let csrfToken = {['x-csrf-token']: response.body.data.csrfToken};

				Request(BaseUrl)
					.get(`/api/store-admin/bank/list/${MerchantId.valid}`)
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

	it('Should not fetch list when incorrect UserRole and correct UserId given', function (done) {
		let headers = Object.assign({}, CommonHeader);
		headers['x-consumer-username'] = 'wrongrole_zoHP@GKUR';
		Request(BaseUrl)
			.get('/api/store-admin/auth/generate-token')
			.then((response) => {
				let csrfToken = {['x-csrf-token']: response.body.data.csrfToken};

				Request(BaseUrl)
					.get(`/api/store-admin/bank/list/${MerchantId.valid}`)
					.set(headers)
					.set(csrfToken)
					.set('Cookie', response.header['set-cookie'])
					.then((response) => {
						Expect(response.body.message).to.be.eql('Not a valid user');
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

	it('Should not fetch list when correct UserRole and incorrect UserId given', function (done) {
		let headers = {...CommonHeader};
		headers['x-consumer-username'] = 'admin_zoHP@GR';
		Request(BaseUrl)
			.get('/api/store-admin/auth/generate-token')
			.then((response) => {
				let csrfToken = {['x-csrf-token']: response.body.data.csrfToken};
				Request(BaseUrl)
					.get(`/api/store-admin/bank/list/${MerchantId.valid}`)
					.set(headers)
					.set(csrfToken)
					.set('Cookie', response.header['set-cookie'])
					.then((response) => {
						Expect(response.body.message).to.be.eql('Not a valid user!');
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

	it('should return the bank list under a given valid merchantId with limit and phone number filter', function (done) {
		Request(BaseUrl)
			.get('/api/store-admin/auth/generate-token')
			.then((response) => {
				let csrfToken = {['x-csrf-token']: response.body.data.csrfToken};

				Request(BaseUrl)
					.get(`/api/store-admin/bank/list/${MerchantId.valid}`)
					.query({limit: 10, phone: '7812059404'})
					.set(CommonHeader)
					.set(csrfToken)
					.set('Cookie', response.header['set-cookie'])
					.then((response) => {
						Expect(response.body.success).to.be.true;
						Expect(response.body.message).to.be.eql('Beneficiary list.');
						//Expect(response.body.data).to.be.an('array').to.have.lengthOf.at.most(10);
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

	it('should return the bank list without merchantId with limit and page filter', function (done) {
		Request(BaseUrl)
			.get('/api/store-admin/auth/generate-token')
			.then((response) => {
				let csrfToken = {['x-csrf-token']: response.body.data.csrfToken};
				Request(BaseUrl)
					.get('/api/store-admin/bank/list')
					.query({limit: 10, page: 2})
					.set(CommonHeader)
					.set(csrfToken)
					.set('Cookie', response.header['set-cookie'])
					.then((response) => {
						Expect(response.body.success).to.be.true;
						Expect(response.body.message).to.be.eql('Beneficiary list.');
						//Expect(response.body.data).to.be.an('array').to.have.lengthOf.at.most(10);
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

	it('should return an error when no matching data found', function (done) {
		Request(BaseUrl)
			.get('/api/store-admin/auth/generate-token')
			.then((response) => {
				let csrfToken = {['x-csrf-token']: response.body.data.csrfToken};
				Request(BaseUrl)
					.get('/api/store-admin/bank/list')
					.query({phone: '0000000000'})
					.set(CommonHeader)
					.set(csrfToken)
					.set('Cookie', response.header['set-cookie'])
					.then((response) => {
						Expect(response.body.success).to.be.false;
						//Expect(response.body.message).to.be.eql('Could not fetch bank list');
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

	it('should return the bank list with query parameters', function (done) {
		Request(BaseUrl)
			.get('/api/store-admin/auth/generate-token')
			.then((response) => {
				let csrfToken = {['x-csrf-token']: response.body.data.csrfToken};

				Request(BaseUrl)
					.get('/api/store-admin/bank/list?merchantId=voZmSx3vC&page=1&limit=10&phone=7812059404')
					.set(CommonHeader)
					.set(csrfToken)
					.set('Cookie', response.header['set-cookie'])
					.then((response) => {
						Expect(response?.body?.success).to.be.true;
						//Expect(response?.body?.message).to.be.eql('Beneficiary list.');
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

	it(' Should not fetch  as  invalid URL provided.', function (done) {
		Request(BaseUrl)
			.get('/api/store-admin/auth/generate-token')
			.then((response) => {
				let csrfToken = {['x-csrf-token']: response.body.data.csrfToken};

				Request(BaseUrl)
					.get('/api/sub-merchant')
					.expect(404)
					.set(CommonHeader)
					.set(csrfToken)
					.set('Cookie', response.header['set-cookie'])
					.then((response) => {
						Expect(response?.res?.statusMessage).to.be.eql('Not Found');
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
