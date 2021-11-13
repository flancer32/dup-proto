/**
 * Check invite and return server keys if invite is valid.
 *
 * @namespace Fl32_Dup_Back_WAPI_User_Invite_Validate
 */
// MODULE'S VARS
const NS = 'Fl32_Dup_Back_WAPI_User_Invite_Validate';

/**
 * @implements TeqFw_Web_Back_Api_Service_IFactory
 */
export default class Fl32_Dup_Back_WAPI_User_Invite_Validate {

    constructor(spec) {
        // EXTRACT DEPS
        /** @type {TeqFw_Db_Back_RDb_IConnect} */
        const conn = spec['TeqFw_Db_Back_RDb_IConnect$'];
        /** @type {TeqFw_Db_Back_Api_RDb_ICrudEngine} */
        const crud = spec['TeqFw_Db_Back_Api_RDb_ICrudEngine$'];
        /** @type {Fl32_Dup_Shared_WAPI_User_Invite_Validate.Factory} */
        const route = spec['Fl32_Dup_Shared_WAPI_User_Invite_Validate#Factory$'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castDate|function} */
        const castDate = spec['TeqFw_Core_Shared_Util_Cast.castDate'];
        /** @type {TeqFw_Web_Push_Back_Act_Subscript_LoadKeys.act|function} */
        const actLoadWebPushKeys = spec['TeqFw_Web_Push_Back_Act_Subscript_LoadKeys$'];
        /** @type {Fl32_Dup_Back_Act_User_Invite_Clean.act|function} */
        const actClean = spec['Fl32_Dup_Back_Act_User_Invite_Clean$'];
        /** @type {Fl32_Dup_Back_Store_RDb_Schema_User_Invite} */
        const metaInvite = spec['Fl32_Dup_Back_Store_RDb_Schema_User_Invite$'];

        // DEFINE WORKING VARS / PROPS
        /** @type {typeof Fl32_Dup_Back_Store_RDb_Schema_User_Invite.ATTR} */
        const A_INVITE = metaInvite.getAttributes();

        // DEFINE INSTANCE METHODS
        this.getRouteFactory = () => route;

        this.getService = function () {
            // DEFINE INNER FUNCTIONS

            /**
             * @param {TeqFw_Web_Back_Api_Service_Context} context
             * @return Promise<void>
             */
            async function service(context) {
                // DEFINE INNER FUNCTIONS
                /**
                 * @param {TeqFw_Db_Back_RDb_ITrans} trx
                 * @param {string} code
                 * @returns {Promise<Fl32_Dup_Back_Store_RDb_Schema_User_Invite.Dto|null>}
                 */
                async function selectInvite(trx, code) {
                    const norm = code.trim().toLowerCase();
                    return await crud.readOne(trx, metaInvite, {[A_INVITE.CODE]: norm});
                }

                // MAIN FUNCTIONALITY
                /** @type {Fl32_Dup_Shared_WAPI_User_Invite_Validate.Request} */
                const req = context.getInData();
                /** @type {Fl32_Dup_Shared_WAPI_User_Invite_Validate.Response} */
                const res = context.getOutData();
                //
                const trx = await conn.startTransaction();
                try {
                    const code = req.code;
                    await actClean({trx});
                    const invite = await selectInvite(trx, code);
                    if (invite) {
                        invite.date_expired = castDate(invite.date_expired);
                        // select WebPush subscription key
                        const {publicKey}= actLoadWebPushKeys();
                        res.webPushKey = publicKey;
                    }
                    await trx.commit();
                } catch (error) {
                    await trx.rollback();
                    throw error;
                }
            }

            // MAIN FUNCTIONALITY
            Object.defineProperty(service, 'name', {value: `${NS}.service`});
            return service;
        }

    }
}
