const {customAlphabet} = require('nanoid');
const request = require("request");
const Config = require('../App/Config')
const jwt = require("jsonwebtoken");
const moment = require("moment");

function utils() {
	let self = this;

	/***
	 *
	 */
	this.getNanoId = () => {
		let alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890';
		let randomId = customAlphabet(alphabet, 8);
		return randomId();
	};
	/***
	 *
	 */
	this.createUserAndTokenInKong = (id, callback) => {
		let options = {
			url: Config.KONG_URL,
			form: {
				username: id
			},
			method:"POST"
		}
		request.post(options, (err, data) => {
			console.log(err);
			if (!err)
				self.generateAuthToken(id, callback);
			else if (callback) callback(null);

		});
	};
	/***
	 *
	 * @param user
	 * @param callback
	 */
	this.generateAuthToken = (user, callback) => {
		let exp = moment().add(1, "days").unix();

		request.post({
			url: Config.KONG_URL + user + "/jwt",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded"
			}
		}, (err, response, body) => {
			if (body) {
				let bodyResponse = JSON.parse(body)
				try {
					let token = jwt.sign({
						iss: bodyResponse.key,
						exp: exp
					}, bodyResponse.secret);
					callback(token, body);
				} catch (err) {
					console.log("Exception from generateAuthToken" + err.message);
					callback(null, {});
				}
			} else
				callback(null, {});
		});
	}
}

module.exports = new utils();