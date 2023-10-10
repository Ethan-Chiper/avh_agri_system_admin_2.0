const Request = require('supertest');
const Expect = require('chai').expect;
const dotenv = require('dotenv');
dotenv.config();
const {deleteSubUser} = require('../../Source/Repository/SubUserRepository');

const BaseUrl = 'http://localhost:1507/api/store-admin';

let subUserCreateData = {
	sub_user_name: 'Ranjay',
	phone: '9870318218',
	store_id: 'gSyr95bsg3',
	vpa_id: 'ippostorecrwtbwessxi4h@icici'
};

let commonHeader = {
	['x-consumer-username']: 'admin_BWpaitTqT5'
};

let merchantId = 'gSyr95bsg3';

describe('Sub User Create', function () {
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
		await deleteSubUser({'phone.national_number': '9870318218'});
	});

	it('1. Should create Sub User as the valid data are provided', function (done) {
		Request(BaseUrl)
			.post('/sub-user/create/' + merchantId)
			.send(subUserCreateData)
			.set(commonHeader)
			.expect(200)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Sub user created');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('2. Should not create Sub User as the same phone number exists as Sub User', function (done) {
		Request(BaseUrl)
			.post('/sub-user/create/' + merchantId)
			.send(subUserCreateData)
			.set(commonHeader)
			.expect(200)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('SubUser Already Exists!');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('3. Should not create Sub User as the phone number already exists.', function (done) {
		let invalidData = structuredClone(subUserCreateData);
		invalidData.phone = '9955663459';
		Request(BaseUrl)
			.post('/sub-user/create/' + merchantId)
			.send(invalidData)
			.expect(200)
			.set(commonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Phone Number Already Exists');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('4. Should not create Sub User as the store id is wrong.', function (done) {
		let invalidData = structuredClone(subUserCreateData);
		invalidData.store_id = 'abcde12345';
		Request(BaseUrl)
			.post('/sub-user/create/' + merchantId)
			.send(invalidData)
			.expect(200)
			.set(commonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Store Not Found!');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('6. Should not create Sub User as the sub user name is just an empty string', function (done) {
		let invalidData = structuredClone(subUserCreateData);
		invalidData.sub_user_name = '';
		Request(BaseUrl)
			.post('/sub-user/create/' + merchantId)
			.send(invalidData)
			.expect(200)
			.set(commonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Please provide Sub User Name.');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('7. Should not create Sub User as the sub user name is just a white space', function (done) {
		let invalidData = structuredClone(subUserCreateData);
		invalidData.sub_user_name = '          ';
		Request(BaseUrl)
			.post('/sub-user/create/' + merchantId)
			.send(invalidData)
			.expect(200)
			.set(commonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Please provide Sub User Name.');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('8. Should not create Sub User as the sub user name is not provided', function (done) {
		let invalidData = structuredClone(subUserCreateData);
		delete invalidData.sub_user_name;
		Request(BaseUrl)
			.post('/sub-user/create/' + merchantId)
			.send(invalidData)
			.expect(200)
			.set(commonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Please provide Sub User Name.');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('9. Should not create Sub User as the sub user name is not alphabetic', function (done) {
		let invalidData = structuredClone(subUserCreateData);
		invalidData.sub_user_name = '@!#$%';
		Request(BaseUrl)
			.post('/sub-user/create/' + merchantId)
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

	it('10. Should not create Sub User as the phone number is just an empty string', function (done) {
		let invalidData = structuredClone(subUserCreateData);
		invalidData.phone = '';
		Request(BaseUrl)
			.post('/sub-user/create/' + merchantId)
			.send(invalidData)
			.expect(200)
			.set(commonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Please provide Phone Number');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('11. Should not create Sub User as the phone number is just a white space', function (done) {
		let invalidData = structuredClone(subUserCreateData);
		invalidData.phone = '          ';
		Request(BaseUrl)
			.post('/sub-user/create/' + merchantId)
			.send(invalidData)
			.expect(200)
			.set(commonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Please provide Phone Number');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('12. Should not create Sub User as phone number is not provided', function (done) {
		let invalidData = structuredClone(subUserCreateData);
		delete invalidData.phone;
		Request(BaseUrl)
			.post('/sub-user/create/' + merchantId)
			.send(invalidData)
			.expect(200)
			.set(commonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Please provide Phone Number');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('13. Should not create Sub User as phone number is not Indian', function (done) {
		let invalidData = structuredClone(subUserCreateData);
		invalidData.phone = '1234567890';
		Request(BaseUrl)
			.post('/sub-user/create/' + merchantId)
			.send(invalidData)
			.expect(200)
			.set(commonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Please provide a valid Phone Number');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('14. Should not create Sub User as the store id is just an empty string', function (done) {
		let invalidData = structuredClone(subUserCreateData);
		invalidData.store_id = '';
		Request(BaseUrl)
			.post('/sub-user/create/' + merchantId)
			.send(invalidData)
			.expect(200)
			.set(commonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Please provide the store Name');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('15. Should not create Sub User as the store id is just a white space', function (done) {
		let invalidData = structuredClone(subUserCreateData);
		invalidData.store_id = '          ';
		Request(BaseUrl)
			.post('/sub-user/create/' + merchantId)
			.send(invalidData)
			.expect(200)
			.set(commonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Please provide the store Name');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('16. Should not create Sub User as store id is not provided', function (done) {
		let invalidData = structuredClone(subUserCreateData);
		delete invalidData.store_id;
		Request(BaseUrl)
			.post('/sub-user/create/' + merchantId)
			.send(invalidData)
			.expect(200)
			.set(commonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Please provide the store Name');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('17. Should not create Sub User as the VPA id is just an empty string', function (done) {
		let invalidData = structuredClone(subUserCreateData);
		invalidData.vpa_id = '';
		Request(BaseUrl)
			.post('/sub-user/create/' + merchantId)
			.send(invalidData)
			.expect(200)
			.set(commonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Please provide VPA ID');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('18. Should not create Sub User as the VPA id is just a white space', function (done) {
		let invalidData = structuredClone(subUserCreateData);
		invalidData.vpa_id = '          ';
		Request(BaseUrl)
			.post('/sub-user/create/' + merchantId)
			.send(invalidData)
			.expect(200)
			.set(commonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Please provide VPA ID');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('19. Should not create Sub User as VPA id is not provided', function (done) {
		let invalidData = structuredClone(subUserCreateData);
		delete invalidData.vpa_id;
		Request(BaseUrl)
			.post('/sub-user/create/' + merchantId)
			.send(invalidData)
			.expect(200)
			.set(commonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Please provide VPA ID');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('20. Should not create Sub User as request body is not provided', function (done) {
		Request(BaseUrl)
			.post('/sub-user/create/' + merchantId)
			.expect(200)
			.set(commonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Please provide Sub User Name.');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('21. Should not create Sub User as merchant Id provided does not exists', function (done) {
		Request(BaseUrl)
			.post('/sub-user/create/wrong123id')
			.send(subUserCreateData)
			.expect(200)
			.set(commonHeader)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Merchant Not Found!');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('22. Should not create sub User as the commonHeader or Kong request header is missing', function (done) {
		Request(BaseUrl)
			.post('/sub-user/create/' + merchantId)
			.send(subUserCreateData)
			.expect(406)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Wrong CSRF Token');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('23. Should not create sub user as user role is not admin/sub-admin', function (done) {
		let invalidToken = {...commonHeader};
		invalidToken['x-consumer-username'] = 'notAdmin_2521678';
		Request(BaseUrl)
			.post('/sub-user/create/' + merchantId)
			.send(subUserCreateData)
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

	it('24. Should not create sub user as user id is not valid', function (done) {
		let invalidToken = {...commonHeader};
		invalidToken['x-consumer-username'] = 'admin_2521678';
		Request(BaseUrl)
			.post('/sub-user/create/' + merchantId)
			.send(subUserCreateData)
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

	it('25. Should not create sub user as the merchant does not own the store provided.', function (done) {
		let invalidData = structuredClone(subUserCreateData);
		invalidData.store_id = 'qwe234af34';
		Request(BaseUrl)
			.post('/sub-user/create/' + merchantId)
			.set(commonHeader)
			.send(invalidData)
			.expect(200)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Store Not Found!');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('26. Should not create sub user as the merchantId is not provided.', function (done) {
		Request(BaseUrl)
			.post('/sub-user/create/')
			.send(subUserCreateData)
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
});
