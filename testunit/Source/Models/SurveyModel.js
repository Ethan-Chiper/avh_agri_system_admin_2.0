const LeadsDB = require('../App/Connection').getLeadsDBConnection();
const Timestamp = require('mongoose-timestamp');

const StoreSurveySchema = new LeadsDB.Schema({
	survey_id: {type: String, default: ''},
	merchant_id: {type: String, default: ''},
	is_lead: {type: Boolean, default: false},
	step: {type: Number, default: '', enum: [1, 2, 3, 4]},
	merchant: {
		name: {type: String, default: ''},
		phone: {
			national_number: {type: String, default: ''},
			country_code: {type: String, default: '91'}
		},
		email: {type: String, default: ''},
		merchant_type: {type: String, default: 'proprietor', enum: ['proprietor', 'partnership', 'companies']}
	},
	store: {
		name: {type: String, default: ''},
		outlet_type: {type: String, default: 'fixed', enum: ['fixed', 'non_fixed']},
		turnover: {
			type: String,
			default: '',
			enum: ['0', '0-1_lakh', '1-5_lakh', '5-10_lakh', '10-30_lakh', '30plus_lakh']
		},
		turnover_mode: {
			cash: {type: String, default: '0'},
			card: {type: String, default: '0'},
			upi: {type: String, default: '0'}
		}
	},
	category: {
		code: {type: String, default: ''},
		name: {type: String, default: ''},
		subCategory: {type: String, default: ''}
	},
	documents: {
		is_pan_available: {type: Boolean, default: false},
		is_aadhar_available: {type: Boolean, default: false},
		business_proof: {type: String, default: ''}
	},
	location: {
		street_name: {type: String, default: ''},
		area: {type: String, default: ''},
		city: {type: String, default: ''},
		state: {type: String, default: ''},
		pincode: {type: String, default: ''},
		loc: {type: Array, default: []}
	},
	questionnaires: {type: Object, default: {}},
	images: {
		store_image: {type: String, default: ''},
		agent_selfie: {type: String, default: ''},
		other_documents: {type: String, default: ''}
	},
	feedback: {type: String, default: ''},
	is_onboarded: {type: Boolean, default: false},
	is_rejected: {type: Boolean, default: false},
	reject_reasons: {type: String, default: ''},
	data_collected_by: {
		agent_id: {type: String, default: ''},
		name: {type: String, default: ''},
		role: {type: String, default: ''}
	},
	reference: {
		agent_name: {type: String, default: ''},
		agent_id: {type: String, default: ''},
		asm_id: {type: String, default: ''},
		asm_name: {type: String, default: ''}
	}
});

StoreSurveySchema.plugin(Timestamp);

const SurveyModel = LeadsDB.model('survey', StoreSurveySchema);

module.exports = SurveyModel;
