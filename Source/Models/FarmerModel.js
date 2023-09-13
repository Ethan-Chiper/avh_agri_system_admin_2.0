const Connection = require('../App/MultiConnection');
const FarmerConnection = Connection.getFarmerDBConnection();
const timestamps = require('mongoose-timestamp');
const mongoose = require('mongoose');

const farmerSchema = new FarmerConnection.Schema({
	farmer_id: {type: String},
	name: {
		full: {type: String}
	},
	mobile: {
		country_code: {type: String, default: '+91'},
		national_number: String,
		is_verified: {type: Boolean, default: false},
		otp: {type: String, default: ''}
	},
	phone: {
		country_code: {type: String, default: '+91'},
		national_number: String,
		is_verified: {type: Boolean, default: false},
		otp: {type: String, default: ''}
	},
	auth_token: {
		web: {type: Object, default: {}},
		mobile: {type: Object, default: {}}
	},
	token: String,
	devicedetails: {},
	email: {type: String, unique: true},
	verification_code: {type: String, default: ''},
	is_verified: {type: Boolean, default: false},
	status: {type: String, default: 'active'},
	password: {type: String, default: ''},

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
			theme_color: {type: String, default: ''},
			text_color: {type: String, default: ''},
			icon: {type: String, default: ''}
		},
		is_agri_sys_branding: {type: Boolean, default: true},
		is_terms_page: {type: Boolean, default: false}
	},

	acc_type: {type: String, default: 'individual'},
	image: {type: String, default: ''},
	address: {
		billing: {
			line_1: {type: String, default: ''},
			line_2: {type: String, default: ''},
			city: {type: Object, default: {}},
			zipcode: {type: String, default: ''},
			country: {type: Object, default: {}},
			state: {type: Object, default: {}}
		},
		shipping: {
			line_1: {type: String, default: ''},
			line_2: {type: String, default: ''},
			city: {type: Object, default: {}},
			zipcode: {type: String, default: ''},
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
			code: {type: String, default: ''},
			requested_time: Date
		},
		reference: {
			id: {type: String, default: ''},
			invite_id: {type: String, default: ''}
		},
		registration: {
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
			code: {type: String, default: ''},
			name: {type: String, default: ''}
		},
		website: {type: String, default: ''},
		gst: {type: String, default: ''}
	},
	last_login: {
		from: {type: String, default: 'web'},
		meta: Object
	},
	documents: {
		aadhar: {
			number: {type: Number, default: ''},
			image: {
				front: {type: String, default: ''},
				back: {type: String, default: ''}
			}
		},
		registration: {
			number: {type: String, default: ''},
			image: {
				front: {type: String, default: ''}
			}
		},
		pan: {
			number: {type: String, default: ''},
			image: {
				front: {type: String, default: ''}
			}
		},
		status: {type: String, required: true, default: 'unfilled'},
		reject_reasons: Array
	},
	payout: {
		status: {type: String, required: true, enum: ['pending', 'requested', 'approved'], default: 'pending'},
		account: {
			name: {type: String, default: ''},
			account_number: {type: String, default: ''},
			ifsc: {type: String, default: ''}
		}
	},
	pass_code: {type: String, default: ''}
});
farmerSchema.plugin(timestamps);

let farmerModel = mongoose.model('farmers', farmerSchema);

module.exports = farmerModel;
