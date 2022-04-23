/**
 * Receive posted messages from sender, save it to 'Posted Queue', send message to recipient.
 * Receive report from recipient, move message from 'Posted Queue' to 'Delivered Queue' then report about delivery
 * to sender. Get delivery report confirmation from sender and remove message from queue.
 */
export default class Fl32_Dup_Back_Proc_Msg_Post {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Core_Shared_Api_ILogger} */
        const logger = spec['TeqFw_Core_Shared_Api_ILogger$$']; // instance
        /** @type {TeqFw_Db_Back_RDb_IConnect} */
        const rdb = spec['TeqFw_Db_Back_RDb_IConnect$'];
        /** @type {TeqFw_Db_Back_Api_RDb_ICrudEngine} */
        const crud = spec['TeqFw_Db_Back_Api_RDb_ICrudEngine$'];
        /** @type {TeqFw_Web_Push_Back_Store_RDb_Schema_Subscript} */
        const rdbSubscript = spec['TeqFw_Web_Push_Back_Store_RDb_Schema_Subscript$'];
        /** @type {TeqFw_Web_Event_Back_Mod_Server_Handler_Reverse_Portal} */
        const portalFront = spec['TeqFw_Web_Event_Back_Mod_Server_Handler_Reverse_Portal$'];
        /** @type {TeqFw_Core_Back_Mod_Event_Bus} */
        const eventsBack = spec['TeqFw_Core_Back_Mod_Event_Bus$'];
        /** @type {Fl32_Dup_Shared_Event_Front_Msg_Post} */
        const esfMsgPost = spec['Fl32_Dup_Shared_Event_Front_Msg_Post$'];
        /** @type {Fl32_Dup_Shared_Event_Back_Msg_Confirm_Post} */
        const esbConfirmPost = spec['Fl32_Dup_Shared_Event_Back_Msg_Confirm_Post$'];
        /** @type {Fl32_Dup_Shared_Event_Back_Msg_Post} */
        const esbSendPost = spec['Fl32_Dup_Shared_Event_Back_Msg_Post$'];
        /** @type {TeqFw_Web_Back_Act_Front_GetUuidById.act|function} */
        const actGetUuidById = spec['TeqFw_Web_Back_Act_Front_GetUuidById$'];
        /** @type {TeqFw_Web_Back_Act_Front_GetIdByUuid.act|function} */
        const actGetIdByUuid = spec['TeqFw_Web_Back_Act_Front_GetIdByUuid$'];
        /** @type {TeqFw_Web_Push_Back_Act_Subscript_SendMsg.act|function} */
        const actPushSend = spec['TeqFw_Web_Push_Back_Act_Subscript_SendMsg$'];

        // MAIN
        eventsBack.subscribe(esfMsgPost.getEventName(), onMessagePost)
        logger.setNamespace(this.constructor.name);

        // FUNCS

        /**
         * @param {Fl32_Dup_Shared_Event_Front_Msg_Post.Dto} data
         * @param {TeqFw_Web_Event_Shared_Dto_Event_Meta.Dto} meta
         * @return {Promise<void>}
         */
        async function onMessagePost({data, meta}) {
            // FUNCS
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
             * Try to send chat message to recipient.
             * @param {Fl32_Dup_Shared_Event_Front_Msg_Post.Dto} data
             * @param {TeqFw_Web_Event_Shared_Dto_Event_Meta.Dto} meta
             */
            async function transferMessage(data, meta) {
                // FUNCS
                /**
                 *  Send WebPush notification for first delayed chat message.
                 *
                 * @param {TeqFw_Db_Back_RDb_ITrans} trx
                 * @param {number} frontId
                 * @return {Promise<void>}
                 */
                async function notifyWebPush(trx, frontId) {
                    /** @type {TeqFw_Web_Push_Back_Store_RDb_Schema_Subscript.Dto} */
                    const subscript = await crud.readOne(trx, rdbSubscript, frontId);
                    if (subscript?.enabled) {
                        const title = 'New message in Dup Chat.';
                        const body = 'New message in Dup Chat.';
                        await actPushSend({trx, title, body, frontId});
                        subscript.enabled = false;
                        await crud.updateOne(trx, rdbSubscript, subscript);
                        logger.info(`Web Push notification for first delayed chat message is sent to front #${frontId}. Web push is disabled for this front.`);
                    }
                }

                // MAIN
                const chatMsg = data.message;
                const msgUuid = chatMsg.uuid;
                const trx = await rdb.startTransaction();
                try {
                    const {id: fromId} = await actGetIdByUuid({trx, uuid: meta.frontUUID});
                    chatMsg.senderId = fromId; // force sender frontId
                    const toId = chatMsg.recipientId;
                    logger.info(`Chat message #${chatMsg.uuid} from #${fromId} to #${toId} is received by back.`, {msgUuid});
                    // get UUID for recipient's front
                    const {uuid: frontUuid} = await actGetUuidById({trx, id: toId});
                    const event = esbSendPost.createDto();
                    event.meta.frontUUID = frontUuid;
                    event.data.message = chatMsg;
                    // noinspection ES6MissingAwait
                    const sent = await portalFront.publish(event);
                    if (sent) logger.info(`Received event for chat message #${chatMsg.uuid} is published for front #${frontUuid}.`, {msgUuid});
                    else await notifyWebPush(trx, toId);
                    await trx.commit();
                } catch (e) {
                    logger.error(`Error in chat message #${msgUuid} processing: ${e.message}`, {msgUuid});
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
