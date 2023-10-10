const admin = {
	email: 'testing@ippopay.com',
	password: 'ffac2f40bfd7a9fb4f13560386ef8552',
	role: 'admin',
	admin_id: 'BWpaitTqT5',
	verification_code: '',
	status: 'active',
	acc_type: 'super-admin',
	is_verified: false,
	last_login: {
		from: 'web',
		meta: {
			source: 'NewUserAgent'
		}
	},
	phone: {
		is_verified: false,
		country_code: '+91',
		national_number: '9962831663'
	},
	name: {
		full: 'Admin'
	},
	whitelisted_routes: []
};
const admin2 = structuredClone(admin);
admin2.email = 'premaymt@gmail.com';
admin2.password = '81c93a6d22daaa5fdb4dbd4267e5e06e';
admin2.admin_id = 'XuizTx6Lsf';
admin2.phone.national_number = '9977665544';

const merchant = {
	merchant_id: 'gSyr95bsg3',
	role: 'merchant',
	name: {
		full: 'Swetha'
	},
	location: {
		agent_store: {
			street_name: 'Ratna Streets',
			area: 'Gandhi Nagar',
			city: 'Chennai',
			state: 'Tamilnadu',
			pincode: '600060',
			flat_no: '12'
		},
		is_same_store_contact: false
	},
	phone: {
		national_number: '9955663459',
		country_code: '91',
		is_verified: false
	},
	settlement_type: 'instant',
	settlement_days: '0',
	settlement_time: '',
	settlement_mode: {
		neft: true,
		imps: false
	},
	referral: {
		code: 'a7y1i2',
		referred_by: '',
		url: 'https://ippopay.page.link/ngZr'
	},
	partner: {
		id: 'Ikpsjnbhv',
		name: 'Ippopay'
	},
	available_loan: [],
	verification_code: {
		phone: ''
	}
};

const merchant2 = structuredClone(merchant);
merchant2.merchant_id = 'afhjds@_123';
merchant2.phone.national_number = '8123456789';

const merchant3 = structuredClone(merchant);
merchant3.merchant_id = 'asdfg123_i';
merchant3.name.full = 'YMT';
merchant3.location.agent_store.street_name = 'BlueBerry Streets';
merchant3.location.agent_store.area = 'KK Nagar';
merchant3.location.agent_store.city = 'Madurai';
merchant3.location.agent_store.state = 'Tamilnadu';
merchant3.location.agent_store.pincode = '610060';
merchant3.location.agent_store.flat_no = '24';
merchant3.phone.national_number = '9912345678';

const store = {
	store_id: 'gSyr95bsg3',
	merchant_id: 'gSyr95bsg3',
	merchant_code: 'FORTESTINGPURPOSE',
	business_type: 'trade',
	outlet_type: 'fixed',
	location: {
		agent_store: {
			flat_no: '12',
			street_name: 'Nehru Road',
			area: 'Chetpet',
			city: 'Chennai',
			state: 'Tamilnadu',
			pincode: '600004'
		}
	},
	name: {
		full: 'Swetha',
		store: 'ForTestingPurpose'
	},
	business: {
		name: 'ForTestingPurpose',
		business_type: {
			name: 'Testing',
			subCategory: 'SubUser'
		}
	},
	loc: [],
	bank_approval: 'pending',
	bank_info: {
		acc_type: 'current',
		image: ''
	},
	settlement_type: 'instant',
	settlement_days: '0',
	settlement_time: '',
	settlement_mode: {
		neft: false,
		imps: true
	},
	status: 'active',
	terms: 'true',
	partner: {
		id: 'Ikpsjnbhv',
		name: 'Ippopay'
	},
	is_inactive: false,
	feedback: [],
	visit_status: 'valid'
};

const store2 = structuredClone(store);
store2.status = 'deactive';
store2.store_id = 'asdf123$x5';

const store3 = structuredClone(store);
store3.store_id = 'qwe234af34';
store3.merchant_id = 'asdfg123_i';

const subUser = {
	sub_user_id: '5dQkRgMC3x',
	name: 'Mano',
	merchant: {
		id: 'gSyr95bsg3',
		name: 'Swetha',
		code: ''
	},
	store: {
		id: 'gSyr95bsg3',
		name: ''
	},
	phone: {
		national_number: '9840808709',
		country_code: '91',
		is_verified: false
	},
	status: 'active',
	vpa_id: 'ippostoreyaminthwe5078@icici'
};

const subUser2 = structuredClone(subUser);
subUser2.sub_user_id = '5067hdgfvb';
subUser2.phone.national_number = '9871234567';

module.exports = {
	admin,
	admin2,
	merchant,
	merchant2,
	merchant3,
	store,
	store2,
	store3,
	subUser,
	subUser2
};
