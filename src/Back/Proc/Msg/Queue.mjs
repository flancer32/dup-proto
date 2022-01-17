/**
 * Receive posted messages from sender, save it to 'Posted Queue', send message to recipient.
 * Receive report from recipient, move message from 'Posted Queue' to 'Delivered Queue' then report about delivery
 * to sender. Get delivery report confirmation from sender and remove message from queue.
 */
export default class Fl32_Dup_Back_Proc_Msg_Queue {
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
        /** @type {Fl32_Dup_Shared_Event_Front_Msg_Post} */
        const esfMsgPost = spec['Fl32_Dup_Shared_Event_Front_Msg_Post$'];
        /** @type {Fl32_Dup_Shared_Event_Back_Msg_Confirm_Post} */
        const esbConfirmPost = spec['Fl32_Dup_Shared_Event_Back_Msg_Confirm_Post$'];
        /** @type {Fl32_Dup_Shared_Event_Back_Msg_Receive} */
        const esbReceive = spec['Fl32_Dup_Shared_Event_Back_Msg_Receive$'];
        /** @type {Fl32_Dup_Back_Mod_Msg_Queue_Posted} */
        const queuePosted = spec['Fl32_Dup_Back_Mod_Msg_Queue_Posted$'];

        // MAIN

        eventsBack.subscribe(esfMsgPost.getEventName(), onMessagePost)

        // ENCLOSED FUNCTIONS

        /**
         * @param {Fl32_Dup_Shared_Event_Front_Msg_Post.Dto} data
         * @param {TeqFw_Web_Shared_App_Event_Trans_Message_Meta.Dto} meta
         * @return {Promise<void>}
         */
        async function onMessagePost({data, meta}) {
            // ENCLOSED FUNCTIONS
            /**
             * Register incoming message in Posted Queue and send response to sender.
             */
            function queueIncoming() {
                const msgKey = queuePosted.add(data.message);
                const msg = esbConfirmPost.createDto();
                logger.info(`User message is queued as '${msgKey}'.`);
                msg.meta.frontUUID = meta.frontUUID;
                msg.data.messageId = data.message.uuid;
                portalFront.publish(msg);
            }

            /**
             * Try to send message to recipient.
             * @param {Fl32_Dup_Shared_Event_Front_Msg_Post.Dto} data
             * @param {TeqFw_Web_Shared_App_Event_Trans_Message_Meta.Dto} meta
             */
            function transferMessage(data, meta) {
                const post = data.message;
                const userId = post.recipientId;
                const streams = regUserStreams.getStreams(userId);
                if (streams.length === 0)
                    logger.error(`There are no opened event streams for user #${userId}.`);
                for (const one of streams) {
                    const frontUUID = regStreams.mapUUIDStreamToFront(one);
                    if (frontUUID) {
                        const event = esbReceive.createDto();
                        event.meta.frontUUID = frontUUID;
                        event.data.message = post;
                        portalFront.publish(event);
                    }
                }
            }

            // MAIN
            queueIncoming();
            transferMessage(data, meta);
        }
    }
}
