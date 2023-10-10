const DBConnection = require('../App/Connection');
const PropertyDataBase = DBConnection.getPropertyDBConnection();
const Timestamps = require('mongoose-timestamp');

const CitySchema = new PropertyDataBase.Schema({
	code: {
		type: String
	},
	city: {
		type: String
	},
	state: {
		type: String
	},
	priority: {
		type: Number,
		default: 0
	}
});

CitySchema.plugin(Timestamps);

const CityModel = PropertyDataBase.model('cities', CitySchema);

module.exports = CityModel;
