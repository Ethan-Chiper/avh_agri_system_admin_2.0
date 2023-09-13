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
		national_number: String,
		is_verified: {type: Boolean, default: false},
		otp: String
	},
	phone: {
		country_code: {type: String, default: '+91'},
		national_number: String,
		is_verified: {type: Boolean, default: false},
		otp: String
	},
	email: {type: String, unique: true},
	verification_code: String,
	is_verified: {type: Boolean, default: false},
	status: {type: String, default: 'active'},
	password: String,

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
		branding: {
			theme_color: String,
			text_color: String,
			icon: String
		},
		is_agri_sys_branding: {type: Boolean, default: true},
		is_terms_page: {type: Boolean, default: false}
	},
	acc_type: {type: String, default: 'individual'},
	image: String,
	address: {
		billing: {
			line_1: String,
			line_2: String,
			city: {type: Object, default: {}},
			zipcode: String,
			country: {type: Object, default: {}},
			state: {type: Object, default: {}}
		},
		shipping: {
			line_1: String,
			line_2: String,
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
		secure_login: {
			code: String,
			requested_time: Date
		},
		reference: {
			id: String,
			invite_id: String
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
	business: {
		name: String,
		business_type: {
			code: String,
			name: String
		},
		website: String,
		gst: String
	},
	last_login: {
		from: {type: String, default: 'web'},
		meta: Object
	},
	documents: {
		aadhar: {
			number: Number,
			image: {
				front: String,
				back: String
			}
		},
		registration: {
			number: String,
			image: {
				front: String
			}
		},
		pan: {
			number: String,
			image: {
				front: String
			}
		},
		status: {type: String, required: true, default: 'unfilled'},
		reject_reasons: Array
	},
	payout: {
		status: {type: String, required: true, enum: ['pending', 'requested', 'approved'], default: 'pending'},
		account: {
			name: String,
			account_number: String,
			ifsc: String
		}
	},
	pass_code: String
});
customerSchema.plugin(timestamps);

let customerModel = mongoose.model('customer', customerSchema);

module.exports = customerModel;
