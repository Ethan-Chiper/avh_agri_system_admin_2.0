const Connection = require('../App/MultiConnection');
const customerConnection = Connection.getCustomerDBConnection();
const timestamps = require('mongoose-timestamp');
const mongoose = require('mongoose');

const customerSchema = new customerConnection.Schema({
	customer_id: {type: String},
	name: {
		full: {type: String, default: ''}
	},
	mobile: {
		country_code: {type: String, default: '+91'},
		national_number: {type: String, default: ''},
		is_verified: {type: Boolean, default: false},
		otp: {type: String, default: '0123'}
	},
	phone: {
		country_code: {type: String, default: '+91'},
		national_number: String,
		is_verified: {type: Boolean, default: false},
		otp: {type: String, default: '2010'}
	},
	email: {type: String, unique: true},
	verification_code: String,
	is_verified: {type: Boolean, default: false},
	status: {type: String, default: 'active'},
	password: {type: String, default: '0000'},

	settings: {
		invoice: {
			notes: {type: String, default: ''},
			terms: {type: String, default: ''},
			use_for_future: {type: Boolean, default: false},
			incrementer: {type: Number, default: 0}
		},
		time_zone: {
			name: {type: String, default: 'Asia/ Kolkata'},
			label: {type: String, default: 'Indian Standard Time'},
			offset: {type: String, default: '+0530'}
		},
		is_agri_sys_branding: {type: Boolean, default: true},
		is_terms_page: {type: Boolean, default: false}
	},
	acc_type: {type: String, default: 'individual'},
	address: {
		billing: {
			line_1: {type: Object, default: ''},
			line_2: {type: Object, default: ''},
			city: {type: Object, default: {}},
			zipcode: {type: Object, default: ''},
			country: {type: Object, default: {}},
			state: {type: Object, default: {}}
		},
		shipping: {
			line_1: {type: Object, default: ''},
			line_2: {type: Object, default: ''},
			city: {type: Object, default: {}},
			zipcode: String,
			country: {type: Object, default: {}},
			state: {type: Object, default: {}}
		},
		is_same_billing: {type: Boolean, default: true}
	},
	currency: {type: String, default: 'INR'},
	bank_info: Object,
	bank_approval_status: {type: String, default: 'pending'},
	internal: {
		reference: {
			id: {type: Object, default: ''},
			invite_id: {type: Object, default: ''}
		},
		registration: {
			type: {type: String, default: 'merchant'},
			platform: {type: String, default: 'web'}
		}
	},
	is_intlcurrency_enabled: {type: Boolean, default: false},
	is_socialcom_enabled: {type: Boolean, default: false},
	is_referral_invite_enabled: {type: Boolean, default: false},
	is_2fa_enabled: {type: Boolean, default: false},
	pg_category: {type: String, default: 'ecom'},
	last_login: {
		from: {type: String, default: 'web'},
		meta: Object
	},
	documents: {
		aadhar: {
			number:{type: String,default:''},
			image: {
				front:{type: String,default:''},
				back: {type: String,default:''}
			}
		},
		pan: {
			number: {type: String,default:''},
			image: {
				front: {type: String,default:''}
			}
		},
		status: {type: String, required: true, default: 'unfilled'},
		reject_reasons: Array
	},
	payout: {
		status: {type: String, required: true, enum: ['pending', 'requested', 'approved'], default: 'pending'},
		account: {
			name: {type: String,default:''},
			account_number: {type: String,default:''},
			ifsc: {type: String,default:''}
		}
	},
	pass_code: {type: String,default:''}
});
customerSchema.plugin(timestamps);

let customerModel = mongoose.model('customer', customerSchema);

module.exports = customerModel;
