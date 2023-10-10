const {isEmpty, networkCall, similar} = require('../Helpers/Utils');
const CONFIG = require('../App/Config');
const {findOneMerchant} = require('../Repository/MerchantRepository');
const MerchantModel = require('../Models/MerchantModel');
const AdminModel = require('../Models/AdminModel');
const StoreModel = require('../Models/StoreModel');
const CategoryModel = require('../Models/CategoryModel');
const {findOneStore} = require('../Repository/StoreRepository');
const {app_warning, app_error} = require('../Helpers/Logger');
const PartnerModel = require('../Models/PartnerModel');

const QcController = {
	/**
	 * Category List for QC
	 * @param query
	 * @returns {Promise<{data: *, error: boolean, message: *}|{error: boolean, message: string}>}
	 */
	list: async (query) => {
		let queryString = '';
		if (query.limit) {
			queryString += 'limit=' + query.limit + '&';
		}
		if (query.page) {
			queryString += 'page=' + query.page + '&';
		}
		if (query.category_id) {
			queryString += 'category_id=' + query.category_id + '&';
		}
		if (query.sortBy) {
			queryString += 'sortBy=' + query.sortBy + '&';
		}
		if (query.name) {
			queryString += 'name=' + query.name;
		}

		let options = {
			method: 'GET',
			url: CONFIG.SERVICE.POS_SERVICE_URL + '/category/list?' + queryString
		};
		try {
			let categorylist = await networkCall(options);
			let result = JSON.parse(categorylist?.body);
			if (!result?.success) {
				return {
					error: true,
					message: 'There is no category list'
				};
			}
			return {error: false, message: result?.message, data: result?.data};
		} catch {
			return {error: true, message: 'Something went wrong! Please try again'};
		}
	},

	/**
	 * To update store category
	 * @param requestData
	 * @param storeId
	 * @returns {Promise<{data: {store_id, business: (string|*)}, error: boolean, message: string}|{error: boolean, message: string}|{error: boolean, message: *}>}
	 */
	updateCategory: async (requestData, storeId) => {
		let agentId = requestData?.loggedUser?.id;
		if (isEmpty(agentId)) {
			return {error: true, message: 'Unauthorized access.'};
		} else {
			try {
				let store = await findOneStore(
					{store_id: storeId},
					{
						store_id: 1,
						'business.business_type': 1,
						createdAt: 1
					},
					false
				);
				if (isEmpty(store)) {
					app_warning(
						'Invalid Store!',
						{store_id: storeId},
						requestData?.loggedUser,
						'Update Category QC Controller'
					);
					return {error: false, message: 'Invalid Store!'};
				} else {
					let subCategory = await CategoryModel.findOne(
						{
							code: requestData.category_code,
							label: requestData.store_subCategory,
							type: 'sub',
							status: 'active'
						},
						{
							code: 1,
							type: 1,
							label: 1
						}
					);
					if (isEmpty(subCategory)) {
						app_warning(
							'Invalid category!',
							{
								code: requestData.category_code,
								label: requestData.store_subCategory,
								type: 'sub',
								status: 'active'
							},
							requestData?.loggedUser,
							'Update Category QC Controller'
						);
						return {error: false, message: 'Invalid category!'};
					} else {
						store.business.business_type.name = requestData.store_category;
						store.business.business_type.code = subCategory.code;
						store.business.business_type.subCategory = subCategory.label;
						store.markModified('business.business_type');
						await store.save();
						return {
							error: false,
							data: {
								store_id: store.store_id,
								business: store?.business?.business_type
							},
							message: 'Category Updated successfully!'
						};
					}
				}
			} catch (error) {
				app_error(error, {}, 'Update Category QC Controller', requestData?.loggedUser);
				return {
					error: true,
					message: error?.message
				};
			}
		}
	},

	/**
	 * Document approve
	 * @param requestData
	 * @param merchantId
	 * @returns {Promise<{code: number, error: boolean, message: string}|{error: boolean, message: string}|{data: {documents: (number|[(string | number), (string | number)]|(Document | Buffer)[]|Document[]|boolean|*)}, error: boolean, message: string}|{error: boolean, message: *}>}
	 */
	approveDocument: async (requestData, merchantId) => {
		let agentId = requestData?.loggedUser?.id;
		if (isEmpty(agentId)) {
			return {error: true, message: 'Unauthorized access.'};
		} else {
			try {
				let document_name = requestData?.document_name;
				let merchant = await findOneMerchant(
					{merchant_id: merchantId},
					{
						merchant_id: 1,
						[`documents.${document_name}`]: 1,
						createdAt: 1
					},
					false
				);
				if (isEmpty(merchant)) {
					app_warning(
						'Invalid Merchant!',
						{merchant_id: merchantId},
						requestData?.loggedUser,
						'QC Document Approve'
					);
					return {error: false, message: 'Invalid Merchant!'};
				} else {
					if (!merchant.documents[`${document_name}`]) {
						app_warning(
							'Document not found!',
							{merchant_id: merchantId, document_name},
							requestData?.loggedUser,
							'QC Document Approve'
						);
						return {error: true, message: 'Document not found!', code: 400};
					}
					let documents = [
						'pan',
						'aadhar',
						'voter_id',
						'license',
						'passport',
						'gst',
						'registration_certificate',
						'deed',
						'moa'
					];
					if (!documents.includes(document_name)) {
						app_warning(
							'Invalid document name!',
							{merchant_id: merchantId, document_name},
							requestData?.loggedUser,
							'QC Document Approve'
						);
						return {error: false, message: 'Invalid document name!'};
					}
					let status = requestData.status === 'approved' ? 'approved' : 'rejected';
					merchant.documents[`${document_name}`].status = status;
					merchant.markModified(`documents.${document_name}.status`);
					await merchant.save();
					return {
						error: false,
						data: {
							documents: merchant.documents
						},
						message: 'Status changed successfully!'
					};
				}
			} catch (error) {
				app_error(error, {}, 'QC Document Approve', requestData?.loggedUser);
				return {
					error: true,
					message: error?.message
				};
			}
		}
	},

	/**
	 * VPA approve
	 * @param approveVpaData
	 * @param merchantId
	 * @param storeId
	 * @returns {Promise<{error: boolean, message: string}|{data: *, error: boolean, message: (*|string)}|{error: boolean, message: (*|string)}>}
	 */
	approveVpa: async (approveVpaData, merchantId, storeId) => {
		try {
			let vpaId = approveVpaData?.vpa_id;

			let existingMerchant = await findOneMerchant(
				{merchant_id: merchantId, role: 'merchant', status: 'active'},
				{_id: 1, status: 1, name: 1, documents: 1},
				true
			);

			if (isEmpty(existingMerchant)) {
				app_warning(
					'Merchant Not Found!',
					{merchant_id: merchantId, role: 'merchant', status: 'active'},
					approveVpaData?.loggedUser,
					'VPA Approve'
				);
				return {
					error: true,
					message: 'Merchant Not Found!'
				};
			}

			// if (existingMerchant.documents.status !== 'approved') {
			// 	app_warning(
			// 		'Please approve the documents status for this Merchant.',
			// 		{
			// 			merchant_id: merchantId,
			// 			role: 'merchant',
			// 			status: 'active',
			// 			'documents.status': existingMerchant.documents.status
			// 		},
			// 		approveVpaData?.loggedUser,
			// 		'VPA Approve'
			// 	);
			// 	return {error: true, message: 'Please approve the documents status for this Merchant.'};
			// }

			let existingStore = await findOneStore(
				{merchant_id: merchantId, store_id: storeId, status: 'active'},
				{},
				true
			);

			if (isEmpty(existingStore)) {
				app_warning(
					'Store Not Found!',
					{merchant_id: merchantId, store_id: storeId, status: 'active'},
					approveVpaData?.loggedUser,
					'VPA Approve'
				);
				return {error: true, message: 'Store Not Found!'};
			}

			let options = {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				url: CONFIG.SERVICE.BANKING_SERVICE_URL + '/vpa/approve-vpa/' + merchantId,
				body: {vpa_id: vpaId, store_id: storeId},
				admin: approveVpaData?.loggedUser
			};

			let vpaApprove = await networkCall(options);
			if (vpaApprove?.error) app_error(vpaApprove?.error, {}, 'VPA Approve', approveVpaData?.loggedUser);
			let resultData = JSON.parse(vpaApprove?.body);
			if (resultData?.success)
				return {
					error: false,
					message: resultData?.message || 'VPA approved successfully',
					data: resultData?.data
				};
			app_warning(
				resultData?.message || 'VPA could not be approved',
				resultData,
				approveVpaData?.loggedUser,
				'VPA Approve'
			);
			return {error: true, message: resultData?.message || 'VPA could not be approved'};
		} catch (error) {
			app_error(error, {}, 'VPA Approve', approveVpaData?.loggedUser);
			return {error: true, message: 'Something went wrong!'};
		}
	},

	/**
	 * Merchant Approve
	 * @param requestData
	 * @returns {Promise<{error: boolean, message: string}|{data: *, error: boolean, message: string}|{error: boolean, message: *}>}
	 */
	approveMerchant: async (requestData) => {
		let adminId = requestData?.loggedUser?.id;
		if (isEmpty(adminId)) {
			return {error: true, message: 'Unauthorized access.'};
		} else {
			try {
				let [admin, merchant] = await Promise.all([
					AdminModel.findOne({admin_id: adminId}, {_id: 0, admin_id: 1, role: 1, name: 1}).lean(),
					findOneMerchant(
						{merchant_id: requestData?.merchant_id, 'phone.is_verified': true},
						{
							merchant_id: 1,
							documents: 1,
							reference: 1,
							name: 1,
							createdAt: 1,
							partner: 1,
							approved_by: 1,
							rejected_by: 1
						},
						false
					)
				]);
				let updateData;
				if (
					merchant?.documents?.aadhar?.status === 'submitted' ||
					merchant?.documents?.license?.status === 'submitted' ||
					merchant?.documents?.voter_id?.status === 'submitted' ||
					merchant?.documents?.passport?.status === 'submitted' ||
					merchant?.documents?.aadhar?.status === 'approved' ||
					merchant?.documents?.voter_id?.status === 'approved' ||
					merchant?.documents?.passport?.status === 'approved' ||
					merchant?.documents?.license?.status === 'approved'
				) {
					switch (requestData?.document_status) {
						case 'approved': {
							updateData = {
								$set: {
									'documents.status': 'approved',
									'documents.pan.status': 'approved',
									'documents.is_rejected': false,
									'documents.is_resubmitted': false,
									'documents.reject_reasons': '',
									'documents.rejected_data': {
										store_front: false,
										name_board: false,
										inside_view: false,
										stand_qr: false,
										store_qr: false,
										pan: false,
										aadhar: false,
										license: false,
										voter_id: false,
										passport: false,
										agent_selfie: false,
										bank_details: false,
										business_proof: false
									},
									approved_by: {
										id: admin?.admin_id,
										name: admin?.name?.full,
										role: admin?.role,
										approved_date: Date.now()
									}
								}
							};
							break;
						}
						case 'rejected': {
							updateData = {
								$set: {
									'documents.status': 'unfilled',
									'documents.is_rejected': true,
									'documents.is_resubmitted': false,
									'documents.rejected_data': requestData?.rejected_data,
									'documents.reject_reasons': requestData?.reject_reason,
									rejected_by: {
										id: admin?.admin_id,
										name: admin?.name?.full,
										role: admin?.role,
										rejected_date: Date.now()
									}
								}
							};
							break;
						}
						default: {
							app_warning(
								'Invalid document status',
								{document_status: requestData?.document_status},
								requestData?.loggedUser,
								'Approve Merchant'
							);
							return {error: true, message: 'Invalid document status'};
						}
					}
					let merchantData = await MerchantModel.findOneAndUpdate(
						{merchant_id: requestData?.merchant_id, 'phone.is_verified': true},
						updateData,
						{new: true}
					);
					if (!isEmpty(merchant) && !isEmpty(merchantData)) {
						let storeId = requestData?.merchant_id;
						let store = await StoreModel.findOneAndUpdate({store_id: storeId}, updateData, {
							new: true
						});
						/**
						 * for partner QC callback
						 */
						if (!isEmpty(merchant?.partner?.id)) {
							let partnerData = await PartnerModel.findOne(
								{partner_id: merchant?.partner?.id},
								{partner_id: 1, name: 1, keys: 1}
							).lean();

							if (!isEmpty(partnerData?.keys?.callback_url)) {
								let data = {
									type: 'qc',
									data: {
										merchant_id: merchant?.merchant_id,
										merchant_name: merchant?.name?.full,
										status: requestData?.document_status
									}
								};

								if (requestData?.document_status === 'approved') {
									data['data']['approved_date'] = new Date();
								} else if (requestData?.document_status === 'rejected') {
									data['data']['rejected_date'] = new Date();
									data['data']['rejected_reason'] = requestData?.reject_reason || '';
									data['data']['rejected_data'] =
										requestData?.rejected_data || merchant?.documents?.rejected_data;
								}

								let options = {
									method: 'POST',
									headers: {
										'Content-Type': 'application/json'
									},
									url: partnerData?.keys?.callback_url,
									body: data
								};

								await networkCall(options);
							}
						}
						return {
							error: false,
							data: store,
							message: 'Merchant ' + requestData.document_status + ' successfully!'
						};
					} else {
						app_warning(
							'Store not verified or store not found',
							{merchant, merchant_id: requestData.merchant_id, 'phone.is_verified': true, updateData},
							requestData?.loggedUser,
							'Approve Merchant'
						);
						return {
							error: true,
							message: 'Store not verified or store not found'
						};
					}
				} else {
					app_warning(
						'Store documents not verified or store not found',
						{documents: merchant?.documents},
						requestData?.loggedUser,
						'Approve Merchant'
					);
					return {
						error: true,
						message: 'Store documents not verified or store not found'
					};
				}
			} catch (error) {
				app_error(error, {}, 'Approve Merchant', requestData?.loggedUser);
				return {
					error: true,
					message: error?.message
				};
			}
		}
	},

	/**
	 * Document name matching
	 * @param loggedUser
	 * @param merchantId
	 * @returns {Promise<{data: {total_name_matching_percentage: number, merchant_name: *, merchant_id: *, matching_percentage: {bank: (string|*|number|number), aadhar: (*|number|number), pan: (*|number|number)}}, error: boolean, message: string}|{error: boolean, message: string}|{error: boolean, message: (*|string)}>}
	 */
	documentNameMatching: async (loggedUser, merchantId) => {
		let agentId = loggedUser?.id;
		if (isEmpty(agentId)) {
			return {error: true, message: 'Unauthorized access.'};
		} else {
			let merchant = await findOneMerchant(
				{merchant_id: merchantId},
				{
					_id: 0,
					merchant_id: 1,
					'name.full': 1,
					'documents.pan.verify_response.data': 1,
					'bank_info.acc_holder_name': 1,
					'documents.aadhar.verify_response.data.proofOfIdentity.name': 1
				},
				true
			);
			if (isEmpty(merchant)) {
				app_warning('Merchant Not Found!', {merchant_id: merchantId}, loggedUser, 'Document Name Matching');
				return {error: true, message: 'Merchant Not Found!'};
			} else {
				try {
					let fullName = merchant?.name?.full;
					let nameInPan = merchant?.pan?.verify_response?.kycResult?.name;
					let nameInBank = merchant?.bank_info?.acc_holder_name;
					let nameInAadhar = merchant?.documents?.aadhar?.verify_response?.data?.proofOfIdentity?.name;

					let bankMatchPercentage = (nameInBank && (await similar(fullName, nameInBank))) || 0;
					let panMatchPercentage = (nameInPan && (await similar(fullName, nameInPan))) || 0;
					let aadharMatchPercentage = (nameInAadhar && (await similar(fullName, nameInAadhar))) || 0;

					let totalpercent = 0;
					let total = bankMatchPercentage + panMatchPercentage + aadharMatchPercentage;
					if (total) {
						totalpercent = total / 3;
						return {
							error: false,
							message: 'Document name matching percentage are!',
							data: {
								merchant_id: merchant?.merchant_id,
								merchant_name: merchant?.name?.full,
								matching_percentage: {
									pan: panMatchPercentage,
									bank: bankMatchPercentage,
									aadhar: aadharMatchPercentage
								},
								total_name_matching_percentage: totalpercent
							}
						};
					}
					app_warning(
						'Invalid document names!',
						{bankMatchPercentage, panMatchPercentage, aadharMatchPercentage, total},
						loggedUser,
						'Document Name Matching'
					);
					return {error: true, message: 'Invalid document names!'};
				} catch (error) {
					app_error(error, {}, 'Document Name Matching', loggedUser);
					return {error: true, message: error?.message || 'Something went wrong! Please try again'};
				}
			}
		}
	}
};

module.exports = QcController;
