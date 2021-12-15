/**
 * Create new user on the server.
 *
 * @namespace Fl32_Dup_Back_WAPI_User_Create
 */
// MODULE'S IMPORT
import {join} from "path";

// MODULE'S VARS
const NS = 'Fl32_Dup_Back_WAPI_User_Create';

/**
 * @implements TeqFw_Web_Back_Api_WAPI_IFactory
 */
export default class Fl32_Dup_Back_WAPI_User_Create {

    constructor(spec) {
        // EXTRACT DEPS
        /** @type {Fl32_Dup_Back_Defaults} */
        const DEF = spec['Fl32_Dup_Back_Defaults$'];
        /** @type {TeqFw_Core_Back_Config} */
        const config = spec['TeqFw_Core_Back_Config$'];
        /** @type {TeqFw_Core_Back_Util.readJson|function} */
        const readJson = spec['TeqFw_Core_Back_Util.readJson'];
        /** @type {TeqFw_Db_Back_RDb_IConnect} */
        const conn = spec['TeqFw_Db_Back_RDb_IConnect$'];
        /** @type {Fl32_Dup_Shared_WAPI_User_Create.Factory} */
        const route = spec['Fl32_Dup_Shared_WAPI_User_Create#Factory$'];
        /** @type {Fl32_Dup_Back_Act_User_Create.act|function} */
        const actCreate = spec['Fl32_Dup_Back_Act_User_Create$'];
        /** @type {Fl32_Dup_Back_Act_User_Invite_Get.act|function} */
        const actGetInvite = spec['Fl32_Dup_Back_Act_User_Invite_Get$'];
        /** @type {Fl32_Dup_Back_Act_User_Invite_Remove.act|function} */
        const actRemove = spec['Fl32_Dup_Back_Act_User_Invite_Remove$'];

        // DEFINE WORKING VARS / PROPS
        let _publicKey;

        // DEFINE INSTANCE METHODS
        this.getRouteFactory = () => route;

        this.getService = function () {
            // DEFINE INNER FUNCTIONS
            /**
             * Load server's public key from the file
             * @return {string}
             */
            function loadPublicKey() {
                // load key from local file
                const root = config.getBoot().projectRoot;
                const path = join(root, DEF.FILE_CRYPTO_KEYS);
                const keys = readJson(path);
                return keys?.publicKey;
            }

            /**
             * @param {TeqFw_Web_Back_Api_WAPI_Context} context
             * @return Promise<void>
             */
            async function service(context) {
                // DEFINE INNER FUNCTIONS

                // MAIN FUNCTIONALITY
                /** @type {Fl32_Dup_Shared_WAPI_User_Create.Request} */
                const req = context.getInData();
                /** @type {Fl32_Dup_Shared_WAPI_User_Create.Response} */
                const res = context.getOutData();
                //
                const trx = await conn.startTransaction();
                try {
                    /** @type {Fl32_Dup_Back_Store_RDb_Schema_User_Invite.Dto} */
                    const invite = (req?.invite) ? await actGetInvite({trx, code: req.invite}) : null;
                    const parentId = invite ? invite.user_ref : null;
                    const {userId} = await actCreate({
                        trx,
                        parentId,
                        nick: req.nick,
                        keyPub: req.keyPub,
                        endpoint: req.endpoint,
                        keyAuth: req.keyAuth,
                        keyP256dh: req.keyP256dh,
                    });
                    res.userId = userId;
                    res.serverPublicKey = _publicKey;
                    if (invite) await actRemove({trx, code: invite.code});
                    await trx.commit();
                } catch (error) {
                    await trx.rollback();
                    throw error;
                }
            }

            // MAIN FUNCTIONALITY
            _publicKey = loadPublicKey();
            Object.defineProperty(service, 'name', {value: `${NS}.service`});
            return service;
        }

    }
}
