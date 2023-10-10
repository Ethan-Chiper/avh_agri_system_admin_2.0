module.exports = {
	SubMerchant: {
		display_name: 'Sub-Merchant',
		group: 'sub_merchant',
		route_list: {
			create: {
				route: '/api/store-admin/sub-merchant/create/:merchantId',
				method: 'POST'
			},
			list: {
				route: '/api/store-admin/sub-merchant/list/:merchantId?',
				method: 'GET'
			},
			delete: {
				route: '/api/store-admin/sub-merchant/delete/:sub-merchantId',
				method: 'DELETE'
			},
			update: {
				route: '/api/store-admin/sub-merchant/update/:sub-merchantId',
				method: 'PATCH'
			},
			status_change: {
				route: '/api/store-admin/sub-merchant/status_change/:sub-merchantId',
				method: 'PATCH'
			},
			details: {
				route: '/api/store-admin/sub-merchant/details/:sub-merchantId',
				method: 'GET'
			}
		}
	},
	Bank: {
		display_name: 'Bank',
		group: 'bank',
		route_list: {
			list: {
				route: '/api/store-admin/bank/list/:merchantId?',
				method: 'GET'
			},

			create: {
				route: '/api/store-admin/bank/create/:merchantId',
				method: 'POST'
			},
			fetchifscdetails: {
				route: '/api/store-admin/bank/fetch-ifsc-details/:ifscCode',
				method: 'GET'
			}
		}
	},

	Vpa: {
		display_name: 'Vpa',
		group: 'vpa',
		route_list: {
			list: {
				route: '/api/store-admin/vpa/list/:merchantId/:storeId?',
				method: 'GET'
			},

			create: {
				route: '/api/store-admin/vpa/create/:merchantId',
				method: 'POST'
			},
			update: {
				route: '/api/store-admin/vpa/update/:vpaId',
				method: 'POST'
			},
			status_change: {
				route: '/api/store-admin/vpa/status-change/:merchantId/:storeId?',
				method: 'PATCH'
			},
			details: {
				route: '/api/store-admin/vpa/details/:vpaId',
				method: 'GET'
			}
		}
	},
	merchants: {
		display_name: 'Merchants',
		group: 'merchants',
		route: '/api/store-admin/merchant/list',
		method: 'GET',
		is_side_bar: true,
		route_list: {
			create: {
				display_name: 'Merchant Add',
				group: 'merchant-add',
				route: '/api/store-admin/merchant/create/',
				method: 'POST',
				is_side_bar: false,
				is_enabled: true
			},
			update: {
				display_name: 'Merchant Update',
				group: 'merchant-update',
				route: '/api/store-admin/merchant/update/:merchantId',
				method: 'PATCH',
				is_side_bar: false,
				is_enabled: true
			},
			status: {
				route: '/api/store-admin/merchant/change-status/:merchantId',
				method: 'PATCH'
			},
			detail: {
				display_name: 'Merchant Detail',
				group: 'merchant-detail',
				route: '/api/store-admin/merchant/details/:merchantId',
				method: 'GET',
				is_side_bar: false,
				is_enabled: true
			},
			count: {
				route: '/api/store-admin/merchant/get-merchant-count',
				method: 'GET'
			},
			delete: {
				display_name: 'Merchant Delete',
				group: 'merchant-delete',
				route: '/api/store-admin/merchant/delete/:merchantId',
				method: 'DELETE',
				is_side_bar: false,
				is_enabled: true
			}
		}
	},
	stores: {
		display_name: 'Stores',
		group: 'stores',
		route_list: {
			create: {
				route: '/api/store-admin/store/create/:merchantId',
				method: 'POST'
			},
			update: {
				route: '/api/store-admin/store/update/:storeId',
				method: 'PATCH'
			},
			status: {
				route: '/api/store-admin/store/change-status/:storeId',
				method: 'PATCH'
			},
			detail: {
				route: '/api/store-admin/store/details/:storeId',
				method: 'GET'
			},
			list: {
				route: '/api/store-admin/store/list/:merchantId?',
				method: 'GET'
			},
			delete: {
				route: '/api/store-admin/store/delete/:storeId',
				method: 'DELETE'
			}
		}
	},
	subUsers: {
		display_name: 'Sub Users',
		group: 'subUsers',
		route_list: {
			create: {
				route: '/api/store-admin/sub-user/create/:merchantId',
				method: 'POST'
			},
			update: {
				route: '/api/store-admin/sub-user/update/:subUserId',
				method: 'PATCH'
			},
			status: {
				route: '/api/store-admin/sub-user/change-status/:subUserId',
				method: 'PATCH'
			},
			detail: {
				route: '/api/store-admin/sub-user/details/:subUserId',
				method: 'GET'
			},
			list: {
				route: '/api/store-admin/sub-user/list/:merchantId',
				method: 'GET'
			},
			delete: {
				route: '/api/store-admin/sub-user/delete/:subUserId',
				method: 'DELETE'
			}
		}
	},

	Login: {
		route_list: {
			login: {
				route: '/api/store-admin/auth/login',
				method: 'POST'
			},
			loginWithOTP: {
				route: '/api/store-admin/auth/login/verify-otp',
				method: 'POST'
			}
		}
	},
	Admin: {
		route_list: {
			detail: {
				route: '/api/store-admin/admin/get-details',
				method: 'GET'
			}
		}
	},
	Properties: {
		route_list: {
			categoryList: {
				route: '/api/store-admin/properties/category-list',
				method: 'GET'
			},
			subCategoryList: {
				route: '/api/store-admin/properties/sub-category-list',
				method: 'GET'
			}
		}
	}
};
