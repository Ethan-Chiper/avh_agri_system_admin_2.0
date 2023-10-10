const loginController = require('../../Source/Controller/LoginController');
const Expect = require('chai').expect;

let requestData = {
	email: 'admin@ippopay.com',
	password: 'Ippostore@123!'
};

let loginDevice = 'PostmanRuntime/7.31.1';

describe('Admin Login Route', function () {
	it('1. Should log in as admin', async function () {
		try {
			let {error, message, data} = await loginController.login(requestData, loginDevice);
			Expect(error).to.be.false;
			Expect(message).to.be.eql('Login Success');
			Expect(data);
		} catch (error) {
			throw new Error(error);
		}
	});

	it('2. Should not log in as admin as the requestData is undefined.', async function () {
		try {
			let {error, message, data} = await loginController.login(undefined, loginDevice);
			Expect(error).to.be.true;
			Expect(message).to.be.eql('Please provide request body and/or login device detail.');
			Expect(data).to.be.undefined;
		} catch (error) {
			throw new Error(error);
		}
	});

	it('3. Should not log in as admin as the loginDevice is undefined.', async function () {
		try {
			let {error, message, data} = await loginController.login(requestData);
			Expect(error).to.be.true;
			Expect(message).to.be.eql('Please provide request body and/or login device detail.');
			Expect(data).to.be.undefined;
		} catch (error) {
			throw new Error(error);
		}
	});

	it('4. Should not log in as admin as the email is wrong.', async function () {
		requestData.email = 'wrongemailid@gmail.com';
		try {
			let {error, message, data} = await loginController.login(requestData, loginDevice);
			Expect(error).to.be.true;
			Expect(message).to.be.eql('Invalid credentials');
			Expect(data).to.be.undefined;
		} catch (error) {
			throw new Error(error);
		}
	});

	it('5. Should not log in as admin as the password as well as email is wrong.', async function () {
		requestData.password = 'wrongPassword';
		try {
			let {error, message, data} = await loginController.login(requestData, loginDevice);
			Expect(error).to.be.true;
			Expect(message).to.be.eql('Invalid credentials');
			Expect(data).to.be.undefined;
		} catch (error) {
			throw new Error(error);
		}
	});

	it('6. Should not log in as admin as the password is wrong.', async function () {
		requestData.email = 'admin@ippopay.com';
		try {
			let {error, message, data} = await loginController.login(requestData, loginDevice);
			Expect(error).to.be.true;
			Expect(message).to.be.eql('Invalid credentials');
			Expect(data).to.be.undefined;
		} catch (error) {
			throw new Error(error);
		}
	});

	it('7. Should not log in as admin as the status of admin is deactive.', async function () {
		requestData.email = 'adminwrong@ippopay.com';
		requestData.password = 'Ippostore@123!';
		try {
			const {error, message, data} = await loginController.login(requestData, loginDevice);
			Expect(error).to.be.true;
			Expect(message).to.be.eql('Your account is not active yet');
			Expect(data).to.be.undefined;
		} catch (error) {
			throw new Error(error);
		}
	});

	it('8. Should ask to verify otp as the login device is different.', async function () {
		requestData.email = 'testing@ippopay.com';
		try {
			const {error, message, data} = await loginController.login(requestData, loginDevice);
			Expect(error).to.be.false;
			Expect(message).to.be.eql('Please verify the OTP sent.');
			Expect(data).to.be.undefined;
		} catch (error) {
			throw new Error(error);
		}
	});
});
