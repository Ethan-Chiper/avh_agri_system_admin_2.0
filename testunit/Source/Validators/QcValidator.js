const {check} = require('express-validator');
const {isEmpty} = require('../Helpers/Utils');

const QcValidation = {
	updateCategoryValidator: () => {
		return [
			check('store_category', 'Please provide store category.').trim().notEmpty(),
			check('category_code', 'Please provide category code.').trim().notEmpty(),
			check('store_subCategory', 'Please provide sub category.').trim().notEmpty()
		];
	},

	approveVpa: () => {
		return [
			check('vpa_id', 'Please provide the VPA ID')
				.trim()
				.notEmpty()
				.isLength({max: 100})
				.withMessage('VPA ID should not exceed 100 characters.')
				.matches(/^[\d@A-Za-z]+$/)
				// eslint-disable-next-line quotes
				.withMessage('VPA ID must be alphabetic. Should contain only alphabets, numbers, and @')
		];
	},

	merchantApproveValidator: () => {
		return [
			check('merchant_id', 'Please provide merchant id').notEmpty(),
			check('document_status', 'Please provide status').notEmpty(),
			check('document_status').isIn(['approved', 'rejected']).withMessage('Invalid document status'),
			check('document_status').custom((value, {req}) => {
				if (value === 'rejected') {
					if (isEmpty(req?.body?.reject_reason)) {
						throw new Error('Please provide rejected reason');
					} else {
						return value;
					}
				} else {
					return value;
				}
			})
		];
	}
};

module.exports = QcValidation;
