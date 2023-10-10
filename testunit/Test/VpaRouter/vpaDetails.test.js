const Request = require('supertest');
const Expect = require('chai').expect;
const dotenv = require('dotenv');
dotenv.config();

const BaseUrl = 'http://localhost:1507';
const CommonHeader = {
	['x-consumer-username']: 'admin_zoHP@GkUR'
};
const vpaId = {
	valid: 'ippostorecrwtbwessxi4h@icici',
	invalid: 'ippostortbwessxi4h@icici'
};

describe('VPA Details ', function () {
	it('Should not fetch details when no UserRole and UserId given', function (done) {
		Request(BaseUrl)
			.get(`/api/store-admin/vpa/details/${vpaId.valid}`)
			.then((response) => {
				Expect(response.body.message).to.be.eql('Unauthorized Access!');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('Should not fetch details when correct UserRole and incorrect UserId given', function (done) {
		let headers = Object.assign({}, CommonHeader);
		headers['x-consumer-username'] = 'admin_zoHPrRdUR';

		Request(BaseUrl)
			.get(`/api/store-admin/vpa/details/${vpaId.valid}`)
			.set(headers)
			.then((response) => {
				Expect(response.body.message).to.be.eql('Not a valid user!');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('Should not fetch details when incorrect UserRole and correct UserId given', function (done) {
		//let headers = {...CommonHeader};
		let headers = Object.assign({}, CommonHeader);
		headers['x-consumer-username'] = 'wrongrole_zoHP@GKUR';

		Request(BaseUrl)
			.get(`/api/store-admin/vpa/details/${vpaId.valid}`)
			.set(headers)
			.then((response) => {
				Expect(response.body.message).to.be.eql('Not a valid user');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('Should  fetch details when all inputs are correctly given', function (done) {
		Request(BaseUrl)
			.get(`/api/store-admin/vpa/details/${vpaId.valid}`)
			.set(CommonHeader)
			.then((response) => {
				Expect(response.body.success).to.be.true;
				Expect(response.body.message).to.be.eql('Vpa Details are');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it(' Should not give details as the vpaId not provided.', function (done) {
		Request(BaseUrl)
			.post('/vpa/details')
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
