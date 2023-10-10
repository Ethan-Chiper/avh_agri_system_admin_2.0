const Request = require('supertest');
const Expect = require('chai').expect;
const dotenv = require('dotenv');
dotenv.config();

const BaseUrl = 'http://localhost:1507';
const CommonHeader = {
	['x-consumer-username']: 'admin_zoHP@GkUR'
};

describe('Fetch Ifsc Details', function () {
	it('should return invalid ifsc when given wrong ifsc code', function (done) {
		Request(BaseUrl)
			.get('/api/store-admin/bank/fetch-ifsc-details/ABCD1234567')
			.set(CommonHeader)
			.then((response) => {
				Expect(response.body.success).to.be.false;
				Expect(response.body.message).to.be.eql('ifsc code is not valid');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('should return error if bank data is not found for the given ifsc', function (done) {
		Request(BaseUrl)
			.get('/api/store-admin/bank/fetch-ifsc-details/KVBL0001244')
			.set(CommonHeader)
			.then(() => {
				done();
			})
			.catch((error) => {
				Expect(error.body.success).to.be.false;
				Expect(error.body.message).to.be.eql('Invalid IFSC Code');
				done(error);
			});
	});

	it('should return bank details for a valid ifsc code', function (done) {
		Request(BaseUrl)
			.get('/api/store-admin/bank/fetch-ifsc-details/KVBL0001244')
			.set(CommonHeader)
			.then((response) => {
				Expect(response.body.success).to.be.true;
				Expect(response.body.message).to.be.eql('Ifsc data');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('Should not fetch details when no UserRole and UserId given', function (done) {
		Request(BaseUrl)
			.get('/api/store-admin/bank/fetch-ifsc-details/KVBL0001244')
			.then((response) => {
				Expect(response.body.message).to.be.eql('Unauthorized Access!');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('Should not fetch details when incorrect UserRole and correct UserId given', function (done) {
		let headers = Object.assign({}, CommonHeader);
		headers['x-consumer-username'] = 'wrongrole_zoHP@GKUR';

		Request(BaseUrl)
			.get('/api/store-admin/bank/fetch-ifsc-details/KVBL0001244')
			.set(headers)
			.then((response) => {
				Expect(response.body.message).to.be.eql('Not a valid user');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('Should not fetch details when correct UserRole and incorrect UserId given', function (done) {
		let headers = {...CommonHeader};
		headers['x-consumer-username'] = 'admin_zoHP@GR';
		Request(BaseUrl)
			.get('/api/store-admin/bank/fetch-ifsc-details/KVBL0001244')
			.set(headers)
			.then((response) => {
				Expect(response.body.message).to.be.eql('Not a valid user!');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('Should not fetch details as the ifscCode not provided.', function (done) {
		Request(BaseUrl)
			.get('/api/store-admin/bank/fetch-ifsc-details')
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
