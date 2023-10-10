const csurf = require('csurf');

const csrfValidation = (request, response, next) => {
	const WhitelistedRoutes = ['/api/store-admin/auth/login', '/api/store-admin/auth/login/verify-otp'];
	const path = request.path;
	return WhitelistedRoutes.includes(path)
		? next()
		: csurf({
				cookie: {
					httpOnly: true,
					sameSite: 'none',
					secure: true,
					expires: new Date(Date.now() + 12 * 60 * 60),
					maxAge: 12 * 60 * 60
				}
		  })(request, response, next);
};

module.exports = csrfValidation;
