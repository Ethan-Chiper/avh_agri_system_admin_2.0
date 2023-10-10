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
	invalid: 'O0Wz62ad'
};

const bankData = {
	merchant_id: 'NbFx0fpPq',
	acc_no: '50100605138583',
	acc_holder_name: 'Nitheswari N',
	ifsc: 'HDFC0001858'
};

describe('Create Beneficiary for Merchant ', function () {
	it('should create bank account when valid data and id are provided', function (done) {
		Request(BaseUrl)
			.get('/api/store-admin/auth/generate-token')
			.then((response) => {
				let csrfToken = {['x-csrf-token']: response.body.data.csrfToken};
				Request(BaseUrl)
					.post(`/api/store-admin/bank/create/${MerchantId.valid}`)
					.send(bankData)
					.set(CommonHeader)
					.set(csrfToken)
					.set('Cookie', response.header['set-cookie'])
					.then((response) => {
						Expect(response?.body?.message).to.be.eql('Bank account created successfully');
						Expect(response?.body?.success).to.be.true;
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
	//already exist
	it('must not  create when account already exist ', function (done) {
		Request(BaseUrl)
			.get('/api/store-admin/auth/generate-token')
			.then((response) => {
				let csrfToken = {['x-csrf-token']: response.body.data.csrfToken};
				Request(BaseUrl)
					.post(`/api/store-admin/bank/create/${MerchantId.valid}`)
					.send(bankData)
					.set(CommonHeader)
					.set(csrfToken)
					.set('Cookie', response.header['set-cookie'])
					.then((response) => {
						Expect(response?.body?.success).to.be.false;
						Expect(response?.body?.message).to.be.eql('Bank account already exist.');
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

	it('when given valid data but invalid merchantId ', function (done) {
		Request(BaseUrl)
			.get('/api/store-admin/auth/generate-token')
			.then((response) => {
				let csrfToken = {['x-csrf-token']: response.body.data.csrfToken};
				Request(BaseUrl)
					.post(`/api/store-admin/bank/create/${MerchantId.invalid}`)
					.send(bankData)
					.set(CommonHeader)
					.set(csrfToken)
					.set('Cookie', response.header['set-cookie'])
					.then((response) => {
						Expect(response?.body?.message).to.be.eql('Merchant Not Found!');
						Expect(response?.body?.success).to.be.false;
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

	it('should not create when account number is not provided', function (done) {
		const invalidData = {...bankData};
		delete invalidData.acc_no;
		Request(BaseUrl)
			.get('/api/store-admin/auth/generate-token')
			.then((response) => {
				let csrfToken = {['x-csrf-token']: response.body.data.csrfToken};
				Request(BaseUrl)
					.post(`/api/store-admin/bank/create/${MerchantId.valid}`)
					.send(invalidData)
					.set(CommonHeader)
					.set(csrfToken)
					.set('Cookie', response.header['set-cookie'])
					.then((response) => {
						Expect(response?.body?.message).to.be.eql('must be a valid bank account number');
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

	it('should not create when account holder name is not provided', function (done) {
		const invalidData = {...bankData};
		delete invalidData.acc_holder_name;
		Request(BaseUrl)
			.get('/api/store-admin/auth/generate-token')
			.then((response) => {
				let csrfToken = {['x-csrf-token']: response.body.data.csrfToken};
				Request(BaseUrl)
					.post(`/api/store-admin/bank/create/${MerchantId.valid}`)
					.send(invalidData)
					.set(CommonHeader)
					.set(csrfToken)
					.set('Cookie', response.header['set-cookie'])
					.then((response) => {
						Expect(response?.body?.message).to.be.eql('must be a valid bank account holder name');
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

	it('should not create when ifsc code is not provided', function (done) {
		const invalidData = {...bankData};
		delete invalidData.ifsc;
		Request(BaseUrl)
			.get('/api/store-admin/auth/generate-token')
			.then((response) => {
				let csrfToken = {['x-csrf-token']: response.body.data.csrfToken};
				Request(BaseUrl)
					.post(`/api/store-admin/bank/create/${MerchantId.valid}`)
					.send(invalidData)
					.set(CommonHeader)
					.set(csrfToken)
					.set('Cookie', response.header['set-cookie'])
					.then((response) => {
						Expect(response?.body?.message).to.be.eql('must provide ifsc or provide valid ifsc');
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

	it('should return error when IFSC code is invalid', function (done) {
		const invalidData = {...bankData};
		invalidData.ifsc = 'KLL124400';
		Request(BaseUrl)
			.get('/api/store-admin/auth/generate-token')
			.then((response) => {
				let csrfToken = {['x-csrf-token']: response.body.data.csrfToken};
				Request(BaseUrl)
					.post(`/api/store-admin/bank/create/${MerchantId.valid}`)
					.set(CommonHeader)
					.send(invalidData)
					.set(csrfToken)
					.set('Cookie', response.header['set-cookie'])
					.then((response) => {
						Expect(response?.body?.message).to.be.eql('Not Valid Ifsc');
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

	it('should not create when ifsc code is empty ', function (done) {
		const invalidData = {...bankData};
		invalidData.ifsc = '';
		Request(BaseUrl)
			.get('/api/store-admin/auth/generate-token')
			.then((response) => {
				let csrfToken = {['x-csrf-token']: response.body.data.csrfToken};
				Request(BaseUrl)
					.post(`/api/store-admin/bank/create/${MerchantId.valid}`)
					.send(invalidData)
					.set(CommonHeader)
					.set(csrfToken)
					.set('Cookie', response.header['set-cookie'])
					.then((response) => {
						Expect(response?.body?.message).to.be.eql('must provide ifsc or provide valid ifsc');
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

	it('should not create when ifsc code is whiteSpace ', function (done) {
		const invalidData = {...bankData};
		invalidData.ifsc = ' ';
		Request(BaseUrl)
			.get('/api/store-admin/auth/generate-token')
			.then((response) => {
				let csrfToken = {['x-csrf-token']: response.body.data.csrfToken};
				Request(BaseUrl)
					.post(`/api/store-admin/bank/create/${MerchantId.valid}`)
					.send(invalidData)
					.set(CommonHeader)
					.set(csrfToken)
					.set('Cookie', response.header['set-cookie'])
					.then((response) => {
						Expect(response?.body?.message).to.be.eql('must provide ifsc or provide valid ifsc');
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

	it('should not create when account holder name is empty', function (done) {
		const invalidData = {...bankData};
		invalidData.acc_holder_name = '';
		Request(BaseUrl)
			.get('/api/store-admin/auth/generate-token')
			.then((response) => {
				let csrfToken = {['x-csrf-token']: response.body.data.csrfToken};
				Request(BaseUrl)
					.post(`/api/store-admin/bank/create/${MerchantId.valid}`)
					.send(invalidData)
					.set(CommonHeader)
					.set(csrfToken)
					.set('Cookie', response.header['set-cookie'])
					.then((response) => {
						Expect(response?.body?.message).to.be.eql('must be a valid bank account holder name');
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

	it('should not create when account holder name is just whiteSpace', function (done) {
		const invalidData = {...bankData};
		invalidData.acc_holder_name = ' ';
		Request(BaseUrl)
			.get('/api/store-admin/auth/generate-token')
			.then((response) => {
				let csrfToken = {['x-csrf-token']: response.body.data.csrfToken};
				Request(BaseUrl)
					.post(`/api/store-admin/bank/create/${MerchantId.valid}`)
					.send(invalidData)
					.set(csrfToken)
					.set('Cookie', response.header['set-cookie'])
					.set(CommonHeader)
					.then((response) => {
						Expect(response?.body?.message).to.be.eql('must be a valid bank account holder name');
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

	it('should not create when account number is empty', function (done) {
		const invalidData = {...bankData};
		invalidData.acc_no = '';
		Request(BaseUrl)
			.get('/api/store-admin/auth/generate-token')
			.then((response) => {
				let csrfToken = {['x-csrf-token']: response.body.data.csrfToken};
				Request(BaseUrl)
					.post(`/api/store-admin/bank/create/${MerchantId.valid}`)
					.send(invalidData)
					.set(csrfToken)
					.set('Cookie', response.header['set-cookie'])
					.set(CommonHeader)
					.then((response) => {
						Expect(response?.body?.message).to.be.eql('must be a valid bank account number');
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

	it('should not create when account number is whiteSpace', function (done) {
		const invalidData = {...bankData};
		invalidData.acc_no = ' ';
		Request(BaseUrl)
			.get('/api/store-admin/auth/generate-token')
			.then((response) => {
				let csrfToken = {['x-csrf-token']: response.body.data.csrfToken};
				Request(BaseUrl)
					.post(`/api/store-admin/bank/create/${MerchantId.valid}`)
					.send(invalidData)
					.set(csrfToken)
					.set('Cookie', response.header['set-cookie'])
					.set(CommonHeader)
					.then((response) => {
						Expect(response?.body?.message).to.be.eql('must be a valid bank account number');
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

	it('Should not create  when no UserRole and UserId given', function (done) {
		Request(BaseUrl)
			.get('/api/store-admin/auth/generate-token')
			.then((response) => {
				let csrfToken = {['x-csrf-token']: response.body.data.csrfToken};
				Request(BaseUrl)
					.post(`/api/store-admin/bank/create/${MerchantId.valid}`)
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

	it('must not create when incorrect UserRole and correct UserId given', function (done) {
		const headers = {...CommonHeader};
		headers['x-consumer-username'] = 'wrongrole_zoHP@GKUR';
		Request(BaseUrl)
			.get('/api/store-admin/auth/generate-token')
			.then((response) => {
				let csrfToken = {['x-csrf-token']: response.body.data.csrfToken};

				Request(BaseUrl)
					.post(`/api/store-admin/bank/create/${MerchantId.valid}`)
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

	it('must  not create when correct UserRole and incorrect UserId given', function (done) {
		const headers = {...CommonHeader};
		headers['x-consumer-username'] = 'admin_zoHP@GR';
		Request(BaseUrl)
			.get('/api/store-admin/auth/generate-token')
			.then((response) => {
				let csrfToken = {['x-csrf-token']: response.body.data.csrfToken};
				Request(BaseUrl)
					.post(`/api/store-admin/bank/create/${MerchantId.valid}`)
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

	it('Should not create as the merchantId not provided.', function (done) {
		Request(BaseUrl)
			.get('/api/store-admin/auth/generate-token')
			.then((response) => {
				let csrfToken = {['x-csrf-token']: response.body.data.csrfToken};
				Request(BaseUrl)
					.post('/api/store-admin/bank/create')
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

	it(' Should not update as the request body data is not given.', function (done) {
		Request(BaseUrl)
			.get('/api/store-admin/auth/generate-token')
			.then((response) => {
				let csrfToken = {['x-csrf-token']: response.body.data.csrfToken};
				Request(BaseUrl)
					.post(`/api/store-admin/bank/create/${MerchantId.valid}`)
					.set(CommonHeader)
					.set(csrfToken)
					.set('Cookie', response.header['set-cookie'])
					.then((response) => {
						Expect(response?.body?.message).to.be.eql('must be a valid merchantId');
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
