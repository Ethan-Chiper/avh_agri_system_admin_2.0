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
	invalid: 'tyjkfgh'
};

const StoreId = {
	valid: 'voZmSx3vC',
	invalid: 'MqakIpr'
};

describe(' Change Vpa Status', function () {
	it('1. must  not change when correct UserRole and incorrect UserId given without storeId', function (done) {
		let vpa = {vpa: 'ippostorecrwtbwessxi4h@icici'};
		let headers = Object.assign({}, CommonHeader);
		headers['x-consumer-username'] = 'admin_zoHP@GR';
		Request(BaseUrl)
			.patch(`/api/store-admin/vpa/status-change/${MerchantId.valid}`)
			.set(headers)
			.send(vpa)
			.then((response) => {
				Expect(response.body.message).to.be.eql('Not a valid user!');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});
	it('2. must not change status when incorrect UserRole and correct UserId given without storeId', function (done) {
		let vpa = {vpa: 'ippostorecrwtbwessxi4h@icici'};
		let headers = Object.assign({}, CommonHeader);
		headers['x-consumer-username'] = 'wrongrole_zoHP@GKUR';

		Request(BaseUrl)
			.patch(`/api/store-admin/vpa/status-change/${MerchantId.valid}`)
			.set(headers)
			.send(vpa)
			.then((response) => {
				Expect(response.body.message).to.be.eql('Not a valid user');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('3. Should not change status  when no UserRole and UserId given without storeId', function (done) {
		let vpa = {vpa: 'ippostorecrwtbwessxi4h@icici'};
		Request(BaseUrl)
			.patch(`/api/store-admin/vpa/status-change/${MerchantId.valid}`)
			.send(vpa)
			.then((response) => {
				Expect(response.body.message).to.be.eql('Unauthorized Access!');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('4. must  not change when correct UserRole and incorrect UserId given', function (done) {
		let vpa = {vpa: 'ippostorecrwtbwessxi4h@icici'};
		let headers = Object.assign({}, CommonHeader);
		headers['x-consumer-username'] = 'admin_zoHP@GR';
		Request(BaseUrl)
			.patch(`/api/store-admin/vpa/status-change/${MerchantId.valid}/${StoreId.valid}`)
			.set(headers)
			.send(vpa)
			.then((response) => {
				Expect(response.body.message).to.be.eql('Not a valid user!');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});
	it('5. must not change status when incorrect UserRole and correct UserId given', function (done) {
		let headers = Object.assign({}, CommonHeader);
		headers['x-consumer-username'] = 'wrongrole_zoHP@GKUR';
		let vpa = {vpa: 'ippostorecrwtbwessxi4h@icici'};

		Request(BaseUrl)
			.patch(`/api/store-admin/vpa/status-change/${MerchantId.valid}/${StoreId.valid}`)
			.set(headers)
			.send(vpa)
			.then((response) => {
				Expect(response.body.message).to.be.eql('Not a valid user');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('6. Should not change status  when no UserRole and UserId given', function (done) {
		let vpa = {vpa: 'ippostorecrwtbwessxi4h@icici'};
		Request(BaseUrl)
			.patch(`/api/store-admin/vpa/status-change/${MerchantId.valid}/${StoreId.valid}`)
			.send(vpa)
			.then((response) => {
				Expect(response.body.message).to.be.eql('Unauthorized Access!');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('7. Should not change when vpaId not given', function (done) {
		Request(BaseUrl)
			.patch(`/api/store-admin/vpa/status-change/${MerchantId.valid}`)
			.set(CommonHeader)
			.then((response) => {
				Expect(response.body.message).to.be.eql('Please provide valid VPA.');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('8. Should not change status when vpaId given empty', function (done) {
		let vpa = {vpa: ''};
		Request(BaseUrl)
			.patch(`/api/store-admin/vpa/status-change/${MerchantId.valid}`)
			.set(CommonHeader)
			.send(vpa)
			.then((response) => {
				Expect(response.body.message).to.be.eql('Please provide valid VPA.');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('9. Should not change status when vpaId given as whitespace', function (done) {
		let vpa = {vpa: '  '};
		Request(BaseUrl)
			.patch(`/api/store-admin/vpa/status-change/${MerchantId.valid}`)
			.set(CommonHeader)
			.send(vpa)
			.then((response) => {
				Expect(response.body.message).to.be.eql('Please provide valid VPA.');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('11. Should not change when vpaId not given with StoreId', function (done) {
		Request(BaseUrl)
			.patch(`/api/store-admin/vpa/status-change/${MerchantId.valid}/${StoreId.valid}`)
			.set(CommonHeader)
			.then((response) => {
				Expect(response.body.message).to.be.eql('Please provide valid VPA.');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('12. Should not change status when vpaId given empty with valid storeId', function (done) {
		let vpa = {vpa: ''};
		Request(BaseUrl)
			.patch(`/api/store-admin/vpa/status-change/${MerchantId.valid}/${StoreId.valid}`)
			.set(CommonHeader)
			.send(vpa)
			.then((response) => {
				Expect(response.body.message).to.be.eql('Please provide valid VPA.');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('13. Should not change status when vpaId given as whitespace with valid StoreId', function (done) {
		let vpa = {vpa: '  '};
		Request(BaseUrl)
			.patch(`/api/store-admin/vpa/status-change/${MerchantId.valid}/${StoreId.valid}`)
			.set(CommonHeader)
			.send(vpa)
			.then((response) => {
				Expect(response.body.message).to.be.eql('Please provide valid VPA.');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('15. Should not create  when valid MerchantId but invalid storeId given', function (done) {
		let vpa = {vpa: 'ippostorecrwtbwessxi4h@icici'};
		Request(BaseUrl)
			.patch(`/api/store-admin/vpa/status-change/${MerchantId.valid}/${StoreId.invalid}`)
			.set(CommonHeader)
			.send(vpa)
			.then((response) => {
				Expect(response.body.message).to.be.eql('Store Not Found!');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('16. Should not create  when invalid MerchantId ', function (done) {
		let vpa = {vpa: 'ippostorecrwtbwessxi4h@icici'};
		Request(BaseUrl)
			.patch(`/api/store-admin/vpa/status-change/${MerchantId.invalid}`)
			.set(CommonHeader)
			.send(vpa)
			.then((response) => {
				Expect(response.body.message).to.be.eql('Merchant Not Found!');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('17. Should not change status as the merchantId is not provided.', function (done) {
		Request(BaseUrl)
			.patch('/vpa/status-change')
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

	it('18. Should change status when all valid inputs given ', function (done) {
		let vpa = {vpa: 'ippostorecrwtbwessxi4h@icici'};
		Request(BaseUrl)
			.patch(`/api/store-admin/vpa/status-change/${MerchantId.valid}`)
			.set(CommonHeader)
			.send(vpa)
			.then((response) => {
				//Expect(response.body.message).to.be.eql('Status Changed');
				Expect(response.body.success).to.be.true;
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('19. Should change status when all valid inputs given with storeId ', function (done) {
		let vpa = {vpa: 'ippostorecrwtbwessxi4h@icici'};
		Request(BaseUrl)
			.patch(`/api/store-admin/vpa/status-change/${MerchantId.valid}/${StoreId.valid}`)
			.set(CommonHeader)
			.send(vpa)
			.then((response) => {
				//Expect(response.body.message).to.be.eql('Status Changed');
				Expect(response.body.success).to.be.true;
				done();
			})
			.catch((error) => {
				done(error);
			});
	});
});
