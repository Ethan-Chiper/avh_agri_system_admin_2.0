/* eslint-disable node/no-unpublished-require */
const Expect = require('chai').expect;
describe('sample test', function () {
	it('sample test for skip', function (done) {
		let data = 'hai';
		Expect(data).to.be.equal('hai');
		done();
	});
});
