/**
 * Create new invitation code to add users to the hollow.
 */
export default class Fl32_Dup_Back_Proc_User_Invite_Create {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Core_Shared_Api_ILogger} */
        const logger = spec['TeqFw_Core_Shared_Api_ILogger$$']; // instance
        /** @type {TeqFw_Db_Back_RDb_IConnect} */
        const conn = spec['TeqFw_Db_Back_RDb_IConnect$'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castDate|function} */
        const castDate = spec['TeqFw_Core_Shared_Util_Cast.castDate'];
        /** @type {TeqFw_Core_Back_App_Event_Bus} */
        const eventsBack = spec['TeqFw_Core_Back_App_Event_Bus$'];
        /** @type {TeqFw_Web_Back_App_Server_Handler_Event_Reverse_Portal} */
        const portalFront = spec['TeqFw_Web_Back_App_Server_Handler_Event_Reverse_Portal$'];
        /** @type {Fl32_Dup_Back_Act_User_Invite_Create.act|function} */
        const actCreate = spec['Fl32_Dup_Back_Act_User_Invite_Create$'];
        /** @type {Fl32_Dup_Shared_Event_Front_User_Invite_Create_Request} */
        const esfCreateReq = spec['Fl32_Dup_Shared_Event_Front_User_Invite_Create_Request$'];
        /** @type {Fl32_Dup_Shared_Event_Back_User_Invite_Create_Response} */
        const esbCreateRes = spec['Fl32_Dup_Shared_Event_Back_User_Invite_Create_Response$'];

        // MAIN
        logger.setNamespace(this.constructor.name);
        eventsBack.subscribe(esfCreateReq.getEventName(), onRequest)

        // ENCLOSED FUNCTIONS
        /**
         * @param {Fl32_Dup_Shared_Event_Front_User_Invite_Create_Request.Dto} data
         * @param {TeqFw_Web_Shared_App_Event_Trans_Message_Meta.Dto} meta
         */
        async function onRequest({data, meta}) {
            const trx = await conn.startTransaction();
            try {
                const userId = data.userId;
                const userNick= data.userNick;
                const onetime = data.onetime;
                const dateExpired = castDate(data.dateExpired);
                const {code} = await actCreate({trx, userId, userNick, onetime, dateExpired});
                await trx.commit();
                // send response back to front
                const msg = esbCreateRes.createDto();
                msg.meta.frontUUID = meta.frontUUID;
                msg.data.code = code;
                portalFront.publish(msg);
            } catch (error) {
                await trx.rollback();
                logger.error(error);
            }
        }
    }
}
