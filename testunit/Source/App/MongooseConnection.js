/* eslint-disable security/detect-object-injection */
let mongoose = require('mongoose');
// eslint-disable-next-line node/exports-style
exports.create = () => {
	let key, mongeese, value;
	mongeese = new mongoose.Mongoose();
	for (key in mongoose) {
		// eslint-disable-next-line no-prototype-builtins
		if (mongoose.hasOwnProperty(key)) {
			value = mongoose[key];
			if (!mongeese[key]) {
				mongeese[key] = value;
			}
		}
	}
	return mongeese;
};
