const {merchantUpdate, storeUpdate} = require('../Helpers/UpdateHelper');
const {app_warning, app_error} = require('../Helpers/Logger');
const {isEmpty, networkCall, getDocuments, checkDocument} = require('../Helpers/Utils');
const Config = require('../App/Config');
const {findOneMerchant} = require('../Repository/MerchantRepository');
const {findOneStore} = require('../Repository/StoreRepository');
const {findOnePartner} = require('../Repository/PartnerRepository');

const UpdateController = {
	storeNameUpdate: async (storeNameUpdateData, merchantId, storeId, loggedUser) => {
		try {
			let updateData = {
				name: {
					store: storeNameUpdateData?.store_name
				},
				business: {
					name: storeNameUpdateData?.store_name
				}
			};

			let existingMerchant = await findOneMerchant(
				{
					merchant_id: merchantId,
					status: 'active'
				},
				{is_agent_onboard: 1},
				true
			);

			if (!isEmpty(existingMerchant) && existingMerchant?.is_agent_onboard) {
				app_warning(
					'Store Name Edit feature after agent visited the store is yet to implement.',
					{
						merchant_id: merchantId,
						status: 'active'
					},
					loggedUser,
					'Store Name Update'
				);
				return {
					error: true,
					message: 'Store Name Edit feature after agent visited the store is yet to implement.'
				};
			}

			let storeUpdatedData = await storeUpdate(updateData, merchantId, storeId, loggedUser);
			if (storeUpdatedData?.error === true) {
				return {error: true, message: storeUpdatedData?.message};
			}
			if (storeUpdatedData?.error) app_error(storeUpdatedData?.error, {}, 'Update Store Name', loggedUser);
			let resultData = JSON.parse(storeUpdatedData?.body);

			if (!resultData?.success) {
				app_warning(
					'Could not update store name. Please try after sometimes',
					resultData,
					loggedUser,
					'Update Store Name'
				);
				return {
					error: true,
					message: 'Could not update store. Please try after sometimes'
				};
			}

			let merchantUpdatedData = await merchantUpdate(updateData, merchantId, loggedUser);
			if (merchantUpdatedData?.error === true) {
				return {error: true, message: merchantUpdatedData?.message};
			}
			if (merchantUpdatedData?.error) app_error(merchantUpdatedData?.error, {}, 'Update Store Name', loggedUser);
			let result = JSON.parse(merchantUpdatedData?.body);

			if (!result?.success) {
				app_warning(
					'Could not update merchant store name. Please try after sometimes',
					result,
					loggedUser,
					'Update Store Name'
				);
				return {
					error: true,
					message: 'Could not update merchant store name. Please try after sometimes'
				};
			}

			let data = {
				store_name: resultData?.data?.store?.name?.store,
				store_name_merchant: result?.data?.merchant?.name?.store
			};

			return {error: false, message: resultData?.message, data};
		} catch (error) {
			app_error(error, {}, 'Store Name Update', loggedUser);
			return {error: true, message: 'Something went wrong! Please try again'};
		}
	},

	outletTypeUpdate: async (outletTypeUpdateData, merchantId, storeId, loggedUser) => {
		try {
			let storeUpdatedData = await storeUpdate(
				{outlet_type: outletTypeUpdateData?.outlet_type},
				merchantId,
				storeId,
				loggedUser
			);
			if (storeUpdatedData?.error === true) {
				return {error: true, message: storeUpdatedData?.message};
			}

			if (storeUpdatedData?.error) app_error(storeUpdatedData?.error, {}, 'Update Store Outlet Type', loggedUser);
			let resultData = JSON.parse(storeUpdatedData?.body);

			if (!resultData?.success) {
				app_warning(
					resultData?.message || 'Could not update store. Please try after sometimes',
					resultData,
					loggedUser,
					'Update Store Outlet Type'
				);
				return {
					error: true,
					message: resultData?.message || 'Could not update store. Please try after sometimes'
				};
			}
			let data = {
				outlet_type: resultData?.data?.store?.outlet_type
			};

			return {error: false, message: resultData?.message, data};
		} catch (error) {
			app_error(error, {}, 'Store Outlet Type Update', loggedUser);
			return {error: true, message: 'Something went wrong! Please try again'};
		}
	},

	partnerUpdate: async (partnerUpdateData, merchantId, loggedUser) => {
		let existingMerchant = await findOneMerchant(
			{
				merchant_id: merchantId,
				status: 'active'
			},
			{merchant_id: 1},
			true
		);

		if (isEmpty(existingMerchant)) {
			app_warning(
				'Merchant Not Found!',
				{
					merchant_id: merchantId,
					status: 'active'
				},
				loggedUser,
				'Partner Update'
			);
			return {error: true, message: 'Merchant Not Found!'};
		}
		let existingPartner = await findOnePartner(
			{
				'name.full': partnerUpdateData?.partner_name,
				partner_id: partnerUpdateData?.partner_id,
				status: 'active'
			},
			{partner_id: 1},
			true
		);

		if (isEmpty(existingPartner)) {
			app_warning(
				'Partner Not Found!',
				{
					'name.full': partnerUpdateData?.partner_name,
					partner_id: partnerUpdateData?.partner_id,
					status: 'active'
				},
				loggedUser,
				'Partner Update'
			);
			return {error: true, message: 'Partner Not Found!'};
		}

		let partnerUpdate = {
			partner: {
				name: partnerUpdateData?.partner_name,
				partner_id: partnerUpdateData?.partner_id
			}
		};

		let merchantPartnerUpdatedData = await merchantUpdate(partnerUpdate, merchantId, loggedUser);

		if (merchantPartnerUpdatedData?.error === true) {
			return {error: true, message: merchantPartnerUpdatedData?.message};
		}

		if (merchantPartnerUpdatedData?.error)
			app_error(merchantPartnerUpdatedData?.error, {}, 'Partner Update', loggedUser);
		let merchantResultData = JSON.parse(merchantPartnerUpdatedData?.body);

		if (!merchantResultData?.success) {
			app_warning(
				merchantResultData?.message || 'Could not update store. Please try after sometimes',
				merchantResultData,
				loggedUser,
				'Partner Update'
			);
			return {
				error: true,
				message: merchantResultData?.message || 'Could not update partner. Please try after sometimes'
			};
		}

		//Partner Update only for default store
		let storePartnerUpdatedData = await storeUpdate(partnerUpdate, merchantId, merchantId, loggedUser);

		if (storePartnerUpdatedData?.error === true) {
			return {error: true, message: storePartnerUpdatedData?.message};
		}

		if (storePartnerUpdatedData?.error) app_error(storePartnerUpdatedData?.error, {}, 'Partner Update', loggedUser);
		let storeResultData = JSON.parse(storePartnerUpdatedData?.body);

		if (!storeResultData?.success) {
			app_warning(
				storeResultData?.message || 'Could not update store. Please try after sometimes',
				storeResultData,
				loggedUser,
				'Partner Update'
			);
			return {
				error: true,
				message: storeResultData?.message || 'Could not update partner. Please try after sometimes'
			};
		}

		let data = {
			merchant: {
				merchant_id: merchantId,
				partner: merchantResultData?.data?.merchant?.partner
			},
			store: {
				store_id: merchantId,
				partner: storeResultData?.data?.store?.partner
			}
		};

		return {error: false, message: 'Partner Updated Successfully!', data};
	},

	merchantTypeUpdate: async (merchantTypeUpdateData, merchantId, files, loggedUser) => {
		try {
			const existingMerchant = await findOneMerchant(
				{merchant_id: merchantId, status: 'active'},
				{documents: 1, merchant_type: 1, createdAt: 1},
				true
			);

			if (isEmpty(existingMerchant)) {
				app_warning(
					'Merchant Not Found!',
					{
						merchant_id: merchantId,
						status: 'active'
					},
					loggedUser,
					'Merchant Type Updates'
				);
				return {error: true, message: 'Merchant Not Found!'};
			}

			//Files should not be empty (even if the changes are document name or number)
			if (isEmpty(files) || merchantTypeUpdateData.business_proof?.length !== files?.length) {
				app_warning(
					'Documents need to be uploaded!',
					{
						existing_merchant_type: existingMerchant?.merchant_type,
						new_merchant_type: merchantTypeUpdateData?.merchant_type
					},
					loggedUser,
					'Merchant Type Update'
				);
				return {error: true, message: 'Documents need to be uploaded!'};
			}

			let data = {};

			let documentsList = getDocuments(merchantTypeUpdateData?.merchant_type);
			let {givenDocumentCount, merchantTypeDocumentCount} = checkDocument(
				merchantTypeUpdateData?.business_proof,
				documentsList
			);

			if (givenDocumentCount !== merchantTypeDocumentCount) {
				app_warning(
					'Please select the correct document type!',
					{
						documents: merchantTypeUpdateData?.business_proof,
						merchant_type: existingMerchant?.merchant_type
					},
					loggedUser,
					'Business Proof'
				);
				return {error: true, message: 'Please select the correct document type!'};
			}

			//for merchant_type changes
			if (existingMerchant?.merchant_type !== merchantTypeUpdateData?.merchant_type) {
				if (merchantTypeUpdateData?.merchant_type === 'companies' && files?.length !== 6)
					return {
						error: true,
						message: 'Merchant type companies should provide 6 documents'
					};

				if (merchantTypeUpdateData?.merchant_type === 'partnership' && files?.length !== 3)
					return {
						error: true,
						message: 'Merchant type partnership should provide 3 documents'
					};
			}

			let results = files?.map(async (file) => {
				return await UpdateController.uploadImage({upload_for: 'businessproof'}, loggedUser, file, merchantId);
			});

			let paths = await Promise.all(results);
			let businessProofData = [];

			if (existingMerchant?.merchant_type === merchantTypeUpdateData?.merchant_type) {
				let businessProof = {};

				if (existingMerchant?.documents?.business_proof)
					for (const item of existingMerchant.documents.business_proof) {
						businessProof[item.document_type] = item;
					}

				for (const [index, item] of merchantTypeUpdateData?.business_proof?.entries() || []) {
					if (
						!isEmpty(item?.submitted) &&
						item?.submitted !== item?.name &&
						Object.keys(businessProof)?.includes(item?.name)
					) {
						return {error: true, message: 'Document already exists'};
					}
					let name = item?.submitted || item?.name;
					// eslint-disable-next-line security/detect-object-injection
					businessProof[name] = {
						document_type: item?.name,
						// eslint-disable-next-line security/detect-object-injection
						document_file: paths?.[index]?.data?.url,
						document_no: item?.number || ''
					};
				}

				businessProofData = Object.values(businessProof);
				existingMerchant.documents.is_resubmitted = true;
			} else if (existingMerchant?.merchant_type !== merchantTypeUpdateData?.merchant_type) {
				let merchantUpdatedData = await merchantUpdate(
					{merchant_type: merchantTypeUpdateData?.merchant_type},
					merchantId,
					loggedUser
				);
				if (merchantUpdatedData?.error === true) {
					return {error: true, message: merchantUpdatedData?.message};
				}

				if (merchantUpdatedData?.error)
					app_error(merchantUpdatedData?.error, {}, 'Update Merchant Type', loggedUser);
				let resultData = JSON.parse(merchantUpdatedData?.body);

				if (!resultData?.success) {
					app_warning(
						resultData?.message || 'Could not update merchant. Please try after sometimes',
						resultData,
						loggedUser,
						'Update Merchant Type'
					);
					return {
						error: true,
						message: resultData?.message || 'Could not update merchant. Please try after sometimes'
					};
				}

				data.merchant_type = resultData?.data?.merchant?.merchant_type;

				businessProofData = merchantTypeUpdateData?.business_proof?.map((document, index) => {
					return {
						document_type: document?.name,
						// eslint-disable-next-line security/detect-object-injection
						document_file: paths?.[index]?.data?.url,
						document_no: document?.number || ''
					};
				});
			}

			let options = {
				method: 'PATCH',
				url: Config.SERVICE.AUTH_SERVICE_URL + '/merchant/update/business-proof/' + merchantId,
				body: businessProofData,
				merchant: loggedUser
			};

			let updatedData = await networkCall(options);

			if (updatedData?.error) app_error(updatedData?.error, {}, 'Business Proof', loggedUser);

			let resultData = JSON.parse(updatedData?.body);

			if (!resultData?.success) {
				app_warning(
					resultData?.message || 'Business Proof could not be saved!',
					{updatedData, options},
					loggedUser,
					'Business Proof'
				);
				return {error: true, message: resultData?.message || 'Business Proof could not be saved!'};
			}

			data.business_proof = resultData?.data?.documents?.business_proof;

			return {error: false, message: 'Merchant Type Updated Successfully', data};
		} catch (error) {
			app_error(error, {}, 'Merchant Type Update', loggedUser);
			return {error: true, message: 'Something went wrong! Please try again'};
		}
	},

	businessTypeUpdate: async (businessTypeUpdateData, merchantId, loggedUser) => {
		let UpdateData = {
			business_type: businessTypeUpdateData?.business_type
		};

		let merchantUpdatedData = await merchantUpdate(UpdateData, merchantId, loggedUser);

		if (merchantUpdatedData?.error === true) {
			return {error: true, message: merchantUpdatedData?.message};
		}

		if (merchantUpdatedData?.error) app_error(merchantUpdatedData?.error, {}, 'Update Business Type', loggedUser);
		let merchantResultData = JSON.parse(merchantUpdatedData?.body);

		if (!merchantResultData?.success) {
			app_warning(
				merchantResultData?.message || 'Could not update business type. Please try after sometimes',
				merchantResultData,
				loggedUser,
				'Update Business Type'
			);
			return {
				error: true,
				message: merchantResultData?.message || 'Could not update business type. Please try after sometimes'
			};
		}

		//Business Type Update only for default store
		let storePartnerUpdatedData = await storeUpdate(UpdateData, merchantId, merchantId, loggedUser);

		if (storePartnerUpdatedData?.error === true) {
			return {error: true, message: storePartnerUpdatedData?.message};
		}

		if (storePartnerUpdatedData?.error)
			app_error(storePartnerUpdatedData?.error, {}, 'Update Business Type', loggedUser);
		let storeResultData = JSON.parse(storePartnerUpdatedData?.body);

		if (!storeResultData?.success) {
			app_warning(
				storeResultData?.message || 'Could not update business type. Please try after sometimes',
				storeResultData,
				loggedUser,
				'Update Business Type'
			);
			return {
				error: true,
				message: storeResultData?.message || 'Could not business type. Please try after sometimes'
			};
		}

		let data = {
			merchant: {
				merchant_id: merchantId,
				business_type: merchantResultData?.data?.merchant?.business_type
			},
			store: {
				store_id: merchantId,
				business_type: storeResultData?.data?.store?.business_type
			}
		};

		return {error: false, message: 'Business Type Updated Successfully!', data};
	},

	uploadImage: async (uploadDetails, loggedUser, imageFile, merchantId) => {
		try {
			if (isEmpty(imageFile)) {
				app_warning('File Not Found!', {}, loggedUser, 'Image Upload');
				return {error: true, message: 'File Not Found'};
			}

			let options = {
				method: 'POST',
				url: Config.SERVICE.COMMON_SERVICE_URL + '/s3/upload',
				is_file_upload: true,
				headers: {
					filepath: 'store/' + merchantId + '/' + uploadDetails?.upload_for + '/'
				},
				formData: {
					uploadFile: {
						value: imageFile.buffer,
						options: {
							filename: imageFile.originalname,
							contentType: imageFile.mimetype
						}
					}
				},
				admin: loggedUser
			};

			let upload = await networkCall(options);
			if (upload?.error) app_error(upload?.error, {}, 'File Upload', loggedUser);
			let resultData = JSON.parse(upload?.body);
			if (!resultData?.success) {
				app_warning('Could not upload image.', {resultData, options}, loggedUser, 'File Upload');
				return {error: true, message: 'Could not upload image.'};
			}

			return {error: false, message: 'File uploaded successfully!', data: resultData?.data};
		} catch (error) {
			app_error(error, {}, 'File Upload', loggedUser);
			return {error: true, message: 'Something went wrong! Please try again'};
		}
	},

	addressUpdate: async (addressUpdateData, merchantId, storeId, loggedUser) => {
		try {
			let locationData = {
				location: {
					agent_store: {
						street_name: addressUpdateData?.street_name,
						area: addressUpdateData?.area,
						city: addressUpdateData?.city,
						state: addressUpdateData?.state,
						pincode: addressUpdateData?.pincode
					}
				}
			};

			let options = {
				method: 'GET',
				url: Config.SERVICE.COMMON_SERVICE_URL + '/geolocation/get_location',
				body: {
					address:
						addressUpdateData?.street_name +
						',' +
						addressUpdateData?.area +
						',' +
						addressUpdateData?.city +
						',' +
						addressUpdateData?.state +
						',' +
						addressUpdateData?.pincode
				}
			};

			let result = await networkCall(options);
			if (result?.error) app_error(result?.error, {}, 'Location Update', loggedUser);
			let parsedData = JSON.parse(result?.body);
			if (!parsedData?.success) {
				app_warning('LOC could not be fetched!', {options, parsedData, loggedUser}, 'Location Update');
				return {error: true, message: 'LOC could not be fetched!'};
			}

			locationData.loc = [+parsedData?.data?.lat, +parsedData?.data?.lng];

			let resultData;

			if (isEmpty(storeId)) {
				let merchantUpdatedData = await merchantUpdate(locationData, merchantId, loggedUser);
				if (merchantUpdatedData?.error === true) {
					return {error: true, message: merchantUpdatedData?.message};
				}

				if (merchantUpdatedData?.error)
					app_error(merchantUpdatedData?.error, {}, 'Update Merchant Address', loggedUser);
				resultData = JSON.parse(merchantUpdatedData?.body);

				if (!resultData?.success) {
					app_warning(
						resultData?.message || 'Could not update merchant. Please try after sometimes',
						resultData,
						loggedUser,
						'Update Merchant Address'
					);
					return {
						error: true,
						message: resultData?.message || 'Could not update merchant. Please try after sometimes'
					};
				}
			} else if (!isEmpty(storeId)) {
				let storeUpdatedData = await storeUpdate(locationData, merchantId, storeId, loggedUser);
				if (storeUpdatedData?.error === true) {
					return {error: true, message: storeUpdatedData?.message};
				}
				if (storeUpdatedData?.error)
					app_error(storeUpdatedData?.error, {}, 'Update Merchant Address', loggedUser);
				resultData = JSON.parse(storeUpdatedData?.body);

				if (!resultData?.success) {
					app_warning(
						resultData?.message || 'Could not update merchant. Please try after sometimes',
						resultData,
						loggedUser,
						'Update Merchant Address'
					);
					return {
						error: true,
						message: resultData?.message || 'Could not update merchant. Please try after sometimes'
					};
				}
			}

			let data = {
				location: resultData?.data?.merchant?.location || resultData?.data?.store?.location
			};

			return {error: false, message: resultData?.message, data};
		} catch (error) {
			app_error(error, {}, 'Merchant Type Update', loggedUser);
			return {error: true, message: 'Something went wrong! Please try again'};
		}
	},

	panUpdate: async (panData, file, merchantId, loggedUser) => {
		try {
			let existingMerchant = await findOneMerchant(
				{merchant_id: merchantId, status: 'active'},
				{merchant_id: 1, documents: 1, createdAt: 1},
				true
			);
			if (isEmpty(existingMerchant)) {
				app_warning(
					'Merchant Not Found!',
					{merchant_id: merchantId, status: 'active'},
					loggedUser,
					'PAN Update'
				);
				return {error: true, message: 'Merchant Not Found!'};
			}
			let existingPan = await findOneMerchant(
				{'documents.pan.number': panData?.pan_number, merchant_id: {$ne: merchantId}},
				{'documents.pan': 1},
				true
			);
			if (!isEmpty(existingPan)) {
				app_warning(
					'PAN already exists!',
					{'documents.pan.number': panData?.pan_number, merchant_id: {$ne: merchantId}},
					loggedUser,
					'PAN Update'
				);
				return {error: true, message: 'PAN already exists!'};
			}

			let path = await UpdateController.uploadImage({upload_for: 'pan'}, loggedUser, file[0], merchantId);

			let options = {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				url: Config.SERVICE.COMMON_SERVICE_URL + '/validate/kyc/pan',
				merchant: merchantId,
				body: {pan_number: panData?.pan_number},
				admin: loggedUser
			};

			let panVerify = await networkCall(options);
			if (panVerify?.error) app_error(panVerify?.error, {}, 'PAN Verify', loggedUser);
			let result = JSON.parse(panVerify?.body);
			if (!result?.success) {
				app_warning('Could not verify Pan Number.', options, panData?.logged_user, 'PAN Verify');
				return {error: true, message: 'Could not verify Pan Number.'};
			}

			let panUpdateData = {
				documents: {
					pan: {
						pan_image: {
							front: path?.data?.url || panData?.uploadFile
						},
						image: {
							front: path?.data?.url || panData?.uploadFile
						},
						number: panData?.pan_number,
						status: 'approved',
						verify_response: result?.data?.pan
					}
				}
			};

			let panUpdateOptions = {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				url: Config.SERVICE.AUTH_SERVICE_URL + '/merchant/validate/pan/' + merchantId,
				body: panUpdateData,
				merchant: panData?.logged_user
			};

			let panUpdated = await networkCall(panUpdateOptions);

			if (!isEmpty(panUpdated?.error)) app_error(panUpdated?.error, {}, 'PAN Verify', panData?.logged_user);

			let resultDataPanUpdate = JSON.parse(panUpdated?.body);
			if (!resultDataPanUpdate?.success) {
				app_warning(
					resultDataPanUpdate?.message || 'Could not update PAN.',
					{resultDataPanUpdate, panUpdateOptions},
					panData?.logged_user,
					'PAN Verify'
				);
				return {error: resultDataPanUpdate?.message || 'Could not update PAN.'};
			}

			return {
				error: false,
				message: 'PAN updated successfully!',
				data: resultDataPanUpdate?.data?.merchant?.documents?.pan
			};
		} catch (error) {
			app_error(error, {}, 'PAN Update', loggedUser);
			return {error: true, message: 'Something went wrong! Please try again'};
		}
	},

	addressProofUpdate: async (kycDocuments, files, merchantId, loggedUser) => {
		try {
			let pathFront;
			let pathBack;
			if (!isEmpty(files)) {
				if (files.fileFront) {
					pathFront = await UpdateController.uploadImage(
						{upload_for: kycDocuments?.doc_type},
						loggedUser,
						files.fileFront[0],
						merchantId
					);
				}
				if (files.fileBack) {
					pathBack = await UpdateController.uploadImage(
						{upload_for: kycDocuments?.doc_type},
						loggedUser,
						files.fileBack[0],
						merchantId
					);
				}
			}
			let existingMerchant = await findOneMerchant(
				{merchant_id: merchantId, status: 'active'},
				{documents: 1, createdAt: 1, merchant_id: 1},
				true
			);

			if (isEmpty(existingMerchant)) {
				app_warning(
					'Merchant Not Found!',
					{merchant_id: merchantId, status: 'active'},
					loggedUser,
					'Address Proof Update'
				);
				return {error: true, message: 'Merchant Not Found!'};
			}

			let number = kycDocuments?.number;
			let queryCondition = {
				merchant_id: {$ne: existingMerchant?.merchant_id}
			};
			queryCondition[`documents.${kycDocuments?.doc_type}.number`] = number;
			let projectCondition = {};
			projectCondition[`documents.${kycDocuments?.doc_type}`] = 1;

			let existingId = await findOneMerchant(queryCondition, projectCondition, true);

			if (!isEmpty(existingId)) {
				app_warning(
					`${kycDocuments?.doc_type} already exists!`,
					queryCondition,
					loggedUser,
					'Address Proof Helper'
				);
				return {error: true, message: `${kycDocuments?.doc_type} already exists!`};
			}

			let options = {
				method: 'PATCH',
				url: Config.SERVICE.AUTH_SERVICE_URL + '/merchant/addressProofUpdate/' + merchantId,
				body: {
					id_number: number,
					document_type: kycDocuments?.doc_type === 'license' ? 'driving_license' : kycDocuments?.doc_type,
					dob: kycDocuments?.date_of_birth || '',
					name: kycDocuments?.name || '',
					documents: {
						image: {
							front: pathFront?.data?.url || kycDocuments?.fileFront,
							back: pathBack?.data?.url || kycDocuments?.fileBack
						}
					}
				}
			};

			let verifiedData = await networkCall(options);
			if (verifiedData?.error) app_error(verifiedData?.error, {}, 'Address Proof', loggedUser);
			let resultData = JSON.parse(verifiedData?.body);
			if (!resultData?.success) {
				app_warning(resultData?.message, options, loggedUser, 'Address Proof');
				return {error: true, message: resultData?.message || 'Verification Failed! Please try again.'};
			}

			return {
				error: false,
				message: 'Address Proof  Submitted Successfully!',
				data: resultData?.data
			};
		} catch (error) {
			app_error(error, {}, 'Address Proof Update', loggedUser);
			return {error: true, message: 'Something went wrong! Please try again'};
		}
	},

	storeImageUpdate: async (files, merchantId, storeId, loggedUser) => {
		try {
			if (isEmpty(files)) {
				app_warning('Please provide files to upload!', {files}, loggedUser, 'Store Image Update');
				return {error: true, message: 'Please provide files to upload!'};
			}

			let existingMerchant = await findOneMerchant(
				{merchant_id: merchantId, status: 'active'},
				{createdAt: 1, documents: 1},
				false
			);

			if (isEmpty(existingMerchant)) {
				app_warning(
					'Merchant Not Found!',
					{merchant_id: merchantId, status: 'active'},
					loggedUser,
					'Store Image Update'
				);
				return {error: true, message: 'Merchant Not Found!'};
			}

			let existingStore = await findOneStore(
				{merchant_id: merchantId, store_id: storeId, status: 'active'},
				{createdAt: 1, documents: 1},
				false
			);

			if (isEmpty(existingStore)) {
				app_warning(
					'Store Not Found!',
					{merchant_id: merchantId, store_id: storeId, status: 'active'},
					loggedUser,
					'Store Image Update'
				);
				return {error: true, message: 'Store Not Found!'};
			}
			let store_front;
			let store_name_board;
			let store_inside;
			if (files?.store_front) {
				store_front = await UpdateController.uploadImage(
					{upload_for: 'full_store'},
					loggedUser,
					files.store_front[0],
					merchantId
				);
			}
			if (files?.store_name_board) {
				store_name_board = await UpdateController.uploadImage(
					{upload_for: 'name_board'},
					loggedUser,
					files.store_name_board[0],
					merchantId
				);
			}
			if (files?.store_inside) {
				store_inside = await UpdateController.uploadImage(
					{upload_for: 'inside_view'},
					loggedUser,
					files.store_inside[0],
					merchantId
				);
			}

			existingStore.documents.store.image.front =
				store_front?.data?.url || existingStore?.documents?.store?.image?.front;
			existingStore.documents.store.image.name_board =
				store_name_board?.data?.url || existingStore?.documents?.store?.image?.name_board;
			existingStore.documents.store.image.inside_view =
				store_inside?.data?.url || existingStore?.documents?.store?.image?.inside_view;
			existingStore.documents.store.store_image.front =
				store_front?.data?.url || existingStore?.documents?.store?.image?.front;
			existingStore.documents.store.store_image.name_board =
				store_name_board?.data?.url || existingStore?.documents?.store?.image?.name_board;
			existingStore.documents.store.store_image.inside_view =
				store_inside?.data?.url || existingStore?.documents?.store?.image?.inside_view;

			existingStore.markModified('documents.store.image.front');
			existingStore.markModified('documents.store.image.name_board');
			existingStore.markModified('documents.store.image.inside_view');
			existingStore.markModified('documents.store.store_image.front');
			existingStore.markModified('documents.store.store_image.name_board');
			existingStore.markModified('documents.store.store_image.inside_view');
			await existingStore.save();

			let data = {store: existingStore?.documents?.store};

			if (merchantId === storeId) {
				existingMerchant.documents.store.image.front =
					store_front?.data?.url || existingMerchant?.documents?.store?.image?.front;
				existingMerchant.documents.store.image.name_board =
					store_name_board?.data?.url || existingMerchant?.documents?.store?.image?.name_board;
				existingMerchant.documents.store.image.inside_view =
					store_inside?.data?.url || existingMerchant?.documents?.store?.image?.inside_view;
				existingMerchant.documents.store.store_image.front =
					store_front?.data?.url || existingMerchant?.documents?.store?.image?.front;
				existingMerchant.documents.store.store_image.name_board =
					store_name_board?.data?.url || existingMerchant?.documents?.store?.image?.name_board;
				existingMerchant.documents.store.store_image.inside_view =
					store_inside?.data?.url || existingMerchant?.documents?.store?.image?.inside_view;

				existingMerchant.markModified('documents.store.image.front');
				existingMerchant.markModified('documents.store.image.name_board');
				existingMerchant.markModified('documents.store.image.inside_view');
				existingMerchant.markModified('documents.store.store_image.front');
				existingMerchant.markModified('documents.store.store_image.name_board');
				existingMerchant.markModified('documents.store.store_image.inside_view');
				await existingMerchant.save();

				data.merchant = existingMerchant.documents.store;
			}

			return {
				error: false,
				message: 'Store Image Uploaded Successfully!',
				data
			};
		} catch (error) {
			app_error(error, {}, 'Store Image Update', loggedUser);
			return {error: true, message: 'Something went wrong! Please try again'};
		}
	}
};

module.exports = UpdateController;
