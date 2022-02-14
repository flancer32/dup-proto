/**
 * Receive report from recipient, move message from 'Posted Queue' to 'Delivered Queue' then report about delivery
 * to sender.
 */
export default class Fl32_Dup_Back_Proc_Msg_Confirm_Receive {
    constructor(spec) {
        // EXTRACT DEPS
        /** @type {TeqFw_Core_Shared_Api_ILogger} */
        const logger = spec['TeqFw_Core_Shared_Api_ILogger$'];
        /** @type {TeqFw_Db_Back_RDb_IConnect} */
        const rdb = spec['TeqFw_Db_Back_RDb_IConnect$'];
        /** @type {TeqFw_Core_Back_App_Event_Bus} */
        const eventsBack = spec['TeqFw_Core_Back_App_Event_Bus$'];
        /** @type {TeqFw_Web_Back_App_Server_Handler_Event_Reverse_Portal} */
        const portalFront = spec['TeqFw_Web_Back_App_Server_Handler_Event_Reverse_Portal$'];
        /** @type {Fl32_Dup_Shared_Event_Front_Msg_Confirm_Receive} */
        const esfConfReceive = spec['Fl32_Dup_Shared_Event_Front_Msg_Confirm_Receive$'];
        /** @type {Fl32_Dup_Shared_Event_Back_Msg_Delivery} */
        const esbDelivery = spec['Fl32_Dup_Shared_Event_Back_Msg_Delivery$'];
        /** @type {TeqFw_Web_Back_Act_Front_GetUuidById.act|function} */
        const actGetUuidById = spec['TeqFw_Web_Back_Act_Front_GetUuidById$'];

        // MAIN

        eventsBack.subscribe(esfConfReceive.getEventName(), onMessageReceived)

        // ENCLOSED FUNCTIONS

        /**
         * @param {Fl32_Dup_Shared_Event_Front_Msg_Confirm_Receive.Dto} data
         * @param {TeqFw_Web_Shared_App_Event_Trans_Message_Meta.Dto} meta
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
