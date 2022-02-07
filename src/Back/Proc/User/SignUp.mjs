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
        /** @type {TeqFw_Db_Back_RDb_IConnect} */
        const conn = spec['TeqFw_Db_Back_RDb_IConnect$'];
        /** @type {TeqFw_Db_Back_Api_RDb_ICrudEngine} */
        const crud = spec['TeqFw_Db_Back_Api_RDb_ICrudEngine$'];
        /** @type {TeqFw_Web_Back_App_Server_Handler_Event_Reverse_Portal} */
        const portalFront = spec['TeqFw_Web_Back_App_Server_Handler_Event_Reverse_Portal$'];
        /** @type {TeqFw_Core_Back_App_Event_Bus} */
        const eventsBack = spec['TeqFw_Core_Back_App_Event_Bus$'];
        /** @type {TeqFw_User_Back_Mod_Event_Stream_Registry} */
        const regUserStreams = spec['TeqFw_User_Back_Mod_Event_Stream_Registry$'];
        /** @type {TeqFw_Web_Back_Mod_Event_Reverse_Registry} */
        const regStreams = spec['TeqFw_Web_Back_Mod_Event_Reverse_Registry$'];
        /** @type {Fl32_Dup_Shared_Event_Front_User_SignUp_Request} */
        const esfSignUpReq = spec['Fl32_Dup_Shared_Event_Front_User_SignUp_Request$'];
        /** @type {Fl32_Dup_Shared_Event_Back_User_SignUp_Response} */
        const esbSignUpRes = spec['Fl32_Dup_Shared_Event_Back_User_SignUp_Response$'];
        /** @type {Fl32_Dup_Shared_Event_Back_User_Contact_Add} */
        const esbContactAdd = spec['Fl32_Dup_Shared_Event_Back_User_Contact_Add$'];
        /** @type {Fl32_Dup_Back_Act_User_Create.act|function} */
        const actCreate = spec['Fl32_Dup_Back_Act_User_Create$'];
        /** @type {Fl32_Dup_Back_Act_User_Invite_Get.act|function} */
        const actGetInvite = spec['Fl32_Dup_Back_Act_User_Invite_Get$'];
        /** @type {Fl32_Dup_Back_Act_User_Invite_Remove.act|function} */
        const actRemove = spec['Fl32_Dup_Back_Act_User_Invite_Remove$'];
        /** @type {TeqFw_User_Back_Store_RDb_Schema_User} */
        const metaUser = spec['TeqFw_User_Back_Store_RDb_Schema_User$'];

        // DEFINE WORKING VARS / PROPS
        const _publicKey = loadPublicKey();

        // MAIN FUNCTIONALITY
        eventsBack.subscribe(esfSignUpReq.getEventName(), onRequest)

        // DEFINE INNER FUNCTIONS
        /**
         * Load server's public key from the file
         * @return {string}
         */
        function loadPublicKey() {
            // load key from local file
            const root = config.getBoot().projectRoot;
            const path = join(root, DEF.MOD_USER.FILE_CRYPTO_KEYS);
            const keys = readJson(path);
            return keys?.publicKey;
        }

        /**
         * @param {Fl32_Dup_Shared_Event_Front_User_SignUp_Request.Dto} data
         * @param {TeqFw_Web_Shared_App_Event_Trans_Message_Meta.Dto} meta
         */
        async function onRequest({data, meta}) {
            // ENCLOSED FUNCTIONS

            /**
             * 'true' if there are no users in the hollow yet.
             * @param {TeqFw_Db_Back_RDb_ITrans} trx
             * @return {Promise<boolean>}
             */
            async function isHollowFree(trx) {
                const items = await crud.readSet(trx, metaUser, null, null, null, 1);
                return items.length === 0;
            }

            /**
             * Publish empty message to cancel waiting on the front.
             * @param {string} frontUUID
             * @return {Promise<void>}
             */
            async function publishFail(frontUUID) {
                const msg = esbSignUpRes.createDto();
                msg.meta.frontUUID = frontUUID;
                portalFront.publish(msg);
            }

            /**
             * @param {string} frontUUID
             * @param {number} userId
             * @param {string} pubKey
             * @return {Promise<void>}
             */
            async function publishUserId(frontUUID, userId, pubKey) {
                const msg = esbSignUpRes.createDto();
                msg.meta.frontUUID = frontUUID;
                const payload = msg.data;
                payload.userId = userId;
                payload.serverPublicKey = pubKey;
                portalFront.publish(msg);
            }

            /**
             * Send contact data of the new user to the parent.
             * @param {number} parentId
             * @param {number} userId
             * @param {string} userNick
             * @param {string} userPubKey
             * @return {Promise<void>}
             */
            async function publishContactAdd(parentId, userId, userNick, userPubKey) {
                const streamsUUIDs = regUserStreams.getStreams(parentId);
                if (streamsUUIDs.length === 0)
                    logger.error(`There are no opened event streams for user #${parentId}.`);
                for (const one of streamsUUIDs) {
                    const msg = esbContactAdd.createDto();
                    const frontUUID = regStreams.mapUUIDStreamToFront(one);
                    if (frontUUID) {
                        msg.meta.frontUUID = frontUUID;
                        msg.data.userId = userId;
                        msg.data.userNick = userNick;
                        msg.data.userPubKey = userPubKey;
                        portalFront.publish(msg);
                        logger.info(`New user's data (#${userId}) is send to his parent #${parentId}, front '${frontUUID}'.`);
                    }
                }
            }

            /**
             * Register stream as authenticated user stream.
             * @param userId
             * @param frontUUID
             * @return {Promise<void>}
             */
            async function registerUserStream(userId, frontUUID) {
                const stream = regStreams.getByFrontUUID(frontUUID);
                const streamUUID = stream?.streamId;
                if (streamUUID) regUserStreams.add(userId, streamUUID);
            }

            /**
             * @param {TeqFw_Db_Back_RDb_ITrans} trx
             * @param {Fl32_Dup_Shared_Event_Front_User_SignUp_Request.Dto} data
             * @return {Promise<number>}
             */
            async function signUpFirstUser(trx, data) {
                const {userId} = await actCreate({
                    trx,
                    nick: data.nick,
                    keyPub: data.keyPub,
                    endpoint: data.endpoint,
                    keyAuth: data.keyAuth,
                    keyP256dh: data.keyP256dh,
                });
                return userId;
            }

            async function signUpByInvite(trx, data) {
                let userId, parentId;
                /** @type {Fl32_Dup_Back_Store_RDb_Schema_User_Invite.Dto} */
                const invite = (data?.invite) ? await actGetInvite({trx, code: data.invite}) : null;
                if (invite) {
                    parentId = invite.user_ref;
                    const {userId: newId} = await actCreate({
                        trx,
                        parentId,
                        nick: data.nick,
                        keyPub: data.keyPub,
                        endpoint: data.endpoint,
                        keyAuth: data.keyAuth,
                        keyP256dh: data.keyP256dh,
                    });
                    await actRemove({trx, code: invite.code});
                    userId = newId;
                }
                return [userId, parentId];
            }

            // MAIN
            const trx = await conn.startTransaction();
            try {
                let userId, parentId;
                if (await isHollowFree(trx))
                    userId = await signUpFirstUser(trx, data);
                else
                    [userId, parentId] = await signUpByInvite(trx, data);
                await trx.commit();
                // publish events with results
                if (userId) {
                    // send user ID back to the front
                    publishUserId(meta.frontUUID, userId, _publicKey);
                    // add new user to users stream registry
                    registerUserStream(userId, meta.frontUUID);
                    // send currently created user data to parent to add to contacts
                    if (parentId)
                        publishContactAdd(parentId, userId, data.nick, data.keyPub);
                } else {
                    publishFail(meta.frontUUID);
                }
            } catch (error) {
                await trx.rollback();
                logger.error(error);
                publishFail(meta.frontUUID);
            }
        }
    }
}
