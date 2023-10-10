const Request = require('supertest');
const Expect = require('chai').expect;
const dotenv = require('dotenv');
dotenv.config();
const {deleteMerchant} = require('../../Source/Repository/MerchantRepository');

const BaseUrl = 'http://localhost:1507/api/store-admin';

let merchantCreateData = {
	phone: '8608353510',
	merchant_name: 'Swetha',
	location: {
		flat_no: '12',
		street_name: 'Ratna Streets',
		area: 'Gandhi Nagar',
		city: 'Chennai',
		state: 'Tamilnadu',
		pincode: '600060'
	}
};

let commonHeader = {
	['x-consumer-username']: 'admin_BWpaitTqT5'
};

describe('Merchant Create', function () {
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
		await deleteMerchant({'phone.national_number': merchantCreateData?.phone}, {});
	});

	it('1. Should Create merchant successfully', function (done) {
		Request(BaseUrl)
			.post('/merchant/create/')
			.send(merchantCreateData)
			.expect(200)
			.set(commonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Merchant created');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('2. Should not create merchant as the number is same', function (done) {
		Request(BaseUrl)
			.post('/merchant/create/')
			.send(merchantCreateData)
			.expect(200)
			.set(commonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Merchant/Sub-Merchant already exists!');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('3. Should not create merchant as the location field is just an empty string.', function (done) {
		let invalidData = structuredClone(merchantCreateData);
		invalidData.location = '';
		Request(BaseUrl)
			.post('/merchant/create/')
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

	it('4. Should not create merchant as the location field is just white space.', function (done) {
		let invalidData = structuredClone(merchantCreateData);
		invalidData.location = '      ';
		Request(BaseUrl)
			.post('/merchant/create/')
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

	it('5. Should not create merchant as the location field is not there.', function (done) {
		let invalidData = structuredClone(merchantCreateData);
		delete invalidData.location;
		Request(BaseUrl)
			.post('/merchant/create/')
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

	it('6. Should not create merchant as the flat number is just an empty string.', function (done) {
		let invalidData = structuredClone(merchantCreateData);
		invalidData.location.flat_no = '';
		Request(BaseUrl)
			.post('/merchant/create/')
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

	it('7. Should not create merchant as the flat number is just a white space.', function (done) {
		let invalidData = structuredClone(merchantCreateData);
		invalidData.location.flat_no = '          ';
		Request(BaseUrl)
			.post('/merchant/create/')
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

	it('8. Should not create merchant as the flat number is not given.', function (done) {
		let invalidData = structuredClone(merchantCreateData);
		delete invalidData.location.flat_no;
		Request(BaseUrl)
			.post('/merchant/create/')
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

	it('9. Should not create merchant as the street name is just an empty string.', function (done) {
		let invalidData = structuredClone(merchantCreateData);
		invalidData.location.street_name = '';
		Request(BaseUrl)
			.post('/merchant/create/')
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

	it('10. Should not create merchant as the street name is just a white space.', function (done) {
		let invalidData = structuredClone(merchantCreateData);
		invalidData.location.street_name = '          ';
		Request(BaseUrl)
			.post('/merchant/create/')
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

	it('11. Should not create merchant as the street name is not given.', function (done) {
		let invalidData = structuredClone(merchantCreateData);
		delete invalidData.location.street_name;
		Request(BaseUrl)
			.post('/merchant/create/')
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

	it('12. Should not create merchant as the area is just an empty string.', function (done) {
		let invalidData = structuredClone(merchantCreateData);
		invalidData.location.area = '';
		Request(BaseUrl)
			.post('/merchant/create/')
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

	it('13. Should not create merchant as the area is just a white space.', function (done) {
		let invalidData = structuredClone(merchantCreateData);
		invalidData.location.area = '           ';
		Request(BaseUrl)
			.post('/merchant/create/')
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

	it('14. Should not create merchant as the area is not given.', function (done) {
		let invalidData = structuredClone(merchantCreateData);
		delete invalidData.location.area;
		Request(BaseUrl)
			.post('/merchant/create/')
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

	it('15. Should not create merchant as the city is just an empty string.', function (done) {
		let invalidData = structuredClone(merchantCreateData);
		invalidData.location.city = '';
		Request(BaseUrl)
			.post('/merchant/create/')
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

	it('16. Should not create merchant as the city is just a white space.', function (done) {
		let invalidData = structuredClone(merchantCreateData);
		invalidData.location.city = '       ';
		Request(BaseUrl)
			.post('/merchant/create/')
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

	it('17. Should not create merchant as the city is not given.', function (done) {
		let invalidData = structuredClone(merchantCreateData);
		delete invalidData.location.city;
		Request(BaseUrl)
			.post('/merchant/create/')
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

	it('18. Should not create merchant as the state is just an empty string.', function (done) {
		let invalidData = structuredClone(merchantCreateData);
		invalidData.location.state = '';
		Request(BaseUrl)
			.post('/merchant/create/')
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

	it('19. Should not create merchant as the state is just a white space.', function (done) {
		let invalidData = structuredClone(merchantCreateData);
		invalidData.location.state = '       ';
		Request(BaseUrl)
			.post('/merchant/create/')
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

	it('20. Should not create merchant as the state is not given.', function (done) {
		let invalidData = structuredClone(merchantCreateData);
		delete invalidData.location.state;
		Request(BaseUrl)
			.post('/merchant/create/')
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

	it('21. Should not create merchant as the pincode is just an empty string.', function (done) {
		let invalidData = structuredClone(merchantCreateData);
		invalidData.location.pincode = '';
		Request(BaseUrl)
			.post('/merchant/create/')
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

	it('22. Should not create merchant as the pincode is just a white space.', function (done) {
		let invalidData = structuredClone(merchantCreateData);
		invalidData.location.pincode = '         ';
		Request(BaseUrl)
			.post('/merchant/create/')
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

	it('23. Should not create merchant as the pincode is not given.', function (done) {
		let invalidData = structuredClone(merchantCreateData);
		delete invalidData.location.pincode;
		Request(BaseUrl)
			.post('/merchant/create/')
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

	it('24. Should not create merchant as the phone number is just an empty string.', function (done) {
		let invalidData = structuredClone(merchantCreateData);
		invalidData.phone = '';
		Request(BaseUrl)
			.post('/merchant/create/')
			.send(invalidData)
			.expect(200)
			.set(commonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Please provide valid mobile number');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('25. Should not create merchant as the phone number is just a white space.', function (done) {
		let invalidData = structuredClone(merchantCreateData);
		invalidData.phone = '        ';
		Request(BaseUrl)
			.post('/merchant/create/')
			.send(invalidData)
			.expect(200)
			.set(commonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Please provide valid mobile number');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('26. Should not create merchant as the phone number is not Indian.', function (done) {
		let invalidData = structuredClone(merchantCreateData);
		invalidData.phone = '1234567890';
		Request(BaseUrl)
			.post('/merchant/create/')
			.send(invalidData)
			.expect(200)
			.set(commonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Please provide valid mobile number');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('27. Should not create merchant as the phone number is not given.', function (done) {
		let invalidData = structuredClone(merchantCreateData);
		delete invalidData.phone;
		Request(BaseUrl)
			.post('/merchant/create/')
			.send(invalidData)
			.expect(200)
			.set(commonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Please provide valid mobile number');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('28. Should not create merchant as the merchant name is not given.', function (done) {
		let invalidData = structuredClone(merchantCreateData);
		delete invalidData.merchant_name;
		Request(BaseUrl)
			.post('/merchant/create/')
			.send(invalidData)
			.expect(200)
			.set(commonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Please provide merchant full name.');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('29. Should not create merchant as the merchant name is not alphabetic.', function (done) {
		let invalidData = structuredClone(merchantCreateData);
		invalidData.merchant_name = '%^&';
		Request(BaseUrl)
			.post('/merchant/create/')
			.send(invalidData)
			.expect(200)
			.set(commonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Name must be alphabetic.');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('30. Should not create merchant as the commonHeader or Kong request header is missing', function (done) {
		Request(BaseUrl)
			.post('/merchant/create/')
			.send(merchantCreateData)
			.expect(406)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Wrong CSRF Token');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('31. Should not create merchant as user role is not admin', function (done) {
		let invalidToken = {...commonHeader};
		invalidToken['x-consumer-username'] = 'notAdmin_2521678';
		Request(BaseUrl)
			.post('/merchant/create/')
			.send(merchantCreateData)
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

	it('32. Should not create merchant as user id is not valid', function (done) {
		let invalidToken = {...commonHeader};
		invalidToken['x-consumer-username'] = 'admin_2521678';
		Request(BaseUrl)
			.post('/merchant/create/')
			.send(merchantCreateData)
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

	it('33. Should not create merchant as the request body data is not given.', function (done) {
		Request(BaseUrl)
			.post('/merchant/create/')
			.expect(200)
			.set(commonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Please provide valid mobile number');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});
});
