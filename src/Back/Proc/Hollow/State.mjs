/**
 * Process to send hollow state to the front.
 */
export default class Fl32_Dup_Back_Proc_Hollow_State {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Core_Shared_Api_ILogger} */
        const logger = spec['TeqFw_Core_Shared_Api_ILogger$$']; // instance
        /** @type {TeqFw_Db_Back_RDb_IConnect} */
        const conn = spec['TeqFw_Db_Back_RDb_IConnect$'];
        /** @type {TeqFw_Db_Back_Api_RDb_ICrudEngine} */
        const crud = spec['TeqFw_Db_Back_Api_RDb_ICrudEngine$'];
        /** @type {TeqFw_Core_Back_App_Event_Bus} */
        const eventsBack = spec['TeqFw_Core_Back_App_Event_Bus$'];
        /** @type {TeqFw_Web_Back_App_Server_Handler_Event_Reverse_Portal} */
        const portalFront = spec['TeqFw_Web_Back_App_Server_Handler_Event_Reverse_Portal$'];
        /** @type {Fl32_Dup_Shared_Event_Front_Hollow_State_Request} */
        const esfStateRequested = spec['Fl32_Dup_Shared_Event_Front_Hollow_State_Request$'];
        /** @type {Fl32_Dup_Shared_Event_Back_Hollow_State_Response} */
        const esbStateComposed = spec['Fl32_Dup_Shared_Event_Back_Hollow_State_Response$'];
        /** @type {TeqFw_Web_Back_Store_RDb_Schema_Front} */
        const rdbFront = spec['TeqFw_Web_Back_Store_RDb_Schema_Front$'];

        // MAIN
        logger.setNamespace(this.constructor.name);
        eventsBack.subscribe(esfStateRequested.getEventName(), handler)

        // FUNCS
        /**
         * @param {Fl32_Dup_Shared_Event_Front_Hollow_State_Request.Dto} data
         * @param {TeqFw_Web_Shared_App_Event_Trans_Message_Meta.Dto} meta
         */
        async function handler({data, meta}) {
            const trx = await conn.startTransaction();
            try {
                const message = esbStateComposed.createDto();
                /** @type {TeqFw_Web_Back_Store_RDb_Schema_Front.Dto[]} */
                const items = await crud.readSet(trx, rdbFront, null, null, null, 1);
                message.data.hollowIsFree = ((items.length === 1) && (items[0].id === data.frontId));
                message.meta.frontUUID = meta.frontUUID;
                await trx.commit();
                portalFront.publish(message);
            } catch (error) {
                await trx.rollback();
                logger.error(error);
            }
        }
    }
}
