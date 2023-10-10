const Request = require('supertest');
const Expect = require('chai').expect;
const dotenv = require('dotenv');
dotenv.config();

const BaseUrl = 'http://localhost:1507/api/store-admin';

let commonHeader = {
	['x-consumer-username']: 'admin_BWpaitTqT5'
};

describe('Survey List', function () {
	it('1. Should show all surveys list', function (done) {
		Request(BaseUrl)
			.get('/survey/list')
			.set(commonHeader)
			.expect(200)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Survey Lists are');
				Expect(response?.body?.data).to.include.keys('surveys', 'total', 'count');
				Expect(response?.body?.data?.surveys[0]).to.contains.keys(
					'survey_id',
					'is_lead',
					'documents',
					'step',
					'merchant',
					'store',
					'category',
					'location',
					'questionnaires',
					'images',
					'feedback',
					'data_collected_by',
					'reference',
					'createdAt'
				);
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('2. Should not list any surveys as the common header is not set', function (done) {
		Request(BaseUrl)
			.get('/survey/list')
			.expect(401)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Unauthorized Access!');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('3. Should not list any surveys as the person is not logged in user', function (done) {
		Request(BaseUrl)
			.get('/survey/list')
			.set({['x-consumer-username']: 'merchant_BWpaitTqT5'})
			.expect(401)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Not a valid user');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('4. Should not list any surveys as the admin id is unauthorized', function (done) {
		Request(BaseUrl)
			.get('/survey/list')
			.set({['x-consumer-username']: 'admin_123redd'})
			.expect(401)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Not a valid user!');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('5. Should list only 2 surveys as the limit is only 2.', function (done) {
		Request(BaseUrl)
			.get('/survey/list?limit=2')
			.set(commonHeader)
			.expect(200)
			.then((response) => {
				Expect(response?.body?.data?.count).to.be.eql(2);
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('6. Should list the survey if the survey id given in the query.', function (done) {
		Request(BaseUrl)
			.get('/survey/list?survey_id=5qFOs9QGl')
			.set(commonHeader)
			.expect(200)
			.then((response) => {
				Expect(response?.body?.data?.surveys[0].survey_id).to.be.eql('5qFOs9QGl');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('7. Should not list surveys as the limit is not a number.', function (done) {
		Request(BaseUrl)
			.get('/survey/list?limit=asd12')
			.set(commonHeader)
			.expect(422)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Limit must be a number');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('8. Should not list surveys as the page is not a number.', function (done) {
		Request(BaseUrl)
			.get('/survey/list?page=asd12')
			.set(commonHeader)
			.expect(422)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Page must be a number');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('9. Should not list surveys as the from_time is not a date.', function (done) {
		Request(BaseUrl)
			.get('/survey/list?from_time=12-12-1996')
			.set(commonHeader)
			.expect(422)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Must be a date with format yyyy-mm-dd');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('10. Should not list surveys as the to_time is not a date.', function (done) {
		Request(BaseUrl)
			.get('/survey/list?to_time=12-12-1996')
			.set(commonHeader)
			.expect(422)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Must be a date with format yyyy-mm-dd');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('11. Should not list surveys as the step is not a number.', function (done) {
		Request(BaseUrl)
			.get('/survey/list?step=www')
			.set(commonHeader)
			.expect(422)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('The value for step is either 1, 2, 3, or 4');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('12. Should not list surveys as the step is not a number between 1 to 4.', function (done) {
		Request(BaseUrl)
			.get('/survey/list?step=5')
			.set(commonHeader)
			.expect(422)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('The value for step is either 1, 2, 3, or 4');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('13. Should not list surveys as the status is neither pending nor completed', function (done) {
		Request(BaseUrl)
			.get('/survey/list?status=pendin')
			.set(commonHeader)
			.expect(422)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('Status should be either pending or completed!');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('14. Should not list surveys as the date_option is wrong', function (done) {
		Request(BaseUrl)
			.get('/survey/list?date_option=pendin')
			.set(commonHeader)
			.expect(422)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql(
					'date_option must have today, yesterday, weekly, monthly, or yearly values only'
				);
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('15. Should not list surveys as the is_lead is not boolean', function (done) {
		Request(BaseUrl)
			.get('/survey/list?is_lead=yes')
			.set(commonHeader)
			.expect(422)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('The value for is_lead is true or false');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('16. Should not list surveys as the merchant_type is wrong', function (done) {
		Request(BaseUrl)
			.get('/survey/list?merchant_type=sole_proprietor')
			.set(commonHeader)
			.expect(422)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql(
					'The merchant type should be proprietor, partnership, or companies'
				);
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('17. Should not list surveys as the outlet_type is wrong', function (done) {
		Request(BaseUrl)
			.get('/survey/list?outlet_type=fix')
			.set(commonHeader)
			.expect(422)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql('The Outlet Type should be fixed or non_fixed');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('18. Should not list surveys as the turnover is wrong', function (done) {
		Request(BaseUrl)
			.get('/survey/list?turnover=30')
			.set(commonHeader)
			.expect(422)
			.then((response) => {
				Expect(response?.body?.message).to.be.eql(
					'Turn Over per month should be of values 0, 0-1_lakh, 1-5_lakh, 5-10_lakh, 10-30_lakh, 30plus_lakh'
				);
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('19. Should list surveys with given agent_id', function (done) {
		Request(BaseUrl)
			.get('/survey/list?agent_id=5078qwew')
			.set(commonHeader)
			.expect(200)
			.then((response) => {
				response?.body?.data?.surveys.map((element) => {
					Expect(element?.data_collected_by?.agent_id).to.be.eql('5078qwew');
				});
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('20. Should list surveys with given turnover', function (done) {
		Request(BaseUrl)
			.get('/survey/list?turnover=10-30_lakh')
			.set(commonHeader)
			.expect(200)
			.then((response) => {
				response?.body?.data?.surveys.map((element) => {
					Expect(element?.store?.turnover).to.be.eql('10-30_lakh');
				});
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('21. Should list surveys with given merchant type', function (done) {
		Request(BaseUrl)
			.get('/survey/list?merchant_type=partnership')
			.set(commonHeader)
			.expect(200)
			.then((response) => {
				response?.body?.data?.surveys.map((element) => {
					Expect(element?.merchant?.merchant_type).to.be.eql('partnership');
				});
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('22. Should list surveys with given outlet type', function (done) {
		Request(BaseUrl)
			.get('/survey/list?outlet_type=non_fixed')
			.set(commonHeader)
			.expect(200)
			.then((response) => {
				response?.body?.data?.surveys.map((element) => {
					Expect(element?.store?.outlet_type).to.be.eql('non_fixed');
				});
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('23. Should list surveys with given step', function (done) {
		Request(BaseUrl)
			.get('/survey/list?step=2')
			.set(commonHeader)
			.expect(200)
			.then((response) => {
				response?.body?.data?.surveys.map((element) => {
					Expect(element?.step).to.be.eql(2);
				});
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('24. Should list surveys with given is lead', function (done) {
		Request(BaseUrl)
			.get('/survey/list?is_lead=true')
			.set(commonHeader)
			.expect(200)
			.then((response) => {
				response?.body?.data?.surveys.map((element) => {
					Expect(element?.is_lead).to.be.true;
				});
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('25. Should list surveys with given date option', function (done) {
		Request(BaseUrl)
			.get('/survey/list?date_option=today')
			.set(commonHeader)
			.expect(200)
			.then((response) => {
				let today = JSON.stringify(new Date())?.split('T')[0]?.split('"')[1];
				response?.body?.data?.surveys?.map((element) => {
					Expect(element?.createdAt).to.include(today);
				});
				done();
			})
			.catch((error) => {
				done(error);
			});
	});

	it('26. Should list surveys with given from time and to time', function (done) {
		Request(BaseUrl)
			.get('/survey/list?from_time=2023-07-29&to_time=2023-08-03')
			.set(commonHeader)
			.expect(200)
			.then((response) => {
				response?.body?.data?.surveys?.map((element) => {
					Expect(new Date(element?.createdAt)).to.not.gt(new Date('2023-08-04'));
					Expect(new Date(element?.createdAt)).to.not.lt(new Date('2023-07-29'));
				});
				done();
			})
			.catch((error) => {
				done(error);
			});
	});
});
