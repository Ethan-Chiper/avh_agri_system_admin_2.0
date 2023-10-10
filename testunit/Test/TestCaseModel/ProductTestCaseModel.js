const DBConnection = require('../../Source/App/Connection');
const PropertyDataBase = DBConnection.getTestProductDBConnection();
const timestamps = require('mongoose-timestamp');

const ProductSchema = new PropertyDataBase.Schema({
	success: {type: Boolean, default: false},
	message: {type: String},
	data: {
		product_id: {type: String, default: ''},
		name: {type: String, default: ''},
		price: {type: String, default: ''},
		tax: {type: String, default: ''},
		image: {type: String, default: ''},
		mmc: {type: String, default: ''},
		status: {type: String}
	}
});
ProductSchema.plugin(timestamps);
const ProductModel = PropertyDataBase.model('test_pos_product', ProductSchema);

module.exports = ProductModel;
