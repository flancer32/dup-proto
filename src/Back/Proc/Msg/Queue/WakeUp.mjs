/**
 * Check messages queues on users authentication and try to re-send delayed messages.
 */
export default class Fl32_Dup_Back_Proc_Msg_Queue_WakeUp {
    constructor(spec) {
        // EXTRACT DEPS
        /** @type {TeqFw_Web_Back_App_Server_Handler_Event_Reverse_Registry} */
        const regStreams = spec['TeqFw_Web_Back_App_Server_Handler_Event_Reverse_Registry$'];
        /** @type {TeqFw_User_Back_Mod_Event_Stream_Registry} */
        const regUserStreams = spec['TeqFw_User_Back_Mod_Event_Stream_Registry$'];
        /** @type {TeqFw_Core_Back_App_Event_Bus} */
        const eventsBack = spec['TeqFw_Core_Back_App_Event_Bus$'];
        /** @type {TeqFw_Web_Back_App_Server_Handler_Event_Reverse_Portal} */
        const portalFront = spec['TeqFw_Web_Back_App_Server_Handler_Event_Reverse_Portal$'];
        /** @type {Fl32_Dup_Shared_Event_Back_Msg_Delivery} */
        const esbDelivery = spec['Fl32_Dup_Shared_Event_Back_Msg_Delivery$'];
        /** @type {Fl32_Dup_Shared_Event_Back_Msg_Receive} */
        const esbReceive = spec['Fl32_Dup_Shared_Event_Back_Msg_Receive$'];
        /** @type {TeqFw_User_Back_Event_Authenticated} */
        const ebAuthenticated = spec['TeqFw_User_Back_Event_Authenticated$'];
        /** @type {Fl32_Dup_Back_Mod_Msg_Queue_Posted} */
        const quePosted = spec['Fl32_Dup_Back_Mod_Msg_Queue_Posted$'];
        /** @type {Fl32_Dup_Back_Mod_Msg_Queue_Delivered} */
        const queDelivered = spec['Fl32_Dup_Back_Mod_Msg_Queue_Delivered$'];

        // MAIN

        eventsBack.subscribe(ebAuthenticated.getEventName(), onAuth)

        // ENCLOSED FUNCTIONS

        /**
         * @param {TeqFw_User_Back_Event_Authenticated.Dto} data
         * @param {TeqFw_Core_Shared_App_Event_Message_Meta.Dto} meta
         * @return {Promise<void>}
         */
        async function onAuth({data, meta}) {
            // ENCLOSED FUNCTIONS

            /**
             * Send delayed delivery reports to message senders.
             * @param {number} userId
             */
            function processDeliveryQueue(userId) {
                const streamUUIDs = regUserStreams.getStreams(userId);
                if (streamUUIDs.length) {
                    const uuids = queDelivered.getUuidsForUser(userId);
                    for (const streamUUID of streamUUIDs) {
                        const frontUUID = regStreams.mapUUIDStreamToFront(streamUUID);
                        if (frontUUID) {
                            for (const uuid of uuids) {
                                const report = queDelivered.get(uuid);
                                if (report) {
                                    const event = esbDelivery.createDto();
                                    event.meta.frontUUID = frontUUID;
                                    event.data.dateDelivered = report.dateDelivered;
                                    event.data.uuid = uuid;
                                    portalFront.publish(event);
                                }
                            }
                        } else {
                            regUserStreams.deleteStream(streamUUID);
                        }
                    }
                }
            }

            /**
             * Send delayed messages to recipients.
             * @param {number} userId
             */
            function processPostQueue(userId) {
                const streamUUIDs = regUserStreams.getStreams(userId);
                if (streamUUIDs.length) {
                    const uuids = quePosted.getUuidsForUser(userId);
                    for (const streamUUID of streamUUIDs) {
                        const frontUUID = regStreams.mapUUIDStreamToFront(streamUUID);
                        if (frontUUID) {
                            for (const uuid of uuids) {
                                const post = quePosted.get(uuid);
                                if (post) {
                                    const event = esbReceive.createDto();
                                    event.meta.frontUUID = frontUUID;
                                    event.data.message = post;
                                    portalFront.publish(event);
                                }
                            }
                        } else {
                            regUserStreams.deleteStream(streamUUID);
                        }
                    }
                }
            }

            // MAIN
            const userId = data.userId;
            processPostQueue(userId);
            processDeliveryQueue(userId);
        }
    }
}
