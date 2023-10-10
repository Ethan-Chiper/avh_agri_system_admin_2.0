const DBConnection = require('../App/Connection');
const AgentDataBase = DBConnection.getAgentDBConnection();
const Timestamps = require('mongoose-timestamp');
const MongooseSoftDelete = require('mongoose-delete');

const merchantSchema = new AgentDataBase.Schema({
	merchant_id: {type: String, unique: true},
	parent_id: {type: String, default: ''},
	merchant_type: {type: String},
	merchant_code: {type: String, default: ''},
	business_type: {type: String, default: 'trade'},
	role: {type: String, default: 'merchant'},
	stores: {type: Array, default: []},
	name: {
		first: {type: String},
		full: {type: String, default: ''},
		middle: {type: String},
		last: {type: String},
		store: {type: String, default: ''},
		display: {type: String, default: ''}
	},
	loc: {type: Array, default: []},
	location: {
		agent_store: {
			flat_no: {type: String, default: ''},
			street_name: {type: String, default: ''},
			area: {type: String, default: ''},
			city: {type: String, default: ''},
			state: {type: String, default: ''},
			pincode: {type: String, default: ''}
		},
		is_same_store_contact: {type: Boolean, default: false},
		address: {type: String, default: ''},
		latlng: {
			type: [Number], // format will be [ <longitude> , <latitude> ]
			index: '2dsphere' // create the geospatial index
		}
	},
	business: {
		name: {type: String, default: ''},
		business_type: {
			code: {type: String, default: ''},
			name: {type: String, default: ''},
			subCategory: {type: String, default: ''}
		}
	},
	documents: {
		pan: {
			number: {type: String, default: ''},
			image: {
				front: {type: String, default: ''},
				back: {type: String, default: ''}
			},
			pan_image: {
				front: {type: String, default: ''},
				back: {type: String, default: ''}
			},
			status: {type: String, default: ''},
			verify_response: Object
		},
		aadhar: {
			number: {type: String, default: ''},
			masked_number: {type: String, default: ''},
			image: {
				front: {type: String, default: ''},
				back: {type: String, default: ''}
			},
			aadhar_image: {
				front: {type: String, default: ''},
				back: {type: String, default: ''}
			},
			status: {type: String, default: ''},
			verify_response: Object
		},
		voter_id: {
			number: {type: String, default: ''},
			image: {
				front: {type: String, default: ''},
				back: {type: String, default: ''}
			},
			voter_image: {
				front: {type: String, default: ''},
				back: {type: String, default: ''}
			},
			status: {type: String, default: 'unfilled'},
			verify_response: Object
		},
		license: {
			number: {type: String, default: ''},
			license_image: {
				front: {type: String, default: ''},
				back: {type: String, default: ''}
			},
			status: {type: String, default: 'unfilled'},
			verify_response: Object
		},
		passport: {
			number: {type: String, default: ''},
			passport_image: {
				front: {type: String, default: ''},
				back: {type: String, default: ''}
			},
			status: {type: String, default: 'unfilled'},
			verify_response: Object
		},
		gst: {
			number: {type: String, default: ''},
			response: {},
			pdf: {type: String},
			status: {type: String, default: ''},
			verify_response: Object
		},
		registration_certificate: {
			number: {type: String, default: ''},
			pdf: {type: String},
			status: {type: String, default: ''},
			verify_response: Object
		},
		deed: {
			pdf: {type: String, default: ''},
			status: {type: String, default: ''},
			verify_response: Object
		},
		moa: {
			pdf: {type: String, default: ''},
			status: {type: String, default: ''},
			verify_response: Object
		},
		store: {
			image: {
				document: {type: String, default: ''},
				name_board: {type: String, default: ''},
				inside_view: {type: String, default: ''},
				front: {type: String, default: ''},
				back: {type: String, default: ''},
				sticker: {type: String, default: ''},
				storeqrSticker: {type: String, default: ''},
				owner: {type: String, default: ''},
				agent_image: {type: String, default: ''}
			},
			store_image: {
				document: {type: String, default: ''},
				name_board: {type: String, default: ''},
				inside_view: {type: String, default: ''},
				front: {type: String, default: ''},
				back: {type: String, default: ''},
				sticker: {type: String, default: ''},
				storeqrSticker: {type: String, default: ''},
				owner: {type: String, default: ''},
				agent_image: {type: String, default: ''}
			},
			status: {type: String, default: ''}
		},
		agent: {
			image: {type: String, default: ''},
			agent_image: {
				image: {type: String, default: ''}
			}
		},
		status: {type: String, default: 'unfilled'},
		address_proof_type: {type: String, default: ''},
		status_updated_time: {type: Date, default: Date.now},
		is_rejected: {type: Boolean, default: false},
		is_resubmitted: {type: Boolean, default: false},
		reject_reasons: {type: String, default: ''},
		rejected_data: {
			store_front: {type: Boolean, default: false},
			name_board: {type: Boolean, default: false},
			inside_view: {type: Boolean, default: false},
			stand_qr: {type: Boolean, default: false},
			store_qr: {type: Boolean, default: false},
			pan: {type: Boolean, default: false},
			aadhar: {type: Boolean, default: false},
			license: {type: Boolean, default: false},
			voter_id: {type: Boolean, default: false},
			passport: {type: Boolean, default: false},
			agent_selfie: {type: Boolean, default: false},
			bank_details: {type: Boolean, default: false},
			business_proof: {type: Boolean, default: false}
		},
		business_proof: {type: Array}
	},
	vpa: {type: String},
	qr_url: {type: String},
	bank_info: {
		acc_no: {type: String},
		acc_holder_name: {type: String},
		acc_type: {type: String, default: 'current'},
		address: {type: String},
		branch: {type: String},
		ifsc: {type: String},
		name: {type: String},
		code: {type: String},
		district: {type: String},
		state: {type: String},
		city: {type: String},
		image: {type: String, default: ''}
	},
	phone: {
		national_number: {type: String, required: true},
		country_code: {type: String, default: '91'},
		is_verified: {type: Boolean, default: false}
	},
	is_vparegistered: {type: Boolean, default: false},
	email: {
		primary: {type: String, default: ''},
		is_verified: {type: Boolean, default: false}
	},
	is_agent_onboard: {type: Boolean, default: false},
	is_sound_box: {type: Boolean, default: false},
	devicedetails: Object,
	settings: Object,
	beneficiary: Object,
	token: {type: String},
	bank_approval: {type: String, default: 'pending'},
	verification_code: {
		phone: String
	},
	password: {
		type: String
	},
	status: {type: String, default: 'active'},
	terms: {type: String, default: false},
	payment_mode: {
		payment_link: {type: Boolean, default: false},
		tap_on_pay: {type: Boolean, default: false},
		upi: {type: Boolean, default: false},
		cash: {type: Boolean, default: true}
	},
	settlement_type: {type: String, default: 'instant'},
	settlement_days: {type: String, default: '0'},
	settlement_time: {type: String, default: ''},
	settlement_mode: {
		neft: {type: Boolean, default: true},
		imps: {type: Boolean, default: false}
	},
	reference: {
		is_reference: {type: Boolean, default: false},
		agent_name: {type: String, default: ''},
		agent_id: {type: String, default: ''},
		tl_id: {type: String, default: ''},
		tl_name: {type: String, default: ''},
		asm_id: {type: String, default: ''},
		asm_name: {type: String, default: ''},
		thirdparty_id: {type: String, default: ''},
		thirdparty_name: {type: String, default: ''}
	},
	referral: {
		code: {type: String, default: ''},
		referred_by: {type: String, default: ''},
		url: {type: String, default: ''}
	},
	payouts: {
		status: {type: String, default: 'not_apply'},
		is_enabled: {type: Boolean, default: false},
		pin: {type: String, default: ''},
		otp: {type: String, default: ''},
		lock_upto: Date,
		attempt: {type: Number, default: 0},
		is_fingerprint_enable: {type: Boolean, default: false}
	},
	payment_link_mode: {
		upi: {type: Boolean, default: false},
		net_banking: {type: Boolean, default: false},
		debit_card: {type: Boolean, default: false},
		credit_card: {type: Boolean, default: false},
		international_cards: {type: Boolean, default: false}
	},
	mail_notify: {
		product_updates: {type: Boolean, default: false},
		monthly_and_annual_sales_summary: {type: Boolean, default: false},
		daily_sales_summary: {type: Boolean, default: false}
	},
	mid: {type: String, default: ''},
	partner: {
		id: {type: String, default: ''},
		name: {type: String, default: ''}
	},
	approved_by: {
		id: {type: String, default: ''},
		name: {type: String, default: ''},
		role: {type: String, default: ''},
		approved_date: {type: Date, default: Date.now}
	},
	rejected_by: {
		id: {type: String, default: ''},
		name: {type: String, default: ''},
		role: {type: String, default: ''},
		rejected_date: {type: Date, default: Date.now}
	},
	state: {
		code: {type: String, default: ''},
		name: {type: String, default: ''}
	},
	avail_qr: {
		is_first_qr: {type: Boolean, default: false},
		qr_list: {type: Array, default: []}
	},
	available_loan: {
		type: Array,
		default: []
	}
});

merchantSchema.plugin(Timestamps);
merchantSchema.plugin(MongooseSoftDelete, {overrideMethods: 'all'});

const MerchantModel = AgentDataBase.model('merchants', merchantSchema);

module.exports = MerchantModel;
