const Request = require('supertest');
const Expect = require('chai').expect;
const dotenv = require('dotenv');
dotenv.config();

const BaseUrl = 'http://localhost:1507';
const CommonHeader = {
	['x-consumer-username']: 'admin_zoHP@GkUR'
};

let validData = {
	store_id: 'voZmSx3vC',
	beneficiary_id: 'bene_AkMOshGgh',
	vpa_name: 'Sanjay TEST 15',
	submer_type: 'p2pm'
};

const MerchantId = {
	valid: 'voZmSx3vC',
	invalid: 'tyjkfgh'
};
describe(' Create Vpa for Given Beneficiary Id ', function () {
	before(function (done) {
		Request(BaseUrl)
			.get('/api/store-admin/auth/generate-token')
			.expect(200)
			.then((response) => {
				CommonHeader['x-csrf-token'] = response.body.data.csrfToken;
				CommonHeader['Cookie'] = response.header['set-cookie'];
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('1. must  not create when correct UserRole and incorrect UserId given', function (done) {
		let headers = Object.assign({}, CommonHeader);
		headers['x-consumer-username'] = 'admin_zoHP@GR';
		Request(BaseUrl)
			.post(`/api/store-admin/vpa/create/${MerchantId.valid}`)
			.set(headers)
			.send(validData)
			.then((response) => {
				Expect(response.body.message).to.be.eql('Not a valid user!');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});
	it('2. must not create when incorrect UserRole and correct UserId given', function (done) {
		let headers = Object.assign({}, CommonHeader);
		headers['x-consumer-username'] = 'wrongrole_zoHP@GKUR';

		Request(BaseUrl)
			.post(`/api/store-admin/vpa/create/${MerchantId.valid}`)
			.set(headers)
			.send(validData)
			.then((response) => {
				Expect(response.body.message).to.be.eql('Not a valid user');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('3. Should not create  when no UserRole and UserId given', function (done) {
		const Headers = Object.assign({}, CommonHeader);
		delete Headers['x-consumer-username'];
		Request(BaseUrl)
			.post(`/api/store-admin/vpa/create/${MerchantId.valid}`)
			.send(validData)
			.set(Headers)
			.then((response) => {
				Expect(response.body.message).to.be.eql('Unauthorized Access!');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('4. Should not create  when  Invalid MerchantId given', function (done) {
		Request(BaseUrl)
			.post(`/api/store-admin/vpa/create/${MerchantId.invalid}`)
			.set(CommonHeader)
			.send(validData)
			.then((response) => {
				Expect(response.body.message).to.be.eql('Merchant Not Found!');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('5. Should  create  when all valid inputs given', function (done) {
		Request(BaseUrl)
			.post(`/api/store-admin/vpa/create/${MerchantId.valid}`)
			.set(CommonHeader)
			.send(validData)
			.then((response) => {
				//Expect(response?.body?.message).to.be.eql('VPA created')
				Expect(response?.body?.success).to.be.true;
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('6. Should not create  when request body not given', function (done) {
		Request(BaseUrl)
			.post(`/api/store-admin/vpa/create/${MerchantId.valid}`)
			.set(CommonHeader)
			.then((response) => {
				Expect(response.body.message).to.be.eql('Please provide VPA name.');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('7. Should not create as the merchantId is not provided.', function (done) {
		Request(BaseUrl)
			.post('/vpa/create')
			.expect(404)
			.set(CommonHeader)
			.send(validData)
			.then((response) => {
				Expect(response?.res?.statusMessage).to.be.eql('Not Found');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('8. Should not create  when vpa_name  not given', function (done) {
		const invalidData = {...validData};
		delete invalidData.vpa_name;
		Request(BaseUrl)
			.post(`/api/store-admin/vpa/create/${MerchantId.valid}`)
			.set(CommonHeader)
			.send(invalidData)
			.then((response) => {
				Expect(response.body.message).to.be.eql('Please provide VPA name.');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('9. Should not create  when vpa_name  given empty', function (done) {
		const invalidData = {...validData};
		invalidData.vpa_name = '';
		Request(BaseUrl)
			.post(`/api/store-admin/vpa/create/${MerchantId.valid}`)
			.set(CommonHeader)
			.send(invalidData)
			.then((response) => {
				Expect(response.body.message).to.be.eql('Please provide VPA name.');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('10. Should not create  when vpa_name  given as whitespace', function (done) {
		const invalidData = {...validData};
		invalidData.vpa_name = '    ';
		Request(BaseUrl)
			.post(`/api/store-admin/vpa/create/${MerchantId.valid}`)
			.set(CommonHeader)
			.send(invalidData)
			.then((response) => {
				Expect(response.body.message).to.be.eql('Please provide VPA name.');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('11. Should not create  when store_id  not given', function (done) {
		const invalidData = {...validData};
		delete invalidData.store_id;
		Request(BaseUrl)
			.post(`/api/store-admin/vpa/create/${MerchantId.valid}`)
			.set(CommonHeader)
			.send(invalidData)
			.then((response) => {
				Expect(response.body.message).to.be.eql('Please provide store.');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('12. Should not create  when storeid  given empty', function (done) {
		const invalidData = {...validData};
		invalidData.store_id = '';
		Request(BaseUrl)
			.post(`/api/store-admin/vpa/create/${MerchantId.valid}`)
			.set(CommonHeader)
			.send(invalidData)
			.then((response) => {
				Expect(response.body.message).to.be.eql('Please provide store.');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('13. Should not create  when storeId  given as whitespace', function (done) {
		const invalidData = {...validData};
		invalidData.store_id = '  ';
		Request(BaseUrl)
			.post(`/api/store-admin/vpa/create/${MerchantId.valid}`)
			.set(CommonHeader)
			.send(invalidData)
			.then((response) => {
				Expect(response.body.message).to.be.eql('Please provide store.');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('14. Should not create  when invalid storeId  given ', function (done) {
		const invalidData = {...validData};
		invalidData.store_id = 'vfea4234';
		Request(BaseUrl)
			.post(`/api/store-admin/vpa/create/${MerchantId.valid}`)
			.set(CommonHeader)
			.send(invalidData)
			.then((response) => {
				Expect(response.body.message).to.be.eql('Store Not Found!');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('15. Should not create when beneficiaryId not given', function (done) {
		const invalidData = {...validData};
		delete invalidData.beneficiary_id;
		Request(BaseUrl)
			.post(`/api/store-admin/vpa/create/${MerchantId.valid}`)
			.set(CommonHeader)
			.send(invalidData)
			.then((response) => {
				Expect(response.body.message).to.be.eql('Please provide beneficiary.');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('16. Should not create when beneficiaryId given empty', function (done) {
		const invalidData = {...validData};
		invalidData.beneficiary_id = '';
		Request(BaseUrl)
			.post(`/api/store-admin/vpa/create/${MerchantId.valid}`)
			.set(CommonHeader)
			.send(invalidData)
			.then((response) => {
				Expect(response.body.message).to.be.eql('Please provide beneficiary.');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('17. Should not create when beneficiaryId given as whitespace', function (done) {
		const invalidData = {...validData};
		invalidData.beneficiary_id = '  ';
		Request(BaseUrl)
			.post(`/api/store-admin/vpa/create/${MerchantId.valid}`)
			.set(CommonHeader)
			.send(invalidData)
			.then((response) => {
				Expect(response.body.message).to.be.eql('Please provide beneficiary.');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('18. Should not create when submer_type not given', function (done) {
		const invalidData = {...validData};
		delete invalidData.submer_type;
		Request(BaseUrl)
			.post(`/api/store-admin/vpa/create/${MerchantId.valid}`)
			.set(CommonHeader)
			.send(invalidData)
			.then((response) => {
				Expect(response.body.message).to.be.eql('Please provide VPA type.');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('19. Should not create when submer_type given empty', function (done) {
		const invalidData = {...validData};
		invalidData.submer_type = '';
		Request(BaseUrl)
			.post(`/api/store-admin/vpa/create/${MerchantId.valid}`)
			.set(CommonHeader)
			.send(invalidData)
			.then((response) => {
				Expect(response.body.message).to.be.eql('Please provide VPA type.');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('20. Should not create when submer_type given as whitespace', function (done) {
		const invalidData = {...validData};
		invalidData.submer_type = '  ';
		Request(BaseUrl)
			.post(`/api/store-admin/vpa/create/${MerchantId.valid}`)
			.set(CommonHeader)
			.send(invalidData)
			.then((response) => {
				Expect(response.body.message).to.be.eql('Please provide VPA type.');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('21. Should create when submer_type given as p2m', function (done) {
		const validModeData = {...validData};
		validModeData.submer_type = 'p2m';
		Request(BaseUrl)
			.post(`/api/store-admin/vpa/create/${MerchantId.valid}`)
			.set(CommonHeader)
			.send(validModeData)
			.then((response) => {
				//Expect(response.body.message).to.be.eql('VPA created')
				Expect(response.body.success).to.be.true;
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('22. Should create when submer_type given as p2pm', function (done) {
		const validModeData = {...validData};
		Request(BaseUrl)
			.post(`/api/store-admin/vpa/create/${MerchantId.valid}`)
			.set(CommonHeader)
			.send(validModeData)
			.then((response) => {
				//Expect(response.body.message).to.be.eql('VPA created')
				Expect(response.body.success).to.be.true;
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('23. Should not create when submer_type not given as either p2m or p2pm', function (done) {
		const invalidModeData = {...validData};
		invalidModeData.submer_type = 'etv';
		Request(BaseUrl)
			.post(`/api/store-admin/vpa/create/${MerchantId.valid}`)
			.set(CommonHeader)
			.send(invalidModeData)
			.then((response) => {
				Expect(response.body.message).to.be.eql('Invalid VPA type.');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('24. Should not update as the request body data is not given.', function (done) {
		Request(BaseUrl)
			.post(`/api/store-admin/vpa/create/${MerchantId.valid}`)
			.set(CommonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Please provide VPA name.');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});
});
