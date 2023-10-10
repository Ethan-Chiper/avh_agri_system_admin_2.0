const DBConnection = require('../App/Connection');
const PropertyDataBase = DBConnection.getPropertyDBConnection();
const Timestamps = require('mongoose-timestamp');

const StateSchema = new PropertyDataBase.Schema({
	name: {
		type: String,
		required: true
	},
	code: {
		type: String,
		required: true
	},
	is_enabled: {type: Boolean, default: true}
});

StateSchema.plugin(Timestamps);

const StateModel = PropertyDataBase.model('states', StateSchema);

module.exports = StateModel;
