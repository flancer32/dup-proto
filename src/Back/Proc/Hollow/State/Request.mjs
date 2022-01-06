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
        /** @type {TeqFw_Web_Back_App_Server_Handler_Event_Queue} */
        const backQueue = spec['TeqFw_Web__Back_App_Server_Handler_Event_Queue$'];
        /** @type {TeqFw_Web_Back_App_Server_Handler_Event_Embassy} */
        const frontEmbassy = spec['TeqFw_Web_Back_App_Server_Handler_Event_Embassy$'];
        /** @type {Fl32_Dup_Shared_Event_Front_Hollow_State_Requested} */
        const esfStateRequested = spec['Fl32_Dup_Shared_Event_Front_Hollow_State_Requested$'];
        /** @type {Fl32_Dup_Shared_Event_Back_Hollow_State_Composed} */
        const esbStateComposed = spec['Fl32_Dup_Shared_Event_Back_Hollow_State_Composed$'];
        /** @type {Fl32_Dup_Back_Store_RDb_Schema_User} */
        const metaAppUser = spec['Fl32_Dup_Back_Store_RDb_Schema_User$'];

        // MAIN FUNCTIONALITY
        frontEmbassy.subscribe(esfStateRequested.getName(), handler)

        // DEFINE INNER FUNCTIONS
        /**
         * @param {Fl32_Dup_Shared_Event_Front_Hollow_State_Requested.Dto} evt
         */
        async function handler(evt) {
            const trx = await conn.startTransaction();
            try {
                const payload = esbStateComposed.createDto();
                payload.frontUUID = evt.frontUUID;
                const items = await crud.readSet(trx, metaAppUser, null, null, null, 1);
                payload.hollowIsFree = (items.length === 0);
                backQueue.add(evt.frontUUID, esbStateComposed.getName(), payload);
                await trx.commit();
            } catch (error) {
                await trx.rollback();
                logger.error(error);
            }
        }
    }
}
