const Request = require('supertest');
const Expect = require('chai').expect;
const dotenv = require('dotenv');
const {deleteStore} = require('../../Source/Repository/StoreRepository');
dotenv.config();

const BaseUrl = 'http://localhost:1507/api/store-admin';

let storeCreateData = {
	name: 'Testing',
	store_category: 'Electronics',
	store_subCategory: 'Mobiles',
	settlement_type: 'instant',
	location: {
		flat_no: '12',
		street_name: 'Rajaji Road',
		area: 'Guindy',
		city: 'Chennai',
		state: 'Tamilnadu',
		pincode: '600063'
	}
};

let merchantId = 'afhjds@_123';

let commonHeader = {
	['x-consumer-username']: 'admin_BWpaitTqT5'
};

describe('Store Create', function () {
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

	after(async function () {
		await deleteStore({merchant_id: merchantId}, {});
	});
	it('1. Should Create store successfully as the request body has all the necessary details, should have the same id as the merchant.', function (done) {
		Request(BaseUrl)
			.post('/store/create/' + merchantId)
			.send(storeCreateData)
			.expect(200)
			.set(commonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Store created');
				Expect(response?.body?.data?.store?.store_id).to.be.eql(merchantId);
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('3. Should not create store as the location field is just white space.', function (done) {
		let invaliData = structuredClone(storeCreateData);
		invaliData.location = '      ';
		Request(BaseUrl)
			.post('/store/create/' + merchantId)
			.send(invaliData)
			.expect(200)
			.set(commonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Please provide flat number');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('4. Should not create store as the location field is not there.', function (done) {
		let invalidData = structuredClone(storeCreateData);
		delete invalidData.location;
		Request(BaseUrl)
			.post('/store/create/' + merchantId)
			.send(invalidData)
			.expect(200)
			.set(commonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Please provide flat number');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('5. Should not create store as the flat_no is just an empty string.', function (done) {
		let invalidData = structuredClone(storeCreateData);
		invalidData.location.flat_no = '';
		Request(BaseUrl)
			.post('/store/create/' + merchantId)
			.send(invalidData)
			.expect(200)
			.set(commonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Please provide flat number');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('6. Should not create store as the flat_no is just white space.', function (done) {
		let invalidData = structuredClone(storeCreateData);
		invalidData.location.flat_no = '      ';
		Request(BaseUrl)
			.post('/store/create/' + merchantId)
			.send(invalidData)
			.expect(200)
			.set(commonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Please provide flat number');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('7. Should not create store as the flat_no is not there.', function (done) {
		let invalidData = structuredClone(storeCreateData);
		delete invalidData.location.flat_no;
		Request(BaseUrl)
			.post('/store/create/' + merchantId)
			.send(invalidData)
			.expect(200)
			.set(commonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Please provide flat number');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('8. Should not create store as the street_name is just an empty string.', function (done) {
		let invalidData = structuredClone(storeCreateData);
		invalidData.location.street_name = '';
		Request(BaseUrl)
			.post('/store/create/' + merchantId)
			.send(invalidData)
			.expect(200)
			.set(commonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Please provide street name');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('9. Should not create store as the street_name is just white space.', function (done) {
		let invalidData = structuredClone(storeCreateData);
		invalidData.location.street_name = '      ';
		Request(BaseUrl)
			.post('/store/create/' + merchantId)
			.send(invalidData)
			.expect(200)
			.set(commonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Please provide street name');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('10. Should not create store as the street_name is not there.', function (done) {
		let invalidData = structuredClone(storeCreateData);
		delete invalidData.location.street_name;
		Request(BaseUrl)
			.post('/store/create/' + merchantId)
			.send(invalidData)
			.expect(200)
			.set(commonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Please provide street name');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('11. Should not create store as the area is just an empty string.', function (done) {
		let invalidData = structuredClone(storeCreateData);
		invalidData.location.area = '';
		Request(BaseUrl)
			.post('/store/create/' + merchantId)
			.send(invalidData)
			.expect(200)
			.set(commonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Please provide area');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('12. Should not create store as the area is just white space.', function (done) {
		let invalidData = structuredClone(storeCreateData);
		invalidData.location.area = '      ';
		Request(BaseUrl)
			.post('/store/create/' + merchantId)
			.send(invalidData)
			.expect(200)
			.set(commonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Please provide area');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('13. Should not create store as the area is not there.', function (done) {
		let invalidData = structuredClone(storeCreateData);
		delete invalidData.location.area;
		Request(BaseUrl)
			.post('/store/create/' + merchantId)
			.send(invalidData)
			.expect(200)
			.set(commonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Please provide area');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('14. Should not create store as the city is just an empty string.', function (done) {
		let invalidData = structuredClone(storeCreateData);
		invalidData.location.city = '';
		Request(BaseUrl)
			.post('/store/create/' + merchantId)
			.send(invalidData)
			.expect(200)
			.set(commonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Please provide city');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('15. Should not create store as the city is just white space.', function (done) {
		let invalidData = structuredClone(storeCreateData);
		invalidData.location.city = '      ';
		Request(BaseUrl)
			.post('/store/create/' + merchantId)
			.send(invalidData)
			.expect(200)
			.set(commonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Please provide city');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('16. Should not create store as the city is not there.', function (done) {
		let invalidData = structuredClone(storeCreateData);
		delete invalidData.location.city;
		Request(BaseUrl)
			.post('/store/create/' + merchantId)
			.send(invalidData)
			.expect(200)
			.set(commonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Please provide city');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('17. Should not create store as the state is just an empty string.', function (done) {
		let invalidData = structuredClone(storeCreateData);
		invalidData.location.state = '';
		Request(BaseUrl)
			.post('/store/create/' + merchantId)
			.send(invalidData)
			.expect(200)
			.set(commonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Please provide state');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('18. Should not create store as the state is just white space.', function (done) {
		let invalidData = structuredClone(storeCreateData);
		invalidData.location.state = '      ';
		Request(BaseUrl)
			.post('/store/create/' + merchantId)
			.send(invalidData)
			.expect(200)
			.set(commonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Please provide state');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('19. Should not create store as the state is not there.', function (done) {
		let invalidData = structuredClone(storeCreateData);
		delete invalidData.location.state;
		Request(BaseUrl)
			.post('/store/create/' + merchantId)
			.send(invalidData)
			.expect(200)
			.set(commonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Please provide state');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('20. Should not create store as the pin code is just an empty string.', function (done) {
		let invalidData = structuredClone(storeCreateData);
		invalidData.location.pincode = '';
		Request(BaseUrl)
			.post('/store/create/' + merchantId)
			.send(invalidData)
			.expect(200)
			.set(commonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Please provide pincode');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('21. Should not create store as the pin code is just white space.', function (done) {
		let invalidData = structuredClone(storeCreateData);
		invalidData.location.pincode = '      ';
		Request(BaseUrl)
			.post('/store/create/' + merchantId)
			.send(invalidData)
			.expect(200)
			.set(commonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Please provide pincode');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('22. Should not create store as the pin code is not there.', function (done) {
		let invalidData = structuredClone(storeCreateData);
		delete invalidData.location.pincode;
		Request(BaseUrl)
			.post('/store/create/' + merchantId)
			.send(invalidData)
			.expect(200)
			.set(commonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Please provide pincode');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('23. Should not create store as the store category is just an empty string.', function (done) {
		let invalidData = structuredClone(storeCreateData);
		invalidData.store_category = '';
		Request(BaseUrl)
			.post('/store/create/' + merchantId)
			.send(invalidData)
			.expect(200)
			.set(commonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Please provide store category.');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('24. Should not create store as the store category is just white space.', function (done) {
		let invalidData = structuredClone(storeCreateData);
		invalidData.store_category = '      ';
		Request(BaseUrl)
			.post('/store/create/' + merchantId)
			.send(invalidData)
			.expect(200)
			.set(commonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Please provide store category.');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('25. Should not create store as the store category is not there.', function (done) {
		let invalidData = structuredClone(storeCreateData);
		delete invalidData.store_category;
		Request(BaseUrl)
			.post('/store/create/' + merchantId)
			.send(invalidData)
			.expect(200)
			.set(commonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Please provide store category.');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('26. Should not create store as the sub category is just an empty string.', function (done) {
		let invalidData = structuredClone(storeCreateData);
		invalidData.store_subCategory = '';
		Request(BaseUrl)
			.post('/store/create/' + merchantId)
			.send(invalidData)
			.expect(200)
			.set(commonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Please provide sub category.');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('27. Should not create store as the sub category is just white space.', function (done) {
		let invalidData = structuredClone(storeCreateData);
		invalidData.store_subCategory = '      ';
		Request(BaseUrl)
			.post('/store/create/' + merchantId)
			.send(invalidData)
			.expect(200)
			.set(commonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Please provide sub category.');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('28. Should not create store as the sub category is not there.', function (done) {
		let invalidData = structuredClone(storeCreateData);
		delete invalidData.store_subCategory;
		Request(BaseUrl)
			.post('/store/create/' + merchantId)
			.send(invalidData)
			.expect(200)
			.set(commonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Please provide sub category.');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('29. Should not create store as the store name is just an empty string.', function (done) {
		let invalidData = structuredClone(storeCreateData);
		invalidData.name = '';
		Request(BaseUrl)
			.post('/store/create/' + merchantId)
			.send(invalidData)
			.expect(200)
			.set(commonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Please provide store name');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('30. Should not create store as the store name is just white space.', function (done) {
		let invalidData = structuredClone(storeCreateData);
		invalidData.name = '      ';
		Request(BaseUrl)
			.post('/store/create/' + merchantId)
			.send(invalidData)
			.expect(200)
			.set(commonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Please provide store name');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('31. Should not create store as the store name is not there.', function (done) {
		let invalidData = structuredClone(storeCreateData);
		delete invalidData.name;
		Request(BaseUrl)
			.post('/store/create/' + merchantId)
			.send(invalidData)
			.expect(200)
			.set(commonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Please provide store name');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('32. Should not create store as the location field is just an empty string.', function (done) {
		let invalidData = structuredClone(storeCreateData);
		invalidData.location = '';
		Request(BaseUrl)
			.post('/store/create/' + merchantId)
			.send(invalidData)
			.expect(200)
			.set(commonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Please provide flat number');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('33. Should not create store as the merchantId is not provided.', function (done) {
		Request(BaseUrl)
			.post('/store/create')
			.send(storeCreateData)
			.expect(404)
			.set(commonHeader)
			.then((response) => {
				Expect(response?.res?.statusMessage).to.be.eql('Not Found');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('34. Should not create store as the commonHeader or Kong request header is missing', function (done) {
		Request(BaseUrl)
			.post('/store/create/' + merchantId)
			.send(storeCreateData)
			.expect(406)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Wrong CSRF Token');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('35. Should not create store as user role is not admin/sub-admin', function (done) {
		let invalidToken = {...commonHeader};
		invalidToken['x-consumer-username'] = 'notAdmin_2521678';
		Request(BaseUrl)
			.post('/store/create/' + merchantId)
			.send(storeCreateData)
			.set(invalidToken)
			.expect(200)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Not a valid user');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('36. Should not create store as user id is not valid', function (done) {
		let invalidToken = {...commonHeader};
		invalidToken['x-consumer-username'] = 'admin_2521678';
		Request(BaseUrl)
			.post('/store/create/' + merchantId)
			.send(storeCreateData)
			.set(invalidToken)
			.expect(200)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Not a valid user!');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('37. Should not create store as the request body data is not given.', function (done) {
		Request(BaseUrl)
			.post('/store/create/' + merchantId)
			.expect(200)
			.set(commonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Please provide store name');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('38. Should not create store as the merchant Id is wrong.', function (done) {
		Request(BaseUrl)
			.post('/store/create/wrong123id')
			.expect(200)
			.set(commonHeader)
			.send(storeCreateData)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Merchant Not Found!');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});
});
