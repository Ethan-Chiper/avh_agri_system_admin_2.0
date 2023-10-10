const DBConnection = require('../App/Connection');
const AgentDataBase = DBConnection.getAgentDBConnection();
const Timestamps = require('mongoose-timestamp');

const tokenSchema = new AgentDataBase.Schema({
	token_id: String,
	auth_id: String,
	merchant_id: String,
	devicedetails: Object
});

tokenSchema.plugin(Timestamps);

const TokenModel = AgentDataBase.model('tokens', tokenSchema);

module.exports = TokenModel;
