/**
 * Receive delivery report from recipient and transfer this report to chat message author.
 */
export default class Fl32_Dup_Back_Proc_Msg_Delivery {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Core_Shared_Api_ILogger} */
        const logger = spec['TeqFw_Core_Shared_Api_ILogger$$']; // instance
        /** @type {TeqFw_Db_Back_RDb_IConnect} */
        const rdb = spec['TeqFw_Db_Back_RDb_IConnect$'];
        /** @type {TeqFw_Core_Back_Mod_Event_Bus} */
        const eventsBack = spec['TeqFw_Core_Back_Mod_Event_Bus$'];
        /** @type {TeqFw_Web_Event_Back_Mod_Server_Handler_Reverse_Portal} */
        const portalFront = spec['TeqFw_Web_Event_Back_Mod_Server_Handler_Reverse_Portal$'];
        /** @type {Fl32_Dup_Shared_Event_Front_Msg_Delivery} */
        const esfDelivery = spec['Fl32_Dup_Shared_Event_Front_Msg_Delivery$'];
        /** @type {Fl32_Dup_Shared_Event_Back_Msg_Delivery} */
        const esbDelivery = spec['Fl32_Dup_Shared_Event_Back_Msg_Delivery$'];
        /** @type {TeqFw_Web_Back_Act_Front_GetUuidById.act|function} */
        const actGetUuidById = spec['TeqFw_Web_Back_Act_Front_GetUuidById$'];

        // MAIN
        logger.setNamespace(this.constructor.name);
        eventsBack.subscribe(esfDelivery.getEventName(), onMessageReceived)

        // FUNCS

        /**
         * @param {Fl32_Dup_Shared_Event_Front_Msg_Delivery.Dto} data
         * @param {TeqFw_Web_Event_Shared_Dto_Event_Meta.Dto} meta
         * @return {Promise<void>}
         */
        async function onMessageReceived({data, meta}) {
            const uuid = data.messageUuid;
            const trx = await rdb.startTransaction();
            try {
                // get UUID for recipient's front (sender of original message)
                const {uuid: frontUuid} = await actGetUuidById({trx, id: data?.senderFrontId});
                await trx.commit();
                const event = esbDelivery.createDto();
                event.meta.frontUUID = frontUuid;
                event.data.dateDelivered = data.dateDelivery;
                event.data.uuid = uuid;
                // noinspection ES6MissingAwait
                portalFront.publish(event);
            } catch (e) {
                await trx.rollback();
            }
        }
    }
}
