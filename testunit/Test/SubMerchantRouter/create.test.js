const Request = require('supertest');
const Expect = require('chai').expect;
const dotenv = require('dotenv');
dotenv.config();

const BaseUrl = 'http://localhost:1507';

let validData = {
	phone: '7780622174',
	merchant_name: 'Siva',
	email: 'premaymt@gmail.com',
	location: {
		flat_no: '12',
		street_name: 'Rajaji Salai',
		area: 'Nungambakkam',
		city: 'Chennai',
		state: 'Tamilnadu',
		pincode: '600025'
	}
};

const CommonHeader = {
	['x-consumer-username']: 'admin_zoHP@GkUR'
};

const MerchantId = {
	valid: 'O0Wz62ad1q',
	invalid: 'NbFx0th'
};

describe('Create SubMerchant ', function () {
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

	it('1. Should Create SubMerchant successfully', function (done) {
		Request(BaseUrl)
			.post(`/api/store-admin/sub-merchant/create/${MerchantId.valid}`)
			.send(validData)
			.set(CommonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Sub Merchant created');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('2. Should not create SubMerchant as the number is same', function (done) {
		Request(BaseUrl)
			.post(`/api/store-admin/sub-merchant/create/${MerchantId.valid}`)
			.send(validData)
			.set(CommonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('SubMerchant already exists!');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('3. Should not create SubMerchant as the location field is just an empty string.', function (done) {
		let invalidData = JSON.parse(JSON.stringify(validData));
		invalidData.location = '';
		Request(BaseUrl)
			.post(`/api/store-admin/sub-merchant/create/${MerchantId.valid}`)
			.send(invalidData)
			.set(CommonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Please provide flat number');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('4. Should not create SubMerchant as the location field is just white space.', function (done) {
		let invalidData = JSON.parse(JSON.stringify(validData));
		invalidData.location = '      ';
		Request(BaseUrl)
			.post(`/api/store-admin/sub-merchant/create/${MerchantId.valid}`)
			.send(invalidData)
			.set(CommonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Please provide flat number');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('5. Should not create SubMerchant as the location field is not there.', function (done) {
		let invalidData = JSON.parse(JSON.stringify(validData));
		delete invalidData.location;
		Request(BaseUrl)
			.post(`/api/store-admin/sub-merchant/create/${MerchantId.valid}`)
			.send(invalidData)
			.set(CommonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Please provide flat number');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('6. Should not create SubMerchant as the flat number is just an empty string.', function (done) {
		let invalidData = JSON.parse(JSON.stringify(validData));
		invalidData.location.flat_no = '';
		Request(BaseUrl)
			.post(`/api/store-admin/sub-merchant/create/${MerchantId.valid}`)
			.send(invalidData)
			.set(CommonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Please provide flat number');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('7. Should not create SubMerchant as the flat number is just a white space.', function (done) {
		let invalidData = JSON.parse(JSON.stringify(validData));
		invalidData.location.flat_no = '          ';
		Request(BaseUrl)
			.post(`/api/store-admin/sub-merchant/create/${MerchantId.valid}`)
			.send(invalidData)
			.set(CommonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Please provide flat number');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('8. Should not create SubMerchant as the flat number is not given.', function (done) {
		let invalidData = JSON.parse(JSON.stringify(validData));
		delete invalidData.location.flat_no;
		Request(BaseUrl)
			.post(`/api/store-admin/sub-merchant/create/${MerchantId.valid}`)
			.send(invalidData)
			.set(CommonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Please provide flat number');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('9. Should not create SubMerchant as the street name is just an empty string.', function (done) {
		let invalidData = JSON.parse(JSON.stringify(validData));
		invalidData.location.street_name = '';
		Request(BaseUrl)
			.post(`/api/store-admin/sub-merchant/create/${MerchantId.valid}`)
			.send(invalidData)
			.set(CommonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Please provide street name');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('10. Should not create SubMerchant as the street name is just a white space.', function (done) {
		let invalidData = JSON.parse(JSON.stringify(validData));
		invalidData.location.street_name = '          ';
		Request(BaseUrl)
			.post(`/api/store-admin/sub-merchant/create/${MerchantId.valid}`)
			.send(invalidData)
			.set(CommonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Please provide street name');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('11. Should not create SubMerchant as the street name is not given.', function (done) {
		let invalidData = JSON.parse(JSON.stringify(validData));
		delete invalidData.location.street_name;
		Request(BaseUrl)
			.post(`/api/store-admin/sub-merchant/create/${MerchantId.valid}`)
			.send(invalidData)
			.set(CommonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Please provide street name');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('12. Should not create SubMerchant as the area is just an empty string.', function (done) {
		let invalidData = JSON.parse(JSON.stringify(validData));
		invalidData.location.area = '';
		Request(BaseUrl)
			.post(`/api/store-admin/sub-merchant/create/${MerchantId.valid}`)
			.send(invalidData)
			.set(CommonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Please provide area');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('13. Should not create SubMerchant as the area is just a white space.', function (done) {
		let invalidData = JSON.parse(JSON.stringify(validData));
		invalidData.location.area = '           ';
		Request(BaseUrl)
			.post(`/api/store-admin/sub-merchant/create/${MerchantId.valid}`)
			.send(invalidData)
			.set(CommonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Please provide area');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('14. Should not create SubMerchant as the area is not given.', function (done) {
		let invalidData = JSON.parse(JSON.stringify(validData));
		delete invalidData.location.area;
		Request(BaseUrl)
			.post(`/api/store-admin/sub-merchant/create/${MerchantId.valid}`)
			.send(invalidData)
			.set(CommonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Please provide area');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('15. Should not create SubMerchant as the city is just an empty string.', function (done) {
		let invalidData = JSON.parse(JSON.stringify(validData));
		invalidData.location.city = '';
		Request(BaseUrl)
			.post(`/api/store-admin/sub-merchant/create/${MerchantId.valid}`)
			.send(invalidData)
			.set(CommonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Please provide city');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('16. Should not create SubMerchant as the city is just a white space.', function (done) {
		let invalidData = JSON.parse(JSON.stringify(validData));
		invalidData.location.city = '       ';
		Request(BaseUrl)
			.post(`/api/store-admin/sub-merchant/create/${MerchantId.valid}`)
			.send(invalidData)
			.set(CommonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Please provide city');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('17. Should not create SubMerchant as the city is not given.', function (done) {
		let invalidData = JSON.parse(JSON.stringify(validData));
		delete invalidData.location.city;
		Request(BaseUrl)
			.post(`/api/store-admin/sub-merchant/create/${MerchantId.valid}`)
			.send(invalidData)
			.set(CommonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Please provide city');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('18. Should not create SubMerchant as the state is just an empty string.', function (done) {
		let invalidData = JSON.parse(JSON.stringify(validData));
		invalidData.location.state = '';
		Request(BaseUrl)
			.post(`/api/store-admin/sub-merchant/create/${MerchantId.valid}`)
			.send(invalidData)
			.set(CommonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Please provide state');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('19. Should not create SubMerchant as the state is just a white space.', function (done) {
		let invalidData = JSON.parse(JSON.stringify(validData));
		invalidData.location.state = '       ';
		Request(BaseUrl)
			.post(`/api/store-admin/sub-merchant/create/${MerchantId.valid}`)
			.send(invalidData)
			.set(CommonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Please provide state');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('20. Should not create SubMerchant as the state is not given.', function (done) {
		let invalidData = JSON.parse(JSON.stringify(validData));
		delete invalidData.location.state;
		Request(BaseUrl)
			.post(`/api/store-admin/sub-merchant/create/${MerchantId.valid}`)
			.send(invalidData)
			.set(CommonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Please provide state');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('21. Should not create SubMerchant as the pincode is just an empty string.', function (done) {
		let invalidData = JSON.parse(JSON.stringify(validData));
		invalidData.location.pincode = '';
		Request(BaseUrl)
			.post(`/api/store-admin/sub-merchant/create/${MerchantId.valid}`)
			.send(invalidData)
			.set(CommonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Please provide pincode');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('22. Should not create SubMerchant as the pincode is just a white space.', function (done) {
		let invalidData = JSON.parse(JSON.stringify(validData));
		invalidData.location.pincode = '         ';
		Request(BaseUrl)
			.post(`/api/store-admin/sub-merchant/create/${MerchantId.valid}`)
			.send(invalidData)
			.set(CommonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Please provide pincode');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('23. Should not create SubMerchant as the pincode is not given.', function (done) {
		let invalidData = JSON.parse(JSON.stringify(validData));
		delete invalidData.location.pincode;
		Request(BaseUrl)
			.post(`/api/store-admin/sub-merchant/create/${MerchantId.valid}`)
			.send(invalidData)
			.set(CommonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Please provide pincode');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('24. Should not create SubMerchant as the phone number is just an empty string.', function (done) {
		let invalidData = JSON.parse(JSON.stringify(validData));
		invalidData.phone = '';
		Request(BaseUrl)
			.post(`/api/store-admin/sub-merchant/create/${MerchantId.valid}`)
			.send(invalidData)
			.set(CommonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Please provide valid mobile number');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('25. Should not create SubMerchant as the phone number is just a white space.', function (done) {
		let invalidData = JSON.parse(JSON.stringify(validData));
		invalidData.phone = '        ';
		Request(BaseUrl)
			.post(`/api/store-admin/sub-merchant/create/${MerchantId.valid}`)
			.send(invalidData)
			.set(CommonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Please provide valid mobile number');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('26. Should not create SubMerchant as the phone number is not Indian.', function (done) {
		let invalidData = JSON.parse(JSON.stringify(validData));
		invalidData.phone = '1234567890';
		Request(BaseUrl)
			.post(`/api/store-admin/sub-merchant/create/${MerchantId.valid}`)
			.send(invalidData)
			.set(CommonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Please provide valid mobile number');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('27. Should not create SubMerchant as the phone number is not given.', function (done) {
		let invalidData = JSON.parse(JSON.stringify(validData));
		delete invalidData.phone;
		Request(BaseUrl)
			.post(`/api/store-admin/sub-merchant/create/${MerchantId.valid}`)
			.send(invalidData)
			.set(CommonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Please provide valid mobile number');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('28. Should not create SubMerchant as the merchant name is not given.', function (done) {
		let invalidData = JSON.parse(JSON.stringify(validData));
		delete invalidData.merchant_name;
		Request(BaseUrl)
			.post(`/api/store-admin/sub-merchant/create/${MerchantId.valid}`)
			.send(invalidData)
			.set(CommonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Please provide merchant full name.');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('29. Should not create SubMerchant as the merchant name is not alphabetic.', function (done) {
		let invalidData = JSON.parse(JSON.stringify(validData));
		invalidData.merchant_name = '%^&';
		Request(BaseUrl)
			.post(`/api/store-admin/sub-merchant/create/${MerchantId.valid}`)
			.send(invalidData)
			.set(CommonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Name must be alphabetic.');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('30. Should not create SubMerchant as the CommonHeader or Kong request header is missing', function (done) {
		const Headers = Object.assign({}, CommonHeader);
		delete Headers['x-consumer-username'];
		Request(BaseUrl)
			.post(`/api/store-admin/sub-merchant/create/${MerchantId.valid}`)
			.send(validData)
			.set(Headers)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Unauthorized Access!');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('31. Should not create SubMerchant as user role is not admin/sub-admin', function (done) {
		const Headers = Object.assign({}, CommonHeader);
		Headers['x-consumer-username'] = 'notAdmin_zoHP@GkUR';

		Request(BaseUrl)
			.post(`/api/store-admin/sub-merchant/create/${MerchantId.valid}`)
			.send(validData)
			.set(Headers)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Not a valid user');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('32. Should not create SubMerchant as user id is not valid', function (done) {
		const Headers = Object.assign({}, CommonHeader);
		Headers['x-consumer-username'] = 'admin_2521678';
		Request(BaseUrl)
			.post(`/api/store-admin/sub-merchant/create/${MerchantId.valid}`)
			.send(validData)
			.set(Headers)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Not a valid user!');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('33. Should not create SubMerchant as the request body data is not given.', function (done) {
		Request(BaseUrl)
			.post(`/api/store-admin/sub-merchant/create/${MerchantId.valid}`)
			.set(CommonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Please provide valid mobile number');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('34. Should not create SubMerchant as invalid merchantId given', function (done) {
		Request(BaseUrl)
			.post(`/api/store-admin/sub-merchant/create/${MerchantId.invalid}`)
			.send(validData)
			.set(CommonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Merchant Not Found!');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('35. Should not create  as the merchantId is not provided.', function (done) {
		Request(BaseUrl)
			.post('/sub-merchant/create')
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
