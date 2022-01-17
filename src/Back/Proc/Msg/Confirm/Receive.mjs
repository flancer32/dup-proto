/**
 * Receive report from recipient, move message from 'Posted Queue' to 'Delivered Queue' then report about delivery
 * to sender.
 */
export default class Fl32_Dup_Back_Proc_Msg_Confirm_Receive {
    constructor(spec) {
        // EXTRACT DEPS
        /** @type {TeqFw_Core_Shared_Logger} */
        const logger = spec['TeqFw_Core_Shared_Logger$'];
        /** @type {TeqFw_Web_Back_App_Server_Handler_Event_Reverse_Portal} */
        const portalFront = spec['TeqFw_Web_Back_App_Server_Handler_Event_Reverse_Portal$'];
        /** @type {TeqFw_Core_Back_App_Event_Bus} */
        const eventsBack = spec['TeqFw_Core_Back_App_Event_Bus$'];
        /** @type {TeqFw_Web_Back_App_Server_Handler_Event_Reverse_Registry} */
        const regStreams = spec['TeqFw_Web_Back_App_Server_Handler_Event_Reverse_Registry$'];
        /** @type {TeqFw_User_Back_Mod_Event_Stream_Registry} */
        const regUserStreams = spec['TeqFw_User_Back_Mod_Event_Stream_Registry$'];
        /** @type {Fl32_Dup_Shared_Event_Front_Msg_Confirm_Receive} */
        const esfConfReceive = spec['Fl32_Dup_Shared_Event_Front_Msg_Confirm_Receive$'];
        /** @type {Fl32_Dup_Shared_Event_Back_Msg_Delivery} */
        const esbDelivery = spec['Fl32_Dup_Shared_Event_Back_Msg_Delivery$'];
        /** @type {Fl32_Dup_Back_Mod_Msg_Queue_Posted} */
        const queuePosted = spec['Fl32_Dup_Back_Mod_Msg_Queue_Posted$'];

        // MAIN

        eventsBack.subscribe(esfConfReceive.getEventName(), onMessageReceived)

        // ENCLOSED FUNCTIONS

        /**
         * @param {Fl32_Dup_Shared_Event_Front_Msg_Confirm_Receive.Dto} data
         * @param {TeqFw_Web_Shared_App_Event_Trans_Message_Meta.Dto} meta
         * @return {Promise<void>}
         */
        async function onMessageReceived({data, meta}) {
            // ENCLOSED FUNCTIONS

            // MAIN
            const uuid = data.uuid;
            const posted = queuePosted.get(uuid);
            if (posted) {
                const userId = posted.senderId;
                const streamUUIDs = regUserStreams.getStreams(userId);
                if (streamUUIDs.length === 0)
                    logger.error(`There are no opened event streams for user #${userId}.`);
                for (const one of streamUUIDs) {
                    const frontUUID = regStreams.mapUUIDStreamToFront(one);
                    if (frontUUID) {
                        const event = esbDelivery.createDto();
                        event.meta.frontUUID = frontUUID;
                        event.data.dateDelivered = data.dateDelivery;
                        event.data.uuid = uuid;
                        portalFront.publish(event);
                    } else {
                        regUserStreams.deleteStream(one);
                    }
                }
            }
        }
    }
}
