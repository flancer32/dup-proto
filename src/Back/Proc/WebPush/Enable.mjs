/**
 * Enable web push notifications on delayed events re-publish.
 */
export default class Fl32_Dup_Back_Proc_WebPush_Enable {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Core_Shared_Api_ILogger} */
        const logger = spec['TeqFw_Core_Shared_Api_ILogger$$']; // instance
        /** @type {TeqFw_Db_Back_RDb_IConnect} */
        const rdb = spec['TeqFw_Db_Back_RDb_IConnect$'];
        /** @type {TeqFw_Db_Back_Api_RDb_ICrudEngine} */
        const crud = spec['TeqFw_Db_Back_Api_RDb_ICrudEngine$'];
        /** @type {TeqFw_Web_Push_Back_Store_RDb_Schema_Subscript} */
        const rdbSubscription = spec['TeqFw_Web_Push_Back_Store_RDb_Schema_Subscript$'];
        /** @type {TeqFw_Core_Back_App_Event_Bus} */
        const eventsBack = spec['TeqFw_Core_Back_App_Event_Bus$'];
        /** @type {TeqFw_Web_Event_Back_Event_Republish_Delayed} */
        const ebWebPush = spec['TeqFw_Web_Event_Back_Event_Republish_Delayed$'];

        // MAIN
        logger.setNamespace(this.constructor.name);
        eventsBack.subscribe(ebWebPush.getEventName(), onRequest)

        /**
         * @param {TeqFw_Web_Event_Back_Event_Republish_Delayed.Dto} data
         */
        async function onRequest({data}) {
            const trx = await rdb.startTransaction();
            const frontId = data?.frontId;
            try {
                /** @type {TeqFw_Web_Push_Back_Store_RDb_Schema_Subscript.Dto} */
                const found = await crud.readOne(trx, rdbSubscription, frontId);
                if (!!found?.enabled === false) {
                    found.enabled = true;
                    await crud.updateOne(trx, rdbSubscription, found);
                }
                await trx.commit();
            } catch (error) {
                await trx.rollback();
                logger.error(error);
            }
        }
    }
}
