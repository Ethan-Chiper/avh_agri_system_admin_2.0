const Request = require('supertest');
const Expect = require('chai').expect;
const dotenv = require('dotenv');
dotenv.config();

const BaseUrl = 'http://localhost:1507';

const ValidData = {
	merchant_id: 'voZmSx3vC',
	store_id: 'voZmSx3vC',
	beneficiary_id: 'bene_RhcztKYnF',
	vpa: 'ippostorecrwtbwessxi4h@icici'
};

const CommonHeader = {
	['x-consumer-username']: 'admin_zoHP@GkUR'
};

describe('Update VPA ', function () {
	it('1. Should not update as the CommonHeader or Kong request header is missing', function (done) {
		Request(BaseUrl)
			.post('/api/store-admin/vpa/update/ippostorecrwtbwessxi4h@icici')
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Unauthorized Access!');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('2. Should not update as user role is not admin/sub-admin', function (done) {
		let invalidToken = {
			['x-consumer-username']: 'notAdmin_2521678'
		};
		Request(BaseUrl)
			.post('/api/store-admin/vpa/update/ippostorecrwtbwessxi4h@icici')
			.set(invalidToken)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Not a valid user');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('3. Should not update as user id is not valid', function (done) {
		let invalidToken = {
			['x-consumer-username']: 'admin_2521678'
		};
		Request(BaseUrl)
			.post('/api/store-admin/vpa/update/ippostorecrwtbwessxi4h@icici')
			.set(invalidToken)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Not a valid user!');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('4. Should not update as the vpaId is not provided.', function (done) {
		Request(BaseUrl)
			.post('/api/store-admin/vpa/update')
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

	it('5 Should not update as the request body data is not given.', function (done) {
		Request(BaseUrl)
			.post('/api/store-admin/vpa/update/ippostorecrwtbwessxi4h@icici')
			.set(CommonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Please provide a valid merchant ID');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('6. Should not update as invalid merchantId given', function (done) {
		const invalidData = {...ValidData};
		invalidData.merchant_id = 'qwe6789';
		Request(BaseUrl)
			.post('/api/store-admin/vpa/update/ippostorecrwtbwessxi4h@icici')
			.send(invalidData)
			.set(CommonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Merchant Not Found!');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('7. Should not update as invalid storeId given', function (done) {
		const invalidData = {...ValidData};
		invalidData.store_id = 'qwe6789';
		Request(BaseUrl)
			.post('/api/store-admin/vpa/update/ippostorecrwtbwessxi4h@icici')
			.send(invalidData)
			.set(CommonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Store Not Found!');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('8. Should not update as  merchantId given empty', function (done) {
		const invalidData = {...ValidData};
		invalidData.merchant_id = '';
		Request(BaseUrl)
			.post('/api/store-admin/vpa/update/ippostorecrwtbwessxi4h@icici')
			.send(invalidData)
			.set(CommonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Please provide a valid merchant ID');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('9. Should not update as storeId given empty', function (done) {
		const invalidData = {...ValidData};
		invalidData.store_id = '';
		Request(BaseUrl)
			.post('/api/store-admin/vpa/update/ippostorecrwtbwessxi4h@icici')
			.send(invalidData)
			.set(CommonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Please provide a valid store ID');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('10. Should not update as  merchantId given as whitespace', function (done) {
		const invalidData = {...ValidData};
		invalidData.merchant_id = '    ';
		Request(BaseUrl)
			.post('/api/store-admin/vpa/update/ippostorecrwtbwessxi4h@icici')
			.send(invalidData)
			.set(CommonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Please provide a valid merchant ID');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('11. Should not update as storeId given whitespace', function (done) {
		const invalidData = {...ValidData};
		invalidData.store_id = '    ';
		Request(BaseUrl)
			.post('/api/store-admin/vpa/update/ippostorecrwtbwessxi4h@icici')
			.send(invalidData)
			.set(CommonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Please provide a valid store ID');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('12. Should not update as  merchantId not given', function (done) {
		const invalidData = {...ValidData};
		delete invalidData.merchant_id;
		Request(BaseUrl)
			.post('/api/store-admin/vpa/update/ippostorecrwtbwessxi4h@icici')
			.send(invalidData)
			.set(CommonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Please provide a valid merchant ID');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('13. Should not update as storeId not given ', function (done) {
		const invalidData = {...ValidData};
		delete invalidData.store_id;
		Request(BaseUrl)
			.post('/api/store-admin/vpa/update/ippostorecrwtbwessxi4h@icici')
			.send(invalidData)
			.set(CommonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Please provide a valid store ID');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('14. Should not update as beneficiary_id given empty', function (done) {
		const invalidData = {...ValidData};
		invalidData.beneficiary_id = '';
		Request(BaseUrl)
			.post('/api/store-admin/vpa/update/ippostorecrwtbwessxi4h@icici')
			.send(invalidData)
			.set(CommonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Please provide a valid beneficiary ID');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('15. Should not update as  beneficiary_id given as whitespace', function (done) {
		const invalidData = {...ValidData};
		invalidData.beneficiary_id = '    ';
		Request(BaseUrl)
			.post('/api/store-admin/vpa/update/ippostorecrwtbwessxi4h@icici')
			.send(invalidData)
			.set(CommonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Please provide a valid beneficiary ID');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('16. Should not update as  beneficiary_id not given', function (done) {
		const invalidData = {...ValidData};
		delete invalidData.beneficiary_id;
		Request(BaseUrl)
			.post('/api/store-admin/vpa/update/ippostorecrwtbwessxi4h@icici')
			.send(invalidData)
			.set(CommonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Please provide a valid beneficiary ID');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('17. Should not update as vpa given empty', function (done) {
		const invalidData = {...ValidData};
		invalidData.vpa = '';
		Request(BaseUrl)
			.post('/api/store-admin/vpa/update/ippostorecrwtbwessxi4h@icici')
			.send(invalidData)
			.set(CommonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Please provide a valid vpa');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('18. Should not update as vpa given as whitespace', function (done) {
		const invalidData = {...ValidData};
		invalidData.vpa = '    ';
		Request(BaseUrl)
			.post('/api/store-admin/vpa/update/ippostorecrwtbwessxi4h@icici')
			.send(invalidData)
			.set(CommonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Please provide a valid vpa');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('19. Should not update as vpa not given', function (done) {
		const invalidData = {...ValidData};
		delete invalidData.vpa;
		Request(BaseUrl)
			.post('/api/store-admin/vpa/update/ippostorecrwtbwessxi4h@icici')
			.send(invalidData)
			.set(CommonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Please provide a valid vpa');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('20. Must update as all inputs given', function (done) {
		Request(BaseUrl)
			.post('/api/store-admin/vpa/update/ippostorecrwtbwessxi4h@icici')
			.send(ValidData)
			.set(CommonHeader)
			.then((response) => {
				//Expect(response?.body?.message).to.be.eql('Updated Vpa is');
				Expect(response?.body?.success).to.be.true;
				done();
			})
			.catch((error) => {
				done(error);
			});
	});
});
