/**
 * Register new 'user' in RDB.
 */
export default class Fl32_Dup_Back_Proc_User_SignUp {
    constructor(spec) {
        // EXTRACT DEPS
        /** @type {TeqFw_Core_Shared_Logger} */
        const logger = spec['TeqFw_Core_Shared_Logger$'];
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
        /** @type {TeqFw_Web_Back_Act_Front_GetIdByUUID.act|function} */
        const actGetId = spec['TeqFw_Web_Back_Act_Front_GetIdByUUID$'];
        /** @type {TeqFw_Web_Back_Store_RDb_Schema_Front} */
        const rdbFront = spec['TeqFw_Web_Back_Store_RDb_Schema_Front$'];

        // MAIN
        eventsBack.subscribe(esfSignUpReq.getEventName(), onRequest)

        // ENCLOSED FUNCS

        /**
         * @param {Fl32_Dup_Shared_Event_Front_User_SignUp_Request.Dto} data
         * @param {TeqFw_Web_Shared_App_Event_Trans_Message_Meta.Dto} meta
         */
        async function onRequest({data, meta}) {
            // ENCLOSED FUNCS

            /**
             * 'true' if there are no users in the hollow yet.
             * @param {TeqFw_Db_Back_RDb_ITrans} trx
             * @param {string} frontUUID
             * @return {Promise<boolean>}
             */
            async function isHollowFree(trx, frontUUID) {
                /** @type {TeqFw_Web_Back_Store_RDb_Schema_Front.Dto[]} */
                const items = await crud.readSet(trx, rdbFront, null, null, null, 1);
                return ((items.length === 1) && (items[0].uuid === frontUUID));

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
             * Success event if user is registered.
             * @param {string} frontUUID
             * @return {Promise<void>}
             */
            async function publishSuccess(frontUUID) {
                const event = esbSignUpRes.createDto();
                event.meta.frontUUID = frontUUID;
                event.data.success = true;
                portalFront.publish(event);
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
             * Add the first user to users tree (without parent).
             * @param {TeqFw_Db_Back_RDb_ITrans} trx
             * @param {number} frontId front ID from RDB
             * @return {Promise<boolean>}
             */
            async function signUpFirstUser(trx, frontId) {
                const {success} = await actCreate({trx, frontId});
                return success;
            }

            /**
             * Get parent data by invite and add new user to users tree.
             * @param {TeqFw_Db_Back_RDb_ITrans} trx
             * @param {number} frontId front ID from RDB
             * @param {string} invite invitation code
             * @return {Promise<number>} parentId if invite is valid and user is added to the hollow.
             */
            async function signUpByInvite(trx, frontId, invite) {
                let parentId;
                /** @type {Fl32_Dup_Back_Store_RDb_Schema_User_Invite.Dto} */
                const inviteData = await actGetInvite({trx, code: invite});
                if (inviteData) {
                    parentId = inviteData.front_ref;
                    await actCreate({trx, frontId, parentId});
                    await actRemove({trx, code: inviteData.code});
                }
                return parentId;
            }

            // MAIN
            const uuid = meta.frontUUID;
            const trx = await conn.startTransaction();
            try {
                let parentId;
                const {id: frontId} = await actGetId({trx, uuid});
                if (frontId) {
                    if (await isHollowFree(trx, uuid))
                        await signUpFirstUser(trx, frontId);
                    else
                        parentId = await signUpByInvite(trx, frontId, data.invite);
                    await trx.commit();
                    // publish events with results
                    publishSuccess(uuid);
                    // send currently created user data to parent to add to contacts
                    if (parentId)
                        publishContactAdd(parentId, frontId, data.nick, data.keyPub);
                } else {
                    publishFail(uuid);
                }
            } catch (error) {
                await trx.rollback();
                logger.error(error);
                publishFail(uuid);
            }
        }
    }
}
