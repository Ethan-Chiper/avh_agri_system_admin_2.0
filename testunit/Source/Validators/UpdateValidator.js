const {check} = require('express-validator');
const {isEmpty} = require('../Helpers/Utils');

const UpdateValidator = {
	storeNameValidate: () => {
		return [check('store_name', 'Please provide store name').notEmpty().trim()];
	},
	outletTypeValidate: () => {
		return [
			check('outlet_type', 'Please provide outlet type')
				.notEmpty()
				.trim()
				.isIn(['fixed', 'non_fixed'])
				.withMessage('The Outlet Type should be fixed or non_fixed')
		];
	},

	merchantTypeValidate: () => {
		return [
			check('merchant_type', 'Please provide merchant type')
				.notEmpty()
				.trim()
				.isIn(['proprietor', 'partnership', 'companies'])
				.withMessage('The merchant type should be proprietor, partnership, or companies'),
			check('business_proof', 'Please provide business proofs')
				.optional({nullable: true})
				.custom(async (value, {req}) => {
					await check('business_proof.*.name', 'Please provide document name ').trim().notEmpty().run(req);
					await check('business_proof.*.number').trim().optional({nullable: true}).run(req);
					await check('business_proof.*.submitted').trim().optional({nullable: true}).run(req);
					let documentTypes = new Set();
					for (let index = 0; index < value?.length; index++) {
						// eslint-disable-next-line security/detect-object-injection
						let documentType = value[index].name;
						if (
							(documentType ===
								// eslint-disable-next-line prettier/prettier
								'Udyog Aadhaar/District Industries Center (DIC)/Small Scale Industries (SSI) Certificate- Acknowledgement Part-II issued by DIC/SSI containing Entrepreneur\'s Memorandum Number. Duly stamped and signed by issuing authority.(Will be considered as second entity proof.)' ||
								documentType === 'License issued by Food and Drug Control Authorities') &&
							// eslint-disable-next-line security/detect-object-injection
							isEmpty(value[index]?.number)
						) {
							throw new Error('Document number should be provided!');
						}
						if (documentTypes.has(documentType)) {
							throw new Error('Please check the documents provided');
						}
						documentTypes.add(documentType);
					}
					return true;
				})
		];
	},

	addressValidate: () => {
		return [
			check('street_name', 'Please provide street name').trim().notEmpty(),
			check('area', 'Please provide area').trim().notEmpty(),
			check('city', 'Please provide city').trim().notEmpty(),
			check('state', 'Please provide state').trim().notEmpty(),
			check('pincode', 'Please provide pincode').trim().notEmpty()
		];
	},

	panValidation: () => {
		return [
			check('pan_number', 'Please provide pan number')
				.trim()
				.notEmpty()
				.isLength({
					min: 10,
					max: 10
				})
				.withMessage('Pan Number should have 10 characters')
				.isAlphanumeric()
				.withMessage('Pan Number should be alpha-numeric only.')
		];
	},
	addressProofValidation: () => {
		return [
			check('doc_type', 'Please provide Document Type for address proof')
				.trim()
				.notEmpty()
				.isIn(['voter_id', 'license', 'passport'])
				.withMessage('Document Types should be voter_id, license, or passport only.'),
			check('number', 'Please provide selected document number.').trim().notEmpty(),
			check('doc_type').custom(async (value, {req}) => {
				if (value === 'license') {
					await check('date_of_birth', 'Please provide date of birth field.')
						.trim()
						.notEmpty()
						.isISO8601()
						.withMessage('Date of Birth should be a date with format YYYY-MM-DD')
						.run(req);

					await check('number')
						.isLength({
							min: 15,
							max: 15
						})
						.withMessage('Driver License should be 15 characters long')
						.isAlphanumeric()
						.withMessage('Driver License should be alpha-numeric only.')
						.run(req);
				}
				if (value === 'passport') {
					await check('number')
						.isAlphanumeric()
						.withMessage('Passport Number should be alpha-numeric only.')
						.isLength({
							min: 15,
							max: 15
						})
						.withMessage('The Passport File Number should be 15 characters long')
						.run(req);

					await check('date_of_birth', 'Please provide date of birth field.')
						.trim()
						.notEmpty()
						.isISO8601()
						.withMessage('Date of Birth should be a date with format YYYY-MM-DD')
						.run(req);

					await check('name', 'Please provide your name as it is in your passport')
						.trim()
						.notEmpty()
						.isLength({max: 50})
						.withMessage('Name should not exceed 50 characters')
						.matches(/^(?!^\d+$)[\d !&',.A-Za-z-]+$/)
						// eslint-disable-next-line quotes
						.withMessage("Name must be alphabetic. Should contain only alphabets, numbers, !&, '.-")
						.run(req);
				}
				if (value === 'voterId') {
					await check('number')
						.isLength({
							min: 10,
							max: 10
						})
						.withMessage('Voter ID should have 10 characters.')
						.isAlphanumeric()
						.withMessage('Voter ID should be alpha-numeric only.')
						.run(req);
				}
				return true;
			})
		];
	},

	businessProofValidation: () => {
		return [];
	},

	partnerUpdateValidation: () => {
		return [
			check('partner_name', 'Please provide partner name')
				.trim()
				.notEmpty()
				.isIn(['TNRTP', 'TNCDW', 'Ippopay'])
				.withMessage('Partner Name should be TNRTP, TNCDW, or Ippopay'),
			check('partner_id', 'Please provide partner ID').trim().notEmpty()
		];
	},
	businessTypeUpdateValidation: () => {
		return [
			check('business_type', 'Please provide business type')
				.trim()
				.notEmpty()
				.isIn(['trade', 'enterprise'])
				.withMessage('Business type should be trade or enterprise')
		];
	}
};

module.exports = UpdateValidator;
