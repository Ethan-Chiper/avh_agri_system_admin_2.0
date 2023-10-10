module.exports = {
	merchants: {
		display_name: 'Merchants',
		group: 'merchants',
		route: '/api/v2/store-admin/merchant',
		method: 'GET',
		is_side_bar: false,
		is_enabled: false
	},
	merchant_add: {
		display_name: 'Merchant Add',
		group: 'merchant-add',
		route: '/api/v2/store-admin/merchant/create',
		method: 'POST',
		is_side_bar: false,
		is_enabled: false
	},
	merchant_update: {
		display_name: 'Merchant Update',
		group: 'merchant-update',
		route: '/api/v2/store-admin/merchant/update',
		method: 'PATCH',
		is_side_bar: false,
		is_enabled: false
	},
	merchant_list: {
		display_name: 'Merchant List',
		group: 'merchant-list',
		route: '/api/v2/store-admin/merchant/list',
		method: 'GET',
		is_side_bar: false,
		is_enabled: false
	},
	merchant_detail: {
		display_name: 'Merchant Detail',
		group: 'merchant-detail',
		route: '/api/v2/store-admin/merchant/details',
		method: 'GET',
		is_side_bar: false,
		is_enabled: false
	},
	merchant_change_status: {
		display_name: 'Merchants Change status',
		group: 'merchant-change-status',
		route: '/api/v2/store-admin/merchant/change-status',
		method: 'PATCH',
		is_side_bar: false,
		is_enabled: false
	},
	sub_merchants: {
		display_name: 'Sub Merchants',
		group: 'sub-merchants',
		route: '/api/v2/store-admin/sub-merchant',
		method: 'GET',
		is_side_bar: false,
		is_enabled: false
	},
	sub_merchants_add: {
		display_name: 'Sub Merchants Add',
		group: 'sub-merchant-add',
		route: '/api/v2/store-admin/sub-merchant/create',
		method: 'POST',
		is_side_bar: false,
		is_enabled: false
	},
	sub_merchants_update: {
		display_name: 'Sub Merchants Update',
		group: 'sub-merchant-update',
		route: '/api/v2/store-admin/sub-merchant/update',
		method: 'PATCH',
		is_side_bar: false,
		is_enabled: false
	},
	sub_merchants_change_status: {
		display_name: 'Sub Merchants Change status',
		group: 'sub-merchant-change-status',
		route: '/api/v2/store-admin/sub-merchant/status_change',
		method: 'PATCH',
		is_side_bar: false,
		is_enabled: false
	},
	sub_merchants_list: {
		display_name: 'Sub Merchants List',
		group: 'sub-merchant-list',
		route: '/api/v2/store-admin/sub-merchant/list',
		method: 'GET',
		is_side_bar: false,
		is_enabled: false
	},
	// sub_merchants_detail: {
	// 	display_name: 'Sub Merchants Detail',
	// 	group: 'sub-merchant-detail',
	// 	route: '/api/v2/store-admin/sub-merchant/details',
	// 	method: 'GET',
	// 	is_side_bar: false,
	// 	is_enabled: false
	// },
	// sub_merchants_delete: {
	// 	display_name: 'Sub Merchants Delete',
	// 	group: 'sub-merchant-delete',
	// 	route: '/api/v2/store-admin/sub-merchant/delete',
	// 	method: 'DELETE',
	// 	is_side_bar: false,
	// 	is_enabled: false
	// },
	/*upi_settlements: {
		display_name: 'Upi Settlements',
		group: 'upi-settlements',
		route: '/api/v2/store-admin/settlement',
		method: 'GET',
		is_side_bar: false,
		is_enabled: false
	},
	settlement_list: {
		display_name: 'Settlement List',
		group: 'upi-settlements-list',
		route: '/api/v2/store-admin/settlement/list',
		method: 'GET',
		is_side_bar: false,
		is_enabled: false
	},
	settlement_detail: {
		display_name: 'Settlement Detail',
		group: 'upi-settlements-detail',
		route: '/api/v2/store-admin/settlement/detail',
		method: 'GET',
		is_side_bar: false,
		is_enabled: false
	}, */
	bank: {
		display_name: 'Bank',
		group: 'bank',
		route: '/api/v2/store-admin/bank',
		method: 'GET',
		is_side_bar: false,
		is_enabled: false
	},
	bank_list: {
		display_name: 'Bank List',
		group: 'bank-list',
		route: '/api/v2/store-admin/bank/list',
		method: 'GET',
		is_side_bar: false,
		is_enabled: false
	},
	bank_create: {
		display_name: 'Bank Create',
		group: 'bank-create',
		route: '/api/v2/store-admin/bank/create',
		method: 'POST',
		is_side_bar: false,
		is_enabled: false
	},
	bank_ifsc_details: {
		display_name: 'Bank Ifsc',
		group: 'bank-ifsc',
		route: '/api/v2/store-admin/bank/fetch-ifsc-details',
		method: 'GET',
		is_side_bar: false,
		is_enabled: false
	},
	vpa: {
		display_name: 'Vpa',
		group: 'vpa',
		route: '/api/v2/store-admin/vpa',
		method: 'GET',
		is_side_bar: false,
		is_enabled: false
	},
	vpa_list: {
		display_name: 'Vpa List',
		group: 'vpa-list',
		route: '/api/v2/store-admin/vpa/list',
		method: 'GET',
		is_side_bar: false,
		is_enabled: false
	},
	vpa_create: {
		display_name: 'Vpa Create',
		group: 'vpa-create',
		route: '/api/v2/store-admin/vpa/create',
		method: 'POST',
		is_side_bar: false,
		is_enabled: false
	},
	vpa_update: {
		display_name: 'Vpa Update',
		group: 'vpa-update',
		route: '/api/v2/store-admin/vpa/update',
		method: 'POST',
		is_side_bar: false,
		is_enabled: false
	},
	vpa_status_change: {
		display_name: 'Vpa Status Change',
		group: 'vpa-status-change',
		route: '/api/v2/store-admin/vpa/status-change',
		method: 'PATCH',
		is_side_bar: false,
		is_enabled: false
	},
	vpa_details: {
		display_name: 'Vpa Detail',
		group: 'vpa-detail',
		route: '/api/v2/store-admin/vpa/details',
		method: 'GET',
		is_side_bar: false,
		is_enabled: false
	},
	store: {
		display_name: 'Stores',
		group: 'store',
		route: '/api/v2/store-admin/store',
		method: 'GET',
		is_side_bar: false,
		is_enabled: false
	},
	store_create: {
		display_name: 'Store Create',
		group: 'store-create',
		route: '/api/v2/store-admin/store/create',
		method: 'POST',
		is_side_bar: false,
		is_enabled: false
	},
	store_update: {
		display_name: 'Store Update',
		group: 'store-update',
		route: '/api/v2/store-admin/store/update',
		method: 'PATCH',
		is_side_bar: false,
		is_enabled: false
	},
	store_status: {
		display_name: 'Store Change Status',
		group: 'store-change-status',
		route: '/api/v2/store-admin/store/change-status',
		method: 'PATCH',
		is_side_bar: false,
		is_enabled: false
	},
	store_detail: {
		display_name: 'Store Detail',
		group: 'store-detail',
		route: '/api/v2/store-admin/store/details',
		method: 'GET',
		is_side_bar: false,
		is_enabled: false
	},
	store_list: {
		display_name: 'Store List',
		group: 'store-list',
		route: '/api/v2/store-admin/store/list',
		method: 'GET',
		is_side_bar: false,
		is_enabled: false
	},
	// store_delete: {
	// 	display_name: 'Store Delete',
	// 	group: 'store-delete',
	// 	route: '/api/v2/store-admin/store/delete',
	// 	method: 'DELETE',
	// 	is_side_bar: false,
	// 	is_enabled: false
	// },
	sub_users: {
		display_name: 'Subusers',
		group: 'subuser',
		route: '/api/v2/store-admin/sub-user',
		method: 'GET',
		is_side_bar: false,
		is_enabled: false
	},
	sub_users_create: {
		display_name: 'Subuser Create',
		group: 'subuser-create',
		route: '/api/v2/store-admin/sub-user/create',
		method: 'POST',
		is_side_bar: false,
		is_enabled: false
	},
	sub_users_update: {
		display_name: 'Subuser Update',
		group: 'subuser-update',
		route: '/api/v2/store-admin/sub-user/update',
		method: 'PATCH',
		is_side_bar: false,
		is_enabled: false
	},
	sub_users_status: {
		display_name: 'Subuser Status Change',
		group: 'subuser-change-status',
		route: '/api/v2/store-admin/sub-user/change-status',
		method: 'PATCH',
		is_side_bar: false,
		is_enabled: false
	},
	sub_users_detail: {
		display_name: 'Subuser Details',
		group: 'subuser-detail',
		route: '/api/v2/store-admin/sub-user/details',
		method: 'GET',
		is_side_bar: false,
		is_enabled: false
	},
	sub_users_list: {
		display_name: 'Subuser List',
		group: 'subuser-list',
		route: '/api/v2/store-admin/sub-user/list',
		method: 'GET',
		is_side_bar: false,
		is_enabled: false
	},
	sub_users_delete: {
		display_name: 'Subuser Delete',
		group: 'subuser-delete',
		route: '/api/v2/store-admin/sub-user/delete',
		method: 'DELETE',
		is_side_bar: false,
		is_enabled: false
	},
	push_notification: {
		display_name: 'Push Notification',
		group: 'push-notification',
		route: '/api/v2/store-admin/push-notification',
		method: 'GET',
		is_side_bar: false,
		is_enabled: false
	},
	push_notification_bulk: {
		display_name: 'Push Notification In Bulk',
		group: 'push-notification-in-bulk',
		route: '/api/v2/store-admin/push-notification/send/push',
		method: 'POST',
		is_side_bar: false,
		is_enabled: false
	},
	push_notification_merchant: {
		display_name: 'Push Notification For A Merchant',
		group: 'push-notification-for-merchant',
		route: '/api/v2/store-admin/push-notification/send/push/merchant',
		method: 'POST',
		is_side_bar: false,
		is_enabled: false
	},
	dispute: {
		display_name: 'Dispute',
		group: 'dispute',
		route: '/api/v2/store-admin/dispute',
		method: 'GET',
		is_side_bar: false,
		is_enabled: false
	},
	dispute_list: {
		display_name: 'Dispute List',
		group: 'dispute-list',
		route: '/api/v2/store-admin/dispute/list',
		method: 'GET',
		is_side_bar: false,
		is_enabled: false
	},
	dispute_status: {
		display_name: 'Dispute Status',
		group: 'dispute-status-change',
		route: '/api/v2/store-admin/dispute/change-status',
		method: 'PATCH',
		is_side_bar: false,
		is_enabled: false
	},
	dispute_details: {
		display_name: 'Dispute Details',
		group: 'dispute-details',
		route: '/api/v2/store-admin/dispute/details',
		method: 'GET',
		is_side_bar: false,
		is_enabled: false
	},
	properties: {
		display_name: 'Properties',
		group: 'properties',
		route: '/api/v2/store-admin/properties',
		method: 'GET',
		is_side_bar: false,
		is_enabled: false
	},
	properties_category_list: {
		display_name: 'Properties Category List',
		group: 'properties-category-list',
		route: '/api/v2/store-admin/properties/category-list',
		method: 'GET',
		is_side_bar: false,
		is_enabled: false
	},
	properties_subCategory_list: {
		display_name: 'Properties SubCategory List',
		group: 'properties-subCategory-list',
		route: '/api/v2/store-admin/properties/sub-category-list',
		method: 'GET',
		is_side_bar: false,
		is_enabled: false
	},
	partner: {
		display_name: 'Partner',
		group: 'partner',
		route: '/api/v2/store-admin/partner',
		method: 'GET',
		is_side_bar: false,
		is_enabled: false
	},
	partner_create: {
		display_name: 'Partner Create',
		group: 'partner-create',
		route: '/api/v2/store-admin/partner/create',
		method: 'POST',
		is_side_bar: false,
		is_enabled: false
	},
	admin: {
		display_name: 'Admin',
		group: 'admin',
		route: '/api/v2/store-admin/admin',
		method: 'GET',
		is_side_bar: false,
		is_enabled: false
	},
	admin_details: {
		display_name: 'Admin Details',
		group: 'admin-details',
		route: '/api/v2/store-admin/admin/get-details',
		method: 'GET',
		is_side_bar: false,
		is_enabled: false
	},
	admin_list: {
		display_name: 'Admin List',
		group: 'admin-list',
		route: '/api/v2/store-admin/admin/list',
		method: 'GET',
		is_side_bar: false,
		is_enabled: false
	},
	admin_create: {
		display_name: 'Admin Create',
		group: 'admin-create',
		route: '/api/v2/store-admin/admin/create',
		method: 'POST',
		is_side_bar: false,
		is_enabled: false
	},
	admin_acl_modify: {
		display_name: 'Admin Modify ACL',
		group: 'admin-modify-acl',
		route: '/api/v2/store-admin/admin/modify-acls',
		method: 'PATCH',
		is_side_bar: false,
		is_enabled: false
	},
	admin_route_list: {
		display_name: 'Admin Route List',
		group: 'admin-route-list',
		route: '/api/v2/store-admin/admin/route-list',
		method: 'GET',
		is_side_bar: false,
		is_enabled: false
	},
	admin_presigned_url: {
		display_name: 'Admin Presigned URL',
		group: 'admin-get-presigned-url',
		route: '/api/v2/store-admin/admin/get-presigned-url',
		method: 'POST',
		is_side_bar: false,
		is_enabled: false
	},
	agents: {
		display_name: 'Agents',
		group: 'agents',
		route: '/api/v2/store-admin/agent',
		method: 'GET',
		is_side_bar: false,
		is_enabled: false
	},
	agents_create: {
		display_name: 'Agent Add',
		group: 'agent-create',
		route: '/api/v2/store-admin/agent/create',
		method: 'POST',
		is_side_bar: false,
		is_enabled: false
	},
	agents_update: {
		display_name: 'Edit Agent',
		group: 'edit-agent',
		route: '/api/v2/store-admin/agent/edit-agent',
		method: 'POST',
		is_side_bar: false,
		is_enabled: false
	},
	agents_change_status: {
		display_name: 'Agent Status Change',
		group: 'agent-change-status',
		route: '/api/v2/store-admin/agent/change-status',
		method: 'PATCH',
		is_side_bar: false,
		is_enabled: false
	},
	agents_detail: {
		display_name: 'Agent Details',
		group: 'agent-detail',
		route: '/api/v2/store-admin/agent/details',
		method: 'GET',
		is_side_bar: false,
		is_enabled: false
	},
	approveagent: {
		display_name: 'Agent Approve',
		group: 'agent-approve',
		route: '/api/v2/store-admin/agent/approve-agent',
		method: 'PATCH',
		is_side_bar: false,
		is_enabled: false
	},
	agents_list: {
		display_name: 'Agent List',
		group: 'agent-list',
		route: '/api/v2/store-admin/agent/list',
		method: 'GET',
		is_side_bar: false,
		is_enabled: false
	},
	agents_delete: {
		display_name: 'Agent Delete',
		group: 'agent-delete',
		route: '/api/v2/store-admin/agent/delete',
		method: 'DELETE',
		is_side_bar: false,
		is_enabled: false
	},
	agents_state_list: {
		display_name: 'Agent State List',
		group: 'agent-state-list',
		route: '/api/v2/store-admin/agent/state/list',
		method: 'GET',
		is_side_bar: false,
		is_enabled: false
	},
	agents_city_list: {
		display_name: 'Agent City List',
		group: 'agent-city-list',
		route: '/api/v2/store-admin/agent/city/list',
		method: 'GET',
		is_side_bar: false,
		is_enabled: false
	},
	agents_change_role_id: {
		display_name: 'Agent Role Change with Id',
		group: 'agent-role-change-id',
		route: '/api/v2/store-admin/agent/change-role',
		method: 'PATCH',
		is_side_bar: false,
		is_enabled: false
	},
	agents_map_agent: {
		display_name: 'Agent Mapping',
		group: 'agent-mapping',
		route: '/api/v2/store-admin/agent/agent-mapping',
		method: 'POST',
		is_side_bar: false,
		is_enabled: false
	},
	agents_location_mapping: {
		display_name: 'Agent Location Mapping',
		group: 'agent-location-mapping',
		route: '/api/v2/store-admin/agent/location-mapping',
		method: 'POST',
		is_side_bar: false,
		is_enabled: false
	},
	agents_role_list: {
		display_name: 'Agent Role List',
		group: 'agent-role-list',
		route: '/api/v2/store-admin/agent/role-list',
		method: 'GET',
		is_side_bar: false,
		is_enabled: false
	},
	agents_approve_clockin: {
		display_name: 'Agent Approve Clockin',
		group: 'agent-approve-clockin',
		route: '/api/v2/store-admin/agent/approve-clockin',
		method: 'POST',
		is_side_bar: false,
		is_enabled: false
	},
	agents_change_role: {
		display_name: 'Agent Role Change',
		group: 'agent-role-change',
		route: '/api/v2/store-admin/agent/change-role',
		method: 'POST',
		is_side_bar: false,
		is_enabled: false
	},
	soundbox: {
		display_name: 'Soundbox',
		group: 'soundbox',
		route: '/api/v2/store-admin/soundbox',
		method: 'GET',
		is_side_bar: false,
		is_enabled: false
	},
	soundbox_list: {
		display_name: 'Soundbox List',
		group: 'soundbox-list',
		route: '/api/v2/store-admin/soundbox/list',
		method: 'GET',
		is_side_bar: false,
		is_enabled: false
	},
	soundbox_detail: {
		display_name: 'Soundbox Details',
		group: 'soundbox-detail',
		route: '/api/v2/store-admin/soundbox/detail',
		method: 'GET',
		is_side_bar: false,
		is_enabled: false
	},
	soundbox_status: {
		display_name: 'Soundbox Status Change',
		group: 'soundbox-change-status',
		route: '/api/v2/store-admin/soundbox/changestatus',
		method: 'POST',
		is_side_bar: false,
		is_enabled: false
	},
	upi_mandate_list: {
		display_name: 'Soundbox UPI Mandate List',
		group: 'soundbox-upi-mandate-list',
		route: '/api/v2/store-admin/mandate/list',
		method: 'GET',
		is_side_bar: false,
		is_enabled: false
	},
	upi_mandate_detail: {
		display_name: 'Soundbox UPI Mandate Details',
		group: 'soundbox-upi-mandate-detail',
		route: '/api/v2/store-admin/mandate/mandate-details',
		method: 'GET',
		is_side_bar: false,
		is_enabled: false
	},
	soundbox_emi_transaction_detail: {
		display_name: 'Soundbox Emi Transaction Detail',
		group: 'soundbox-emi-transaction-detail',
		route: '/api/v2/store-admin/mandate/transaction/details',
		method: 'GET',
		is_side_bar: false,
		is_enabled: false
	},
	soundbox_request_list: {
		display_name: 'Soundbox Request List',
		group: 'soundbox_request_list',
		route: '/api/v2/store-admin/order/list',
		method: 'GET',
		is_side_bar: false,
		is_enabled: false
	},
	soundbox_request_detail: {
		display_name: 'Soundbox Request Detail',
		group: 'soundbox_request_detail',
		route: '/api/v2/store-admin/order/order-details',
		method: 'GET',
		is_side_bar: false,
		is_enabled: false
	},
	soundbox_refund_status: {
		display_name: 'Soundbox Refund Update Status',
		group: 'soundbox_refund_update_status',
		route: '/api/v2/store-admin/order/update-refund-status',
		method: 'POST',
		is_side_bar: false,
		is_enabled: false
	},
	soundbox_cancel_status: {
		display_name: 'Soundbox Cancel Update Status',
		group: 'soundbox_cancel_update_status',
		route: '/api/v2/store-admin/order/order-cancellation',
		method: 'POST',
		is_side_bar: false,
		is_enabled: false
	},
	soundbox_mapping: {
		display_name: 'Soundbox Mapping',
		group: 'soundbox_mapping',
		route: '/api/v2/store-admin/order/sound-box/map-dsn-vpa',
		method: 'POST',
		is_side_bar: false,
		is_enabled: false
	},
	qc_merchant: {
		display_name: 'QC',
		group: 'qcmerchant',
		route: '/api/v2/store-admin/qc/merchant',
		method: 'GET',
		is_side_bar: false,
		is_enabled: false
	},
	qc_merchant_detail: {
		display_name: 'QC Merchant Details',
		group: 'qc-merchant-detail',
		route: '/api/v2/store-admin/qc/merchant/details',
		method: 'GET',
		is_side_bar: false,
		is_enabled: false
	},
	qc_vpa_list: {
		display_name: 'VPA List',
		group: 'qc-vpa-list',
		route: '/api/v2/store-admin/qc/merchant/vpa-list',
		method: 'GET',
		is_side_bar: false,
		is_enabled: false
	},
	qc_store_list: {
		display_name: 'QC Store List',
		group: 'qc-store-list',
		route: '/api/v2/store-admin/qc/merchant/store/list',
		method: 'GET',
		is_side_bar: false,
		is_enabled: false
	},
	qc_submerchant_list: {
		display_name: 'QC Submerchant List',
		group: 'qc-submerchant-list',
		route: '/api/v2/store-admin/qc/merchant/submerchant/list',
		method: 'GET',
		is_side_bar: false,
		is_enabled: false
	},
	qc_bank_list: {
		display_name: 'Bank List',
		group: 'qc-bank-list',
		route: '/api/v2/store-admin/qc/merchant/bank/list',
		method: 'GET',
		is_side_bar: false,
		is_enabled: false
	},
	qc_subuser_list: {
		display_name: 'QC Subuser List',
		group: 'qc-subuser-list',
		route: '/api/v2/store-admin/qc/merchant/subuser/list',
		method: 'GET',
		is_side_bar: false,
		is_enabled: false
	},
	// qc_category_list: {
	// 	display_name: 'QC Category List',
	// 	group: 'qc-category-list',
	// 	route: '/api/v2/store-admin/qc/merchant/category/list',
	// 	method: 'GET',
	// 	is_side_bar: false,
	// 	is_enabled: false
	// },
	// qc_subcategory_list: {
	// 	display_name: 'QC Subcategory List',
	// 	group: 'qc-sub-category-list',
	// 	route: '/api/v2/store-admin/qc/merchant/sub-category-list',
	// 	method: 'GET',
	// 	is_side_bar: false,
	// 	is_enabled: false
	// },
	qc_update_category: {
		display_name: 'QC Update Category',
		group: 'qc-update-category',
		route: '/api/v2/store-admin/qc/merchant/update-category',
		method: 'PATCH',
		is_side_bar: false,
		is_enabled: false
	},
	qc_approve_merchant: {
		display_name: 'QC Approve Merchant',
		group: 'qc-approve-merchant',
		route: '/api/v2/store-admin/qc/merchant/approve-merchant',
		method: 'PATCH',
		is_side_bar: false,
		is_enabled: false
	},
	qc_approve_document: {
		display_name: 'QC Approve Document',
		group: 'qc-approve-document',
		route: '/api/v2/store-admin/qc/merchant/approve-document',
		method: 'PATCH',
		is_side_bar: false,
		is_enabled: false
	},
	approve_vpa: {
		display_name: 'QC Approve VPA',
		group: 'qc-approve-vpa',
		route: '/api/v2/store-admin/qc/merchant/approve-vpa',
		method: 'PATCH',
		is_side_bar: false,
		is_enabled: false
	},

	// qc_approve_document: {
	// 	display_name: 'QC Approve Document',
	// 	group: 'qc-approve-document',
	// 	route: '/api/v2/store-admin/qc/merchant/approve-document',
	// 	method: 'PATCH',
	// 	is_side_bar: false,
	// 	is_enabled: false
	// },
	category: {
		display_name: 'Category',
		group: 'category',
		route: '/api/v2/store-admin/pos/category',
		method: 'GET',
		is_side_bar: false,
		is_enabled: false
	},
	create_category: {
		display_name: 'Category Create',
		group: 'create-category',
		route: '/api/v2/store-admin/pos/category/create',
		method: 'POST',
		is_side_bar: false,
		is_enabled: false
	},
	category_update: {
		display_name: 'Category Update',
		group: 'category-update',
		route: '/api/v2/store-admin/pos/category/update',
		method: 'POST',
		is_side_bar: false,
		is_enabled: false
	},
	category_list: {
		display_name: 'Category List',
		group: 'category-list',
		route: '/api/v2/store-admin/pos/category/list',
		method: 'GET',
		is_side_bar: false,
		is_enabled: false
	},
	category_detail: {
		display_name: 'Category Detail',
		group: 'category-detail',
		route: '/api/v2/store-admin/pos/category/detail',
		method: 'GET',
		is_side_bar: false,
		is_enabled: false
	},
	category_change_status: {
		display_name: 'Category Status Change',
		group: 'category-change-status',
		route: '/api/v2/store-admin/pos/category/change-status',
		method: 'PATCH',
		is_side_bar: false,
		is_enabled: false
	},
	pos_request: {
		display_name: 'Pos Request',
		group: 'pos_request',
		route: '/api/v2/store-admin/pos/request',
		method: 'GET',
		is_side_bar: false,
		is_enabled: false
	},
	pos_request_list: {
		display_name: 'Pos Request List',
		group: 'request-list',
		route: '/api/v2/store-admin/pos/request/list',
		method: 'GET',
		is_side_bar: false,
		is_enabled: false
	},
	pos_request_detail: {
		display_name: 'Pos Request Detail',
		group: 'pos-request-detail',
		route: '/api/v2/store-admin/pos/request/detail',
		method: 'GET',
		is_side_bar: false,
		is_enabled: false
	},
	pos_request_change_status: {
		display_name: 'Pos Request Status Change',
		group: 'request-change-status',
		route: '/api/v2/store-admin/pos/request/pos-status/change',
		method: 'PATCH',
		is_side_bar: false,
		is_enabled: false
	},
	pos_request_reject_reason: {
		display_name: 'Pos Request Reject Reason',
		group: 'request-reject-reason',
		route: '/api/v2/store-admin/pos/request/reject/reason',
		method: 'PATCH',
		is_side_bar: false,
		is_enabled: false
	},
	pos_upi_mandate_list: {
		display_name: 'POS UPI Mandate List',
		group: 'pos-upi-mandate-list',
		route: '/api/v2/store-admin/mandate/list',
		method: 'GET',
		is_side_bar: false,
		is_enabled: false
	},
	pos_upi_mandate_detail: {
		display_name: 'POS UPI Mandate Details',
		group: 'pos-upi-mandate-detail',
		route: '/api/v2/store-admin/mandate/mandate-details',
		method: 'GET',
		is_side_bar: false,
		is_enabled: false
	},
	product: {
		display_name: 'Product',
		group: 'product',
		route: '/api/v2/store-admin/pos/product',
		method: 'GET',
		is_side_bar: false,
		is_enabled: false
	},
	product_list: {
		display_name: 'Product List',
		group: 'product-list',
		route: '/api/v2/store-admin/pos/product/list',
		method: 'GET',
		is_side_bar: false,
		is_enabled: false
	},
	product_detail: {
		display_name: 'Product Detail',
		group: 'product-detail',
		route: '/api/v2/store-admin/pos/product/detail',
		method: 'GET',
		is_side_bar: false,
		is_enabled: false
	},
	product_create: {
		display_name: 'Create Product',
		group: 'create-product',
		route: '/api/v2/store-admin/pos/product/create',
		method: 'POST',
		is_side_bar: false,
		is_enabled: false
	},
	product_update: {
		display_name: 'Product Update',
		group: 'product-update',
		route: '/api/v2/store-admin/pos/product/update',
		method: 'POST',
		is_side_bar: false,
		is_enabled: false
	},
	product_change_status: {
		display_name: 'Product Status Change',
		group: 'product-change-status',
		route: '/api/v2/store-admin/pos/product/change-status',
		method: 'POST',
		is_side_bar: false,
		is_enabled: false
	},
	insurance: {
		display_name: 'Insurance',
		group: 'insurance',
		route: '/api/store-admin/insurance',
		method: 'GET',
		is_side_bar: false,
		is_enabled: false
	},
	insurance_create: {
		display_name: 'Insurance Create',
		group: 'insurance-create',
		route: '/api/store-admin/insurance/create',
		method: 'POST',
		is_side_bar: false,
		is_enabled: false
	},
	insurance_payout_list: {
		display_name: 'Insurance Payout List',
		group: 'insurance-payout-list',
		route: '/api/store-admin/insurance/dekho/payout/list',
		method: 'GET',
		is_side_bar: false,
		is_enabled: false
	},
	loan: {
		display_name: 'Loan',
		group: 'loan',
		route: '/api/v2/store-admin/loan',
		method: 'GET',
		is_side_bar: false,
		is_enabled: false
	},
	loan_list: {
		display_name: 'Loan List',
		group: 'loan-list',
		route: '/api/v2/store-admin/loan/list',
		method: 'GET',
		is_side_bar: false,
		is_enabled: false
	},
	loan_detail: {
		display_name: 'Loan Detail',
		group: 'loan-detail',
		route: '/api/v2/store-admin/loan/detail',
		method: 'GET',
		is_side_bar: false,
		is_enabled: false
	},
	loan_update: {
		display_name: 'Loan Update',
		group: 'loan-update',
		route: '/api/v2/store-admin/loan/update',
		method: 'POST',
		is_side_bar: false,
		is_enabled: false
	},
	loan_emi_transaction_detail: {
		display_name: 'Loan Emi Transaction Detail',
		group: 'loan-emi-detail',
		route: '/api/v2/store-admin/loan/emi/detail',
		method: 'GET',
		is_side_bar: false,
		is_enabled: false
	},
	loan_emi_mark_as_paid: {
		display_name: 'Loan Emi Record Payment',
		group: 'loan-emi-record-payment',
		route: '/api/v2/store-admin/loan/emi/record-payment',
		method: 'POST',
		is_side_bar: false,
		is_enabled: false
	},
	loan_collection: {
		display_name: 'Loan Collection List',
		group: 'loan-collection-list',
		route: '/api/v2/store-admin/loan/emi/list-all',
		method: 'GET',
		is_side_bar: false
	},
	loan_settlement_list: {
		display_name: 'Loan Settlement List',
		group: 'loan-settlement-list',
		route: '/api/v2/store-admin/loan/upi-mandate/settlement/list',
		method: 'GET',
		is_side_bar: false
	},
	loan_settlement_detail: {
		display_name: 'Loan Settlement Detail',
		group: 'loan-settlement-detail',
		route: '/api/v2/store-admin/loan/upi-mandate/settlement/detail',
		method: 'GET',
		is_side_bar: false
	},
	transaction: {
		display_name: 'Transaction',
		group: 'transaction',
		route: '/api/v2/store-admin/transaction',
		method: 'GET',
		is_side_bar: false,
		is_enabled: false
	},
	transaction_list: {
		display_name: 'Transaction List',
		group: 'transaction-list',
		route: '/api/v2/store-admin/transaction/list',
		method: 'GET',
		is_side_bar: false,
		is_enabled: false
	},
	transaction_detail: {
		display_name: 'Transaction Detail',
		group: 'transaction-detail',
		route: '/api/v2/store-admin/transaction/detail',
		method: 'GET',
		is_side_bar: false,
		is_enabled: false
	},
	survey: {
		display_name: 'Survey',
		group: 'survey',
		route: '/api/v2/store-admin/survey',
		method: 'GET',
		is_side_bar: false,
		is_enabled: false
	},
	survey_report: {
		display_name: 'Survey Report',
		group: 'survey-report',
		route: '/api/v2/store-admin/survey/report',
		method: 'GET',
		is_side_bar: false,
		is_enabled: false
	},
	survey_list: {
		display_name: 'Survey List',
		group: 'survey-list',
		route: '/api/v2/store-admin/survey/list',
		method: 'GET',
		is_side_bar: false,
		is_enabled: false
	},
	survey_detail: {
		display_name: 'Survey Detail',
		group: 'survey-detail',
		route: '/api/v2/store-admin/survey/survey-view',
		method: 'GET',
		is_side_bar: false,
		is_enabled: false
	},
	vpaReconciliations: {
		display_name: 'UPI Reconciliations',
		group: 'upi-reconciliation',
		route: '/api/v2/store-admin/vpa-reconciliations',
		method: 'GET',
		is_side_bar: false,
		is_enabled: false
	},
	vpaReconciliations_report: {
		display_name: 'UPI Reconciliation Report',
		group: 'upi-reconciliation-report',
		route: '/api/v2/store-admin/vpa-reconciliations/report',
		method: 'GET',
		is_side_bar: false,
		is_enabled: false
	},
	vpaReconciliations_list: {
		display_name: 'UPI Reconciliation List',
		group: 'upi-reconciliation-list',
		route: '/api/v2/store-admin/vpa-reconciliations/list',
		method: 'GET',
		is_side_bar: false,
		is_enabled: false
	},
	vpaReconciliations_detail: {
		display_name: 'UPI Reconciliation Detail',
		group: 'upi-reconciliation-detail',
		route: '/api/v2/store-admin/vpa-reconciliations/detail',
		method: 'GET',
		is_side_bar: false,
		is_enabled: false
	}
};
