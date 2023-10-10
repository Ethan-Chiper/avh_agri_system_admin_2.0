const Request = require('supertest');
const Expect = require('chai').expect;
const dotenv = require('dotenv');
dotenv.config();

const BaseUrl = 'http://localhost:1507';
const CommonHeader = {
	['x-consumer-username']: 'admin_zoHP@GkUR'
};

describe('Fetch Details of SubMerchant', function () {
	it('1. Should retrieve all sub-merchants', function (done) {
		Request(BaseUrl)
			.get('/api/store-admin/sub-merchant/list')
			.set(CommonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('SubMerchants list are');
				//Expect(response?.body?.data).to.not.be.empty;
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('2. Should retrieve a list of subMerchant under a single merchantId', function (done) {
		Request(BaseUrl)
			.get('/api/store-admin/sub-merchant/list/?merchant_id=uhO5NK3h8')
			.set(CommonHeader)
			.expect(200)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('SubMerchants list are');
				Expect(response?.body?.data).to.not.be.empty;
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('3. Should retrieve sub-merchants filtered by store name', function (done) {
		const storeName = '';
		Request(BaseUrl)
			.get(`/api/store-admin/sub-merchant/list?store_name=${storeName}`)
			.set(CommonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('SubMerchants list are');
				Expect(response?.body?.data).to.not.be.empty;
				let merchants = response?.body?.data?.merchants;
				for (let merchant of merchants) {
					Expect(merchant.name.store).to.be.eql('');
				}
				// response?.body?.data?.merchants.forEach((subMerchant) => {
				// 	// Expect(subMerchant.name.store).to.be.eql('');
				// 	console.log(subMerchant)
				// });
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('4. Should retrieve sub-merchants filtered by phone number', function (done) {
		const phone = '9887654343';
		Request(BaseUrl)
			.get(`/api/store-admin/sub-merchant/list?phone=${phone}`)
			.set(CommonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('SubMerchants list are');
				Expect(response?.body?.data).to.not.be.empty;
				done();
			})
			.catch((error) => {
				done(error);
			});
	});
	it('5. Should return an error message if an invalid merchant ID is provided', function (done) {
		Request(BaseUrl)
			.get('/api/store-admin/sub-merchant/list/tyugjhfg23')
			.set(CommonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Merchant Not Found!');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('6. Should return list if an valid merchant ID is provided', function (done) {
		Request(BaseUrl)
			.get('/api/store-admin/sub-merchant/list/uhO5NK3h8')
			.set(CommonHeader)
			.then((response) => {
				Expect(response.body.message).to.be.eql('SubMerchant List are');
				Expect(response?.body?.success).to.be.true;
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('7. Should return an error message if the limit parameter is not a number', function (done) {
		Request(BaseUrl)
			.get('/api/store-admin/sub-merchant/list?limit=t54')
			.set(CommonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Limit must be a number');
				//Expect(response?.body?.data[0]?.msg).to.be.eql('Limit must be a number');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('8. Should return an list limit parameter given', function (done) {
		Request(BaseUrl)
			.get('/api/store-admin/sub-merchant/list?limit=1')
			.set(CommonHeader)
			.then((response) => {
				Expect(response?.body?.success).to.be.true;
				Expect(response?.body?.data?.total).to.be.eql(1);
				//Expect(response?.body?.data[0]?.msg).to.be.eql('Limit must be a number');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('9. Should return error if phone number is not valid', function (done) {
		const query = {phone: '911115'};
		Request(BaseUrl)
			.get('/api/store-admin/sub-merchant/list')
			.query(query)
			.set(CommonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Please provide a valid Phone Number');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('10. Should return an error if an invalid page value is provided', function (done) {
		Request(BaseUrl)
			.get('/api/store-admin/sub-merchant/list?page=u7')
			.set(CommonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Page must be a number');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('11. Should return list if valid page value is provided', function (done) {
		Request(BaseUrl)
			.get('/api/store-admin/sub-merchant/list?page=7')
			.set(CommonHeader)
			.then((response) => {
				Expect(response?.body?.success).to.be.true;
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('12. Should not retrieve a list of subMerchant as merchantId is invalid', function (done) {
		Request(BaseUrl)
			.get('/api/store-admin/sub-merchant/list/?merchant_id=u5NK3h8')
			.set(CommonHeader)
			.then((response) => {
				Expect(response?.body?.success).to.be.false;
				//Expect(response?.body?.data?.merchants).to.be.empty;
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('13. Should not list any sub merchant as the common header is not set', function (done) {
		Request(BaseUrl)
			.get('/api/store-admin/sub-merchant/list')
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Unauthorized Access!');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('14. Should not list as the person is not logged in user for overall list', function (done) {
		Request(BaseUrl)
			.get('/api/store-admin/sub-merchant/list')
			.set({['x-consumer-username']: 'merchant_zoHP@GkUR'})
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Not a valid user');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('15. Should not list as the admin id is unauthorized for overall list', function (done) {
		Request(BaseUrl)
			.get('/api/store-admin/sub-merchant/list')
			.set({['x-consumer-username']: 'admin_123redd'})
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Not a valid user!');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});
	it('16. Should return error if invalid URL given', function (done) {
		Request(BaseUrl)
			.get('/api/store-admin/sub-merchant')
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
