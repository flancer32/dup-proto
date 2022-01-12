/**
 * Process to send hollow state to the front.
 */
export default class Fl32_Dup_Back_Proc_Hollow_State_Request {
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
        /** @type {Fl32_Dup_Shared_Event_Front_Hollow_State_Requested} */
        const esfStateRequested = spec['Fl32_Dup_Shared_Event_Front_Hollow_State_Requested$'];
        /** @type {Fl32_Dup_Shared_Event_Back_Hollow_State_Composed} */
        const esbStateComposed = spec['Fl32_Dup_Shared_Event_Back_Hollow_State_Composed$'];
        /** @type {TeqFw_User_Back_Store_RDb_Schema_User} */
        const metaUser = spec['TeqFw_User_Back_Store_RDb_Schema_User$'];

        // MAIN
        eventsBack.subscribe(esfStateRequested.getEventName(), handler)

        // DEFINE INNER FUNCTIONS
        /**
         * @param {Fl32_Dup_Shared_Event_Front_Hollow_State_Requested.Dto} data
         * @param {TeqFw_Web_Shared_App_Event_Trans_Message_Meta.Dto} meta
         */
        async function handler({data, meta}) {
            const trx = await conn.startTransaction();
            try {
                const message = esbStateComposed.createDto();
                const items = await crud.readSet(trx, metaUser, null, null, null, 1);
                message.data.hollowIsFree = (items.length === 0);
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
