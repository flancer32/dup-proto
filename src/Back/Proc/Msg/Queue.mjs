/**
 * Receive posted messages from sender, save it to 'Posted Queue', send message to recipient.
 * Receive report from recipient, move message from 'Posted Queue' to 'Delivered Queue' then report about delivery
 * to sender. Get delivery report confirmation from sender and remove message from queue.
 */
export default class Fl32_Dup_Back_Proc_Msg_Queue {
    constructor(spec) {
        // EXTRACT DEPS
        /** @type {Fl32_Dup_Back_Defaults} */
        const DEF = spec['Fl32_Dup_Back_Defaults$'];
        /** @type {TeqFw_Core_Shared_Logger} */
        const logger = spec['TeqFw_Core_Shared_Logger$'];
        /** @type {TeqFw_Web_Back_App_Server_Handler_Event_Reverse_Portal} */
        const portalFront = spec['TeqFw_Web_Back_App_Server_Handler_Event_Reverse_Portal$'];
        /** @type {TeqFw_Core_Back_App_Event_Bus} */
        const eventsBack = spec['TeqFw_Core_Back_App_Event_Bus$'];
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
                const msgKey = queuePosted.add({data, meta});
                const msg = esbConfirmPost.createDto();
                logger.info(`User message is queued as '${msgKey}'.`);
                msg.meta.frontUUID = meta.frontUUID;
                msg.data.messageId = msgKey;
                portalFront.publish(msg);
            }

            /**
             * Try to send message to recipient.
             * @param {Fl32_Dup_Shared_Event_Front_Msg_Post.Dto} data
             * @param {TeqFw_Web_Shared_App_Event_Trans_Message_Meta.Dto} meta
             */
            function transferMessage(data, meta) {
                const msg = esbReceive.createDto();
                msg.data.message = data.message;
                msg.data.recipientId = data.recipientId;
                msg.data.senderId = data.userId;
                // we need to have a registry with user ids and front UUIDs
                msg.meta.frontUUID = '????';
            }

            // MAIN
            queueIncoming();
            transferMessage(data, meta);
        }
    }
}
