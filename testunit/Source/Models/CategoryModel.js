const DBConnection = require('../App/Connection');
const PropertyDataBase = DBConnection.getPropertyDBConnection();
const Timestamps = require('mongoose-timestamp');

const CategorySchema = new PropertyDataBase.Schema({
	code: {type: String, default: ''},
	category_id: {type: String},
	label: {type: String},
	type: {type: String},
	status: {type: String, default: 'active'},
	parent: {
		id: {type: String, default: ''},
		name: {type: String, default: ''}
	},
	is_address_mandatory: {type: Boolean, default: true},
	priority: {type: Number, default: 0}
});

CategorySchema.plugin(Timestamps);

const CategoryModel = PropertyDataBase.model('categories', CategorySchema);

module.exports = CategoryModel;
