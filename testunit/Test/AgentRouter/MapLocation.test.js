const Request = require('supertest');
const Expect = require('chai').expect;
const dotenv = require('dotenv');
dotenv.config();

const BaseUrl = 'http://localhost:1507/api/store-admin';

let requestData = {
	location: {
		area: 'Chennai',
		city: {name: 'Amalapuram', code: '1005'},
		flat_no: '65',
		pincode: '600026',
		state: {name: 'Andhra Pradesh', code: 'AP'},
		street_name: 'West street'
	}
};

let commonHeader = {
	['x-consumer-username']: 'admin_zoHP@GkUR'
};

describe('Approve Clock In', function () {
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
	it('1.Should create a update phone with valid request data', function (done) {
		Request(BaseUrl)
			.post('/agent/location-mapping/GbLZaePp3')
			.send(requestData)
			.expect(200)
			.set(commonHeader)
			.then((responce) => {
				Expect(responce?.body?.message).to.be.eql('Location mapped successfully!!');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('2.Should not create map location as the common header is not set.', function (done) {
		Request(BaseUrl)
			.get('/agent/location-mapping/GbLZaePp3')
			.expect(401)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Unauthorized Access!');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});
	describe('Approve Clock In', function () {
		it('3.Should location map data with valid request', function (done) {
			let invalidData = structuredClone(requestData);
			delete invalidData.location.flat_no;
			Request(BaseUrl)
				.post('/agent/location-mapping/GbLZaePp3')
				.send(invalidData)
				.expect(422)
				.set(commonHeader)
				.then((responce) => {
					Expect(responce?.body?.message).to.be.eql('Please provide flat no');
					done();
				})
				.catch((error) => {
					done(error);
				});
		});
	});
});
