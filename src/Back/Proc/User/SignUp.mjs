/**
 * Register new user in DB.
 */
// MODULE'S IMPORT
import {join} from "path";

// MODULE'S CLASSES
export default class Fl32_Dup_Back_Proc_User_SignUp {
    constructor(spec) {
        // EXTRACT DEPS
        /** @type {Fl32_Dup_Back_Defaults} */
        const DEF = spec['Fl32_Dup_Back_Defaults$'];
        /** @type {TeqFw_Core_Shared_Logger} */
        const logger = spec['TeqFw_Core_Shared_Logger$'];
        /** @type {TeqFw_Core_Back_Config} */
        const config = spec['TeqFw_Core_Back_Config$'];
        /** @type {TeqFw_Core_Back_Util.readJson|function} */
        const readJson = spec['TeqFw_Core_Back_Util.readJson'];
        /** @type {TeqFw_Core_Back_App_UUID} */
        const backUUID = spec['TeqFw_Core_Back_App_UUID$'];
        /** @type {TeqFw_Db_Back_RDb_IConnect} */
        const conn = spec['TeqFw_Db_Back_RDb_IConnect$'];
        /** @type {TeqFw_Web_Back_App_Server_Handler_Event_Queue} */
        const backQueue = spec['TeqFw_Web__Back_App_Server_Handler_Event_Queue$'];
        /** @type {TeqFw_Web_Back_App_Server_Handler_Event_Embassy} */
        const frontEmbassy = spec['TeqFw_Web_Back_App_Server_Handler_Event_Embassy$'];
        /** @type {Fl32_Dup_Shared_Event_Front_User_SignedUp} */
        const esfUserSignedUp = spec['Fl32_Dup_Shared_Event_Front_User_SignedUp$'];
        /** @type {Fl32_Dup_Shared_Event_Back_User_SignUp_Registered} */
        const esbUserRegistered = spec['Fl32_Dup_Shared_Event_Back_User_SignUp_Registered$'];
        /** @type {Fl32_Dup_Back_Act_User_Create.act|function} */
        const actCreate = spec['Fl32_Dup_Back_Act_User_Create$'];
        /** @type {Fl32_Dup_Back_Act_User_Invite_Get.act|function} */
        const actGetInvite = spec['Fl32_Dup_Back_Act_User_Invite_Get$'];
        /** @type {Fl32_Dup_Back_Act_User_Invite_Remove.act|function} */
        const actRemove = spec['Fl32_Dup_Back_Act_User_Invite_Remove$'];

        // DEFINE WORKING VARS / PROPS
        const _publicKey = loadPublicKey();

        // MAIN FUNCTIONALITY
        frontEmbassy.subscribe(esfUserSignedUp.getName(), handler)

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
         * @param {Fl32_Dup_Shared_Event_Front_User_SignedUp.Dto} evt
         */
        async function handler(evt) {
            // MAIN FUNCTIONALITY
            const trx = await conn.startTransaction();
            try {
                /** @type {Fl32_Dup_Back_Store_RDb_Schema_User_Invite.Dto} */
                const invite = (evt?.invite) ? await actGetInvite({trx, code: evt.invite}) : null;
                const parentId = invite ? invite.user_ref : null;
                const {userId} = await actCreate({
                    trx,
                    parentId,
                    nick: evt.nick,
                    keyPub: evt.keyPub,
                    endpoint: evt.endpoint,
                    keyAuth: evt.keyAuth,
                    keyP256dh: evt.keyP256dh,
                });
                if (invite) await actRemove({trx, code: invite.code});
                await trx.commit();
                const payload = esbUserRegistered.createDto();
                payload.userId = userId;
                payload.serverPublicKey = _publicKey;
                // noinspection JSUnresolvedVariable
                backQueue.add(evt.frontUUID, esbUserRegistered.getName(), payload);
            } catch (error) {
                await trx.rollback();
                logger.error(error);
            }
        }
    }
}
