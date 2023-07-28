const Dotenv = require('dotenv');
Dotenv.config({path: 'Source/App/.env'});
const environment = process.env;
module.exports = {
    AGRI_DB_URL: environment.DB_URL_AGRI_SYSTEM || 'mongodb://localhost:27017/agri_world',
    KONG_URL: environment.KONG_API || 'http://192.168.0.108:7001/consumers/'
};