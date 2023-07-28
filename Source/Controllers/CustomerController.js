const Responder = require('../App/Responder');
const Utils = require('../Helpers/Utils');
const CustomerModel = require('../Models/CustomerModel').getCustomerModel();
function Controllers() {
    this.signUp = (req, res) => {
        let data = req.body;

        let customerData = {
            'customer_id': Utils.getNanoId(),
            'name': {
                'full': data?.name?.full || ''
            },
            'mobile': {
                'country_code': data?.mobile?.country_code ?? '+91',
                'national_number': data?.mobile?.national_number || '',
                'is_verified': data?.mobile?.is_verified ?? false,
                'otp': '123456'
            },
            'phone': {
                'country_code': data?.mobile?.country_code ?? '+91',
                'national_number': data?.mobile?.national_number || '',
                'is_verified': data?.mobile?.is_verified ?? false,
                'otp': '123456'
            },
            'email': data?.email || '',
            'verification_code': data?.verification_code || '',
            'is_verified': data?.is_verified || false,
            'status': data?.status || 'active',
            'password': data?.password || '123456',

            'setting': {
                'invoice': {
                    'notes': data?.setting?.invoice?.notes || '',
                    'terms': data?.setting?.invoice?.terms || '',
                    'use_for_future': data?.setting?.invoice?.use_for_future || false,
                    'incrementer': data?.setting?.invoice?.incrementer || 0
                },
                'time_zone': {
                    'name': 'Asia/ Kolkata',
                    'label': 'Indian Standard Time',
                    'offset': '+0530'
                },
                'branding': {
                    'theme_color': data?.setting?.branding?.theme_color || '',
                    'text_color': data?.setting?.branding?.text_color || '',
                    'icon': data?.setting?.branding?.icon || ''
                },
                'is_afw_branding': data?.setting?.is_afw_branding || true,
                'is_terms_page': data?.setting?.is_terms_page || false
            },
            'acc_type': data?.acc_type || 'individual',
            'image': data?.image || '',
            'address': {
                'billing': {
                    'line_1': data?.address?.billing?.line_1 ?? '',
                    'line_2': data?.address?.billing?.line_2 ?? '',
                    'city': data?.address?.billing?.city ?? {},
                    'zipcode': data?.address?.billing?.zipcode ?? '',
                    'country': data?.address?.billing?.country ?? {},
                    'state': data?.address?.billing?.state ?? {}
                },
                'shipping': {
                    'line_1': data?.address?.billing?.line_1 ?? '',
                    'line_2': data?.address?.billing?.line_2 ?? '',
                    'city': data?.address?.billing?.city ?? {},
                    'zipcode': data?.address?.billing?.zipcode ?? '',
                    'country': data?.address?.billing?.country ?? {},
                    'state': data?.address?.billing?.state ?? {}
                },
                'is_same_billing': data?.address?.is_same_billing ?? true
            },
            'currency':'INR',
            'bank_info': {},
            'bank_approval_status': data?.bank_approval_status ?? 'pending',
            'internal': {
                'secure_login': {
                    'code': data?.internal?.secure_login?.code ?? '',
                    'requested_time': ''
                },
                'reference': {
                    'id': data?.reference?.id ?? '',
                    'invite_id': data?.reference?.invite_id ?? ''
                },
                'registration': {
                    'type': data?.registration?.type ?? 'farmer',
                    'platform': data?.registration?.platform ?? 'web'
                }
            },
            'is_intlcurrency_enabled': data?.is_intlcurrency_enabled ?? false,
            'is_socialcom_enabled': data?.is_socialcom_enabled ?? false,
            'is_referral_invite_enabled': data?.is_referral_invite_enabled ?? false,
            'is_2fa_enabled': data?.is_2fa_enabled ?? false,
            'pg_category': data?.pg_category ?? 'ecom',

            'business': {
                'name': data?.business?.name ?? '',
                'business_type': {
                    'code': data?.business?.business_type?.code ?? '',
                    'name': data?.business?.business_type?.name ?? ''
                },
                'website': '',
                'gst': 99
            },
            'last_login': {
                'from': data?.last_login?.from ?? 'web',
                'meta': {}
            },
            'documents': {
                'aadhar': {
                    'number': data?.documents?.aadhar?.number ?? '',
                    'image': {
                        'front': data?.documents?.aadhar?.image?.from ?? '',
                        'back': data?.documents?.aadhar?.image?.back ?? '',
                    }
                },
                'registration': {
                    'number': data?.documents?.registration?.number ?? '',
                    'image': {
                        'front': data?.documents?.registration?.image ?? ''
                    }
                },
                'pan': {
                    'number': data?.documents?.pan?.number ?? '',
                    'image': {
                        'front': data?.documents?.pan?.image?.front ?? ''
                    }
                },
                'status':data?.status ?? 'unfilled',
                'reject_reasons': data?.reject_reasons ?? []
            },
            'payout': {
                'status': data?.payout?.status ?? 'pending',
                'account': {
                    'name': data?.payout?.account?.name ?? '',
                    'account_number': data?.payout?.account?.account_number ?? '',
                    'ifsc': data?.payout?.account?.ifsc ?? ''
                }
            },
            'pass_code': data?.pass_code ?? 1234
        };

        CustomerModel.create(customerData,(err, createData) => {
            if (!err && createData)
                return Responder.sendSuccessData(res, 'Admin create', createData);
            return Responder.sendFailureMessage(res, 'Admin create failure');
        });
    };
}

module.exports = new Controllers();
