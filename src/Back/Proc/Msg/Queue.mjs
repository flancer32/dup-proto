/**
 * Receive posted messages from sender, save it to 'Posted Queue', send message to recipient.
 * Receive report from recipient, move message from 'Posted Queue' to 'Delivered Queue' then report about delivery
 * to sender. Get delivery report confirmation from sender and remove message from queue.
 */
export default class Fl32_Dup_Back_Proc_Msg_Queue {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Core_Shared_Api_ILogger} */
        const logger = spec['TeqFw_Core_Shared_Api_ILogger$'];
        /** @type {TeqFw_Db_Back_RDb_IConnect} */
        const rdb = spec['TeqFw_Db_Back_RDb_IConnect$'];
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
        /** @type {Fl32_Dup_Back_Event_User_Notify_WebPush} */
        const ebWebPush = spec['Fl32_Dup_Back_Event_User_Notify_WebPush$'];
        /** @type {TeqFw_Web_Back_Act_Front_GetUuidById.act|function} */
        const actGetUuidById = spec['TeqFw_Web_Back_Act_Front_GetUuidById$'];

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
             * Send received report to sender.
             * @param {string} frontUuid
             * @param {string} eventUuid
             */
            function respondReceived(frontUuid, eventUuid) {
                const msg = esbConfirmPost.createDto();
                msg.meta.frontUUID = frontUuid;
                msg.data.messageId = eventUuid;
                portalFront.publish(msg);
            }

            /**
             * Try to send message to recipient.
             * @param {Fl32_Dup_Shared_Event_Front_Msg_Post.Dto} data
             * @param {TeqFw_Web_Shared_App_Event_Trans_Message_Meta.Dto} meta
             */
            async function transferMessage(data, meta) {
                const post = data.message;
                const frontId = post.recipientId;
                const trx = await rdb.startTransaction();
                try {
                    // get UUID for recipient's front
                    const {uuid: frontUuid} = await actGetUuidById({trx, id: frontId});
                    await trx.commit();
                    const event = esbReceive.createDto();
                    event.meta.frontUUID = frontUuid;
                    event.data.message = post;
                    // noinspection ES6MissingAwait
                    portalFront.publish(event);
                } catch (e) {
                    await trx.rollback();
                }
            }

            // MAIN
            respondReceived(meta.frontUUID, data.message.uuid);
            // noinspection ES6MissingAwait
            transferMessage(data, meta);
        }
    }
}
