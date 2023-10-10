const DBConnection = require('../App/Connection');
const AgentDataBase = DBConnection.getAgentDBConnection();
const Timestamps = require('mongoose-timestamp');
const mongooseDelete = require('mongoose-delete');

const agentSchema = new AgentDataBase.Schema({
	name: {
		first: {
			type: String
		},
		full: {
			type: String
		},
		middle: {
			type: String
		},
		last: {
			type: String
		}
	},
	business_type: {type: String, default: 'trade'},
	role: {
		type: String,
		enum: ['regional_manager', 'branch_manager', 'asm', 'third_party', 'tl', 'agent', 'admin', 'qc', 'junior-fse'],
		default: 'agent'
	},
	location: {
		flat_no: {type: String, default: ''},
		street_name: {type: String, default: ''},
		area: {type: String, default: ''},
		city: {
			name: {type: String, default: ''},
			code: {type: String, default: ''}
		},
		state: {
			name: {type: String, default: ''},
			code: {type: String, default: ''}
		},
		pincode: {type: String, default: ''}
	},
	commission: {type: Number, default: '0'},
	is_teamleader: {type: Boolean, default: false},
	agent_id: String,
	image: {type: String, default: ''},
	agent_image: {type: String, default: ''},
	dob: {type: Date},
	gender: {type: String},
	is_manager: {type: Boolean, default: false},
	phone: {
		national_number: {type: String, required: true},
		country_code: {type: String, default: '91'},
		is_verified: {type: Boolean, default: false}
	},
	email: {
		primary: {type: String, default: ''},
		is_verified: {type: Boolean, default: false}
	},
	reference: {
		branch_manager: {
			id: {type: String},
			name: {type: String, default: ''}
		},
		asm: {
			id: {type: String},
			name: {type: String, default: ''}
		},
		third_party: {
			id: {type: String},
			name: {type: String, default: ''}
		},
		tl: {
			id: {type: String},
			name: {type: String, default: ''}
		}
	},
	about: {type: String, default: ''},
	devicedetails: Object,
	token: String,
	verification_code: {
		phone: String
	},
	agents_count: {type: String, default: ''},
	store_count: {type: String, default: ''},
	totalstore_count: {type: Number, default: ''},
	password: {
		type: String
	},
	documents: {
		pan: {
			number: {type: String, default: ''},
			pan_image: {
				front: {type: String, default: ''},
				back: {type: String, default: ''}
			},
			image: {
				front: {type: String, default: ''},
				back: {type: String, default: ''}
			}
		},
		aadhar: {
			number: {type: String, default: ''},
			aadhar_image: {
				front: {type: String, default: ''},
				back: {type: String, default: ''}
			},
			image: {
				front: {type: String, default: ''},
				back: {type: String, default: ''}
			},
			verify_response: Object
		},
		status: {type: String, default: 'pending'}
	},
	agent_settlement_type: {type: String, default: 'NEFT'},
	status: {type: String, default: 'active'},
	controlled_states: {type: Array, default: []},
	is_allow_clockin: {type: Boolean, default: true},
	allowed_date: {type: String, default: ''},
	qc_asm: {type: Array, default: []},
	kong_termination_id: {type: String, default: ''}
});

agentSchema.plugin(Timestamps);

agentSchema.plugin(mongooseDelete, {overrideMethods: 'all'});

const AgentModel = AgentDataBase.model('agents', agentSchema);

module.exports = AgentModel;
