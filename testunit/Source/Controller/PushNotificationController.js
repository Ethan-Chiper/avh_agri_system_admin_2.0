const TokenModel = require('../Models/TokenModel');
const {sendPush} = require('../Helpers/Utils');
const {app_warning, app_error} = require('../Helpers/Logger');

const PushNotification = {
	/**
	 * to send push notification to all registered devices.
	 * @param data
	 * @param page
	 * @returns {Promise<{error: boolean, message: string}|{data: *, error: boolean, message: string}>}
	 */
	sendBulkPush: async (data, page) => {
		try {
			let limit = 100;
			let skip = limit * (page - 1);
			let registration_ids = await TokenModel.aggregate([
				{
					$match: {
						'devicedetails.device_type': {$ne: undefined}
					}
				},
				{
					$skip: skip
				},
				{
					$limit: limit
				},
				{
					$group: {
						_id: '$devicedetails.device_type',
						tokens: {
							$push: '$devicedetails.token'
						}
					}
				},
				{
					$group: {
						_id: undefined,
						registration_ids: {
							$push: {
								k: '$_id',
								v: '$tokens'
							}
						}
					}
				},
				{
					$replaceRoot: {
						newRoot: {$arrayToObject: '$registration_ids'}
					}
				}
			]);
			if (registration_ids && registration_ids[0]) {
				let registration_id = registration_ids[0];
				let payload = {
					message: data?.message,
					title: data?.title
				};
				let android = registration_id.android ?? [];
				await sendPush(android, payload, async () => {
					await PushNotification.sendBulkPush(data, page + 1);
				});
				return {error: false, message: 'Push Notification sent!', data: []};
			} else {
				app_warning(
					'Could not send Notification',
					{registration_ids},
					data?.loggedUser,
					'Send Notification in Bulk'
				);
				return {error: true, message: 'Could not send Notification'};
			}
		} catch (error) {
			app_error(error, {}, 'Send Notification in Bulk', data?.loggedUser);
			return {error: true, message: 'Something went wrong'};
		}
	},

	/**
	 * to send push notification to all registered devices of a particular merchant
	 * @param data
	 * @returns {Promise<{data, error: boolean, message: string}|{error: boolean, message: string}>}
	 */

	sendMerchantPush: async (data) => {
		try {
			let registration_ids = await TokenModel.aggregate([
				{
					$match: {
						merchant_id: data?.merchant_id,
						'devicedetails.device_type': {$ne: undefined}
					}
				},
				{
					$group: {
						_id: '$devicedetails.device_type',
						tokens: {
							$push: '$devicedetails.token'
						}
					}
				},
				{
					$group: {
						_id: undefined,
						registration_ids: {
							$push: {
								k: '$_id',
								v: '$tokens'
							}
						}
					}
				},
				{
					$replaceRoot: {
						newRoot: {$arrayToObject: '$registration_ids'}
					}
				}
			]);
			if (registration_ids && registration_ids[0]) {
				let registration_id = registration_ids[0];
				let payload = {
					message: data?.message,
					title: data?.title,
					image: data?.image ?? ''
				};
				let android = registration_id.android ?? [];
				await sendPush(android, payload, async () => {
					// eslint-disable-next-line no-console
					console.log('Sending Notification');
				});
				return {error: false, message: 'Push Notification sent!', data: []};
			}
			app_warning('Could not send Notification', {registration_ids}, data?.loggedUser, 'Push Notification');
			return {error: true, message: 'Could not send Notification'};
		} catch (error) {
			app_error(error, {}, 'Push Notification', data?.loggedUser);
			return {error: true, message: 'Something went wrong'};
		}
	}
};
module.exports = PushNotification;
