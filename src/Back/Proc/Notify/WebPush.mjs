/**
 * Notify users about new messages if they are offline.
 */
export default class Fl32_Dup_Back_Proc_Notify_WebPush {
    constructor(spec) {
        // DEPS
        /** @type {Fl32_Dup_Back_Defaults} */
        const DEF = spec['Fl32_Dup_Back_Defaults$'];
        /** @type {TeqFw_Core_Shared_Api_ILogger} */
        const logger = spec['TeqFw_Core_Shared_Api_ILogger$$']; // instance
        /** @type {TeqFw_Db_Back_RDb_IConnect} */
        const conn = spec['TeqFw_Db_Back_RDb_IConnect$'];
        /** @type {Fl32_Dup_Back_Act_Push_Send.act|function} */
        const aSend = spec['Fl32_Dup_Back_Act_Push_Send$'];
        /** @type {TeqFw_Core_Back_App_Event_Bus} */
        const eventsBack = spec['TeqFw_Core_Back_App_Event_Bus$'];
        /** @type {Fl32_Dup_Back_Event_User_Notify_WebPush} */
        const ebWebPush = spec['Fl32_Dup_Back_Event_User_Notify_WebPush$'];

        // ENCLOSED VARS

        // MAIN
        logger.setNamespace(this.constructor.name);
        eventsBack.subscribe(ebWebPush.getEventName(), onRequest)

        /**
         * @param {Fl32_Dup_Back_Event_User_Notify_WebPush.Dto} data
         */
        async function onRequest(data) {
            // ENCLOSED FUNCTIONS

            // MAIN
            const trx = await conn.startTransaction();
            const userId = data?.userId;
            try {
                aSend({trx, userId, body: 'New message!'});
            } catch (error) {
                await trx.rollback();
                logger.error(error);
            }
        }
    }
}
