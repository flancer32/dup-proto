/**
 * Check invite and return server keys if invite is valid.
 */
export default class Fl32_Dup_Back_Proc_User_Invite_Validate {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Core_Shared_Api_ILogger} */
        const logger = spec['TeqFw_Core_Shared_Api_ILogger$$']; // instance
        /** @type {TeqFw_Db_Back_RDb_IConnect} */
        const conn = spec['TeqFw_Db_Back_RDb_IConnect$'];
        /** @type {TeqFw_Db_Back_Api_RDb_ICrudEngine} */
        const crud = spec['TeqFw_Db_Back_Api_RDb_ICrudEngine$'];
        /** @type {Fl32_Dup_Back_Store_RDb_Schema_User_Invite} */
        const rdbInvite = spec['Fl32_Dup_Back_Store_RDb_Schema_User_Invite$'];
        /** @type {TeqFw_Web_Auth_Back_RDb_Schema_Front} */
        const rdbFront = spec['TeqFw_Web_Auth_Back_RDb_Schema_Front$'];
        /** @type {TeqFw_Core_Back_Mod_Event_Bus} */
        const eventsBack = spec['TeqFw_Core_Back_Mod_Event_Bus$'];
        /** @type {TeqFw_Web_Event_Back_Mod_Server_Handler_Reverse_Portal} */
        const portalFront = spec['TeqFw_Web_Event_Back_Mod_Server_Handler_Reverse_Portal$'];
        /** @type {Fl32_Dup_Shared_Event_Front_User_Invite_Validate_Request} */
        const esfValidateReq = spec['Fl32_Dup_Shared_Event_Front_User_Invite_Validate_Request$'];
        /** @type {Fl32_Dup_Shared_Event_Back_User_Invite_Validate_Response} */
        const esbValidateRes = spec['Fl32_Dup_Shared_Event_Back_User_Invite_Validate_Response$'];
        /** @type {Fl32_Dup_Back_Act_User_Invite_Clean.act|function} */
        const actClean = spec['Fl32_Dup_Back_Act_User_Invite_Clean$'];

        // VARS
        /** @type {typeof Fl32_Dup_Back_Store_RDb_Schema_User_Invite.ATTR} */
        const A_INVITE = rdbInvite.getAttributes();

        // MAIN
        logger.setNamespace(this.constructor.name);
        eventsBack.subscribe(esfValidateReq.getEventName(), onRequest)

        // FUNCS
        /**
         * @param {Fl32_Dup_Shared_Event_Front_User_Invite_Validate_Request.Dto} data
         * @param {TeqFw_Web_Event_Shared_Dto_Event_Meta.Dto} meta
         */
        async function onRequest({data, meta}) {
            // FUNCS
            /**
             * @param {TeqFw_Db_Back_RDb_ITrans} trx
             * @param {string} code
             * @returns {Promise<Fl32_Dup_Back_Store_RDb_Schema_User_Invite.Dto|null>}
             */
            async function selectInvite(trx, code) {
                const norm = code.trim().toLowerCase();
                return await crud.readOne(trx, rdbInvite, {[A_INVITE.CODE]: norm});
            }

            // MAIN
            const msg = esbValidateRes.createDto(); // response message
            const trx = await conn.startTransaction();
            try {
                const code = data.code;
                await actClean({trx});
                const invite = await selectInvite(trx, code);
                if (invite) {
                    msg.data.parentId = invite.front_ref;
                    msg.data.parentNick = invite.user_nick;
                    /** @type {TeqFw_Web_Auth_Back_RDb_Schema_Front.Dto} */
                    const front = await crud.readOne(trx, rdbFront, invite.front_ref);
                    msg.data.parentPubKey = front.key_pub;
                }
                await trx.commit();
            } catch (error) {
                await trx.rollback();
                logger.error(error);
            }
            // send event message to front
            msg.meta.frontUUID = meta.frontUUID;
            portalFront.publish(msg);
        }
    }
}
