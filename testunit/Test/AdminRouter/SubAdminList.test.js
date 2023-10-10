const Request = require('supertest');
const Expect = require('chai').expect;
const dotenv = require('dotenv');
dotenv.config();

const BaseUrl = 'http://localhost:1507/api/store-admin';

let commonHeader = {
	['x-consumer-username']: 'admin_BWpaitTqT5'
};

describe('Sub Admin List', function () {
	it('1. Should list sub admin', function (done) {
		Request(BaseUrl)
			.get('/admin/list')
			.set(commonHeader)
			.expect(200)
			.then((response) => {
				Expect(response?.body?.message).to.eql('Sub Admins List');
				Expect(response?.body?.data).to.include.keys('Sub_Admins', 'total');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('2. Should list sub admin when the limit is given as 2', function (done) {
		Request(BaseUrl)
			.get('/admin/list?limit=2')
			.set(commonHeader)
			.expect(200)
			.then((response) => {
				Expect(response?.body?.message).to.eql('Sub Admins List');
				Expect(response?.body?.data).to.include.keys('Sub_Admins', 'total');
				Expect(response?.body?.data?.total).to.eql(2);
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('3. Should not list any sub admin when the limit is not a number', function (done) {
		Request(BaseUrl)
			.get('/admin/list?limit=15aas')
			.set(commonHeader)
			.expect(200)
			.then((response) => {
				Expect(response?.body?.message).to.eql('Limit must be a number');
				Expect(response?.body?.success).to.eql(false);
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('4. Should not list any sub admin when the page is given as 15', function (done) {
		Request(BaseUrl)
			.get('/admin/list?page=15')
			.set(commonHeader)
			.expect(200)
			.then((response) => {
				Expect(response?.body?.message).to.eql('Sub Admins List');
				Expect(response?.body?.success).to.eql(true);
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('5. Should not list any sub admin when the page is not a number', function (done) {
		Request(BaseUrl)
			.get('/admin/list?page=15aa')
			.set(commonHeader)
			.expect(200)
			.then((response) => {
				Expect(response?.body?.message).to.eql('Page must be a number');
				Expect(response?.body?.success).to.eql(false);
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('6. Should not list any sub admin when the from_time is not a date', function (done) {
		Request(BaseUrl)
			.get('/admin/list?from_time=sddgfhg')
			.set(commonHeader)
			.expect(200)
			.then((response) => {
				Expect(response?.body?.message).to.eql('Must be a date');
				Expect(response?.body?.success).to.eql(false);
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('7. Should not list any sub admin when the to_time is not a date', function (done) {
		Request(BaseUrl)
			.get('/admin/list?to_time=sddgfhg')
			.set(commonHeader)
			.expect(200)
			.then((response) => {
				Expect(response?.body?.message).to.eql('Must be a date');
				Expect(response?.body?.success).to.eql(false);
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('8. Should not list any sub admin when the status is not active or deactive', function (done) {
		Request(BaseUrl)
			.get('/admin/list?status=accctiv')
			.set(commonHeader)
			.expect(200)
			.then((response) => {
				Expect(response?.body?.message).to.eql('Please provide status as active or deactive');
				Expect(response?.body?.success).to.eql(false);
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('9. Should list any sub admin when the status is active', function (done) {
		Request(BaseUrl)
			.get('/admin/list?status=active')
			.set(commonHeader)
			.expect(200)
			.then((response) => {
				Expect(response?.body?.message).to.eql('Sub Admins List');
				Expect(response?.body?.data).to.include.keys('Sub_Admins', 'total');
				let admins = response?.body?.data?.Sub_Admins;
				for (let admin of admins) {
					Expect(admin.status).to.be.eql('active');
				}
				Expect(response?.body?.success).to.eql(true);
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('10. Should list any sub admin when the status is deactive', function (done) {
		Request(BaseUrl)
			.get('/admin/list?status=deactive')
			.set(commonHeader)
			.expect(200)
			.then((response) => {
				Expect(response?.body?.message).to.eql('Sub Admins List');
				Expect(response?.body?.data).to.include.keys('Sub_Admins', 'total');
				let admins = response?.body?.data?.Sub_Admins;
				for (let admin of admins) {
					Expect(admin.status).to.be.eql('deactive');
				}
				Expect(response?.body?.success).to.eql(true);
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('11. Should not list any sub admin when the email is not valid', function (done) {
		Request(BaseUrl)
			.get('/admin/list?email=wrong@dks')
			.set(commonHeader)
			.expect(200)
			.then((response) => {
				Expect(response?.body?.message).to.eql('Must be a valid email ID');
				Expect(response?.body?.success).to.eql(false);
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('12. Should not list any sub admin when the phone number is not valid', function (done) {
		Request(BaseUrl)
			.get('/admin/list?phone=12340506789')
			.set(commonHeader)
			.expect(200)
			.then((response) => {
				Expect(response?.body?.message).to.eql('Please provide a valid Phone Number');
				Expect(response?.body?.success).to.eql(false);
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('13. Should list any sub admin when name is given', function (done) {
		Request(BaseUrl)
			.get('/admin/list?name=Ya%20Min%20Thwe')
			.set(commonHeader)
			.expect(200)
			.then((response) => {
				Expect(response?.body?.message).to.eql('Sub Admins List');
				Expect(response?.body?.data).to.include.keys('Sub_Admins', 'total');
				let admins = response?.body?.data?.Sub_Admins;
				for (let admin of admins) {
					Expect(admin.name.full).to.be.eql('Ya Min Thwe');
				}
				Expect(response?.body?.success).to.eql(true);
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('14. Should list any sub admin when admin_id is given', function (done) {
		Request(BaseUrl)
			.get('/admin/list?admin_id=BWpaitTqT5')
			.set(commonHeader)
			.expect(200)
			.then((response) => {
				Expect(response?.body?.message).to.eql('Sub Admins List');
				Expect(response?.body?.data).to.include.keys('Sub_Admins', 'total');
				let admins = response?.body?.data?.Sub_Admins;
				for (let admin of admins) {
					Expect(admin.admin_id).to.be.eql('BWpaitTqT5');
				}
				Expect(response?.body?.success).to.eql(true);
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('15. Should list all sub admins as query is not prefined.', function (done) {
		Request(BaseUrl)
			.get('/admin/list?role=merchant')
			.set(commonHeader)
			.expect(200)
			.then((response) => {
				Expect(response?.body?.message).to.eql('Sub Admins List');
				Expect(response?.body?.data).to.include.keys('Sub_Admins', 'total');
				let admins = response?.body?.data?.Sub_Admins;
				for (let admin of admins) {
					Expect(admin.acc_type).to.be.not.eql('merchant');
				}
				Expect(response?.body?.success).to.eql(true);
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('16. Should not list sub admins as the commonHeader or Kong request header is missing', function (done) {
		Request(BaseUrl)
			.get('/admin/list')
			.expect(200)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Unauthorized Access!');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('17. Should not list sub admins as user role is not admin', function (done) {
		let invalidToken = {
			['x-consumer-username']: 'notAdmin_2521678'
		};
		Request(BaseUrl)
			.get('/admin/list')
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

	it('18. Should not list sub admins as user id is not valid', function (done) {
		let invalidToken = {
			['x-consumer-username']: 'admin_2521678'
		};
		Request(BaseUrl)
			.get('/admin/list')
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
});
