/**
 * Bridge to transfer add contacts request between users.
 *
 * @namespace Fl32_Dup_Back_Proc_Contact_Add_Bridge
 */
export default class Fl32_Dup_Back_Proc_Contact_Add_Bridge {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Core_Shared_Api_ILogger} */
        const logger = spec['TeqFw_Core_Shared_Api_ILogger$$']; // instance
        /** @type {TeqFw_Db_Back_RDb_IConnect} */
        const rdb = spec['TeqFw_Db_Back_RDb_IConnect$'];
        /** @type {TeqFw_Web_Event_Back_Mod_Server_Handler_Reverse_Portal} */
        const portalFront = spec['TeqFw_Web_Event_Back_Mod_Server_Handler_Reverse_Portal$'];
        /** @type {TeqFw_Core_Back_Mod_Event_Bus} */
        const eventsBack = spec['TeqFw_Core_Back_Mod_Event_Bus$'];
        /** @type {Fl32_Dup_Shared_Event_Front_Contact_Card_Add_Request} */
        const esfAddReq = spec['Fl32_Dup_Shared_Event_Front_Contact_Card_Add_Request$'];
        /** @type {Fl32_Dup_Shared_Event_Back_User_Contact_Add} */
        const esbAdd = spec['Fl32_Dup_Shared_Event_Back_User_Contact_Add$'];
        /** @type {Fl32_Dup_Back_Act_User_Invite_Remove.act|function} */
        const actRemove = spec['Fl32_Dup_Back_Act_User_Invite_Remove$'];
        /** @type {TeqFw_Web_Back_Act_Front_GetUuidById.act|function} */
        const actGetUuidById = spec['TeqFw_Web_Back_Act_Front_GetUuidById$'];

        // MAIN
        logger.setNamespace(this.constructor.name);
        eventsBack.subscribe(esfAddReq.getEventName(), onRequest)

        // FUNCS
        /**
         * @param {Fl32_Dup_Shared_Event_Front_Contact_Card_Add_Request.Dto} data
         * @param {TeqFw_Web_Event_Shared_Dto_Event_Meta.Dto} meta
         * @return {Promise<void>}
         */
        async function onRequest({data, meta}) {
            const recipientId = data?.recipientId;
            const trx = await rdb.startTransaction();
            try {
                const {uuid: frontUuid} = await actGetUuidById({trx, id: recipientId});
                await actRemove({trx, code: data.inviteCode});
                await trx.commit();
                // send contact card to recipient
                const event = esbAdd.createDto();
                event.meta.frontUUID = frontUuid;
                event.data.userNick = data.nick;
                event.data.userId = data.userId;
                event.data.userPubKey = data.publicKey;
                portalFront.publish(event);
            } catch (error) {
                await trx.rollback();
                logger.error(error);
            }
        }
    }
}
