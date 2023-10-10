// eslint-disable-next-line node/no-missing-require
require('../Source/index');
const {createAdmin, deleteAdmin} = require('../Source/Repository/AdminRepository');
const {createMerchant, deleteMerchant} = require('../Source/Repository/MerchantRepository');
const {createStore, deleteStore} = require('../Source/Repository/StoreRepository');
const {createSubUser, deleteSubUser} = require('../Source/Repository/SubUserRepository');
const {
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
} = require('./Documents');
before(async function () {
	await createAdmin({document: admin});
	await createAdmin({document: admin2});
	await createMerchant({document: merchant});
	await createMerchant({document: merchant2});
	await createMerchant({document: merchant3});
	await createStore({document: store});
	await createStore({document: store2});
	await createStore({document: store3});
	await createSubUser({document: subUser});
	await createSubUser({document: subUser2});
});
Promise.all([
	require('./BankRouter/Create.test'),
	require('./BankRouter/FetchIfsc.test'),
	require('./BankRouter/BankList.test'),
	require('./AuthRouter/AdminLoginForRoute.test'),
	require('./AuthRouter/AdminLoginWithOtpForRoute.test'),
	require('./MerchantRouter/MerchantCreate.test'),
	require('./MerchantRouter/MerchantDetails.test'),
	require('./MerchantRouter/MerchantList.test'),
	require('./LoanRouter/LoanDetails.test'),
	require('./LoanRouter/LoanList.test'),
	require('./LoanRouter/EmiDetail.test'),
	require('./LoanRouter/EmiList.test'),
	require('./LoanRouter/EmiListAll.test'),
	require('./LoanRouter/EmiReschedule.test'),
	require('./LoanRouter/EmiStats.test'),
	require('./LoanRouter/LoanCollectionStats.test'),
	require('./LoanRouter/LoanDetails.test'),
	require('./LoanRouter/LoanStats.test'),
	require('./LoanRouter/SettlementDetail.test'),
	require('./LoanRouter/SettlementList.test'),
	require('./LoanRouter/Update.test'),
	require('./StoreRouter/StoreCreate.test'),
	require('./StoreRouter/StoreList.test'),
	require('./StoreRouter/StoreDetails.test'),
	require('./VpaRouter/vpaList.test'),
	require('./VpaRouter/update.test'),
	require('./VpaRouter/statusChange.test'),
	require('./VpaRouter/vpaDetails.test'),
	require('./VpaRouter/update.test'),
	require('./VpaRouter/statusChange.test'),
	require('./VpaRouter/Create.test'),
	require('./SubUserRouter/SubUserList.test'),
	require('./SubUserRouter/SubUserCreate.test'),
	require('./SubUserRouter/SubUserDetails.test'),
	require('./SubMerchantRouter/create.test'),
	require('./SubMerchantRouter/Details.test'),
	require('./SubMerchantRouter/List.test'),
	require('./AdminRouter/AdminDetails.test'),
	require('./AdminRouter/SubAdminList.test'),
	require('./PropertiesRouter/CategoryList.test'),
	require('./DisputeRouter/DisputeList.test'),
	require('./DisputeRouter/DisputeDetails.test'),
	require('./DisputeRouter/DisputeStatusChange.test'),
	require('./CategoryRoute/CategoryList.test'),
	require('./CategoryRoute/CategoryCreate.test'),
	require('./CategoryRoute/CategoryDetail.test'),
	require('./CategoryRoute/CategoryUpdate.test'),
	require('./CategoryRoute/StatusUpdate.test'),
	require('./PosrequestRoute/Detail.test'),
	require('./PosrequestRoute/RejectReason.test'),
	require('./PosrequestRoute/StatusUpdate.test'),
	require('./PosrequestRoute/list.test'),
	require('./ProductRouter/Create.test'),
	require('./ProductRouter/Detail.test'),
	require('./ProductRouter/List.test'),
	require('./ProductRouter/StatusUpdate.test'),
	require('./ProductRouter/Update.test'),
	require('./PushNotificationRouter/bulkNotify.test'),
	require('./PushNotificationRouter/MerchantNotify.test'),
	require('./SoundBoxRouter/SoundBoxDetails.test'),
	require('./AgentRouter/AgentDetails.test'),
	require('./AgentRouter/AgentList.test'),
	require('./AgentRouter/EditAgent.test'),
	require('./AgentRouter/ApproveClockin.test'),
	require('./AgentRouter/MapLocation.test'),
	require('./AgentRouter/ChangeRole.test'),
	require('./AgentRouter/ChangeStatus.test'),
	require('./SoundBoxRouter/ChangeStatus.test'),
	require('./SoundBoxRouter/SoundboxList.test'),
	require('./SoundBoxRouter/SoundBoxDetails.test'),
	require('./QcRouter/UpdateCategory.test'),
	require('./QcRouter/ApproveMerchant.test'),
	require('./TransactionRouter/TransactionList.test'),
	require('./TransactionRouter/TransactionDetail.test'),
	require('./VpaReconciliationsRouter/VpaReconciliationDetail.test'),
	require('./VpaReconciliationsRouter/VpaReconciliationList.test'),
	require('./VpaReconciliationsRouter/VpaReconciliationReport.test'),
	require('./SurveyRouter/SurveyList.test'),
	require('./SurveyRouter/SurveyDetails.test')
]);
after(async function () {
	await deleteAdmin({admin_id: 'BWpaitTqT5'}, {});
	await deleteAdmin({admin_id: 'XuizTx6Lsf'}, {});
	await deleteMerchant({merchant_id: 'gSyr95bsg3'});
	await deleteMerchant({merchant_id: 'asdfg123_i'});
	await deleteMerchant({merchant_id: 'afhjds@_123'});
	await deleteStore({store_id: 'gSyr95bsg3'});
	await deleteStore({store_id: 'asdf123$x5'});
	await deleteStore({store_id: 'qwe234af34'});
	await deleteSubUser({sub_user_id: '5dQkRgMC3x'});
	await deleteSubUser({sub_user_id: '5067hdgfvb'});
});
