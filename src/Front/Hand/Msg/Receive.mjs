/**
 * Get incoming messages from backend, process it and send delivery confirmation back.
 */
export default class Fl32_Dup_Front_Hand_Msg_Receive {
    constructor(spec) {
        // DEPS
        /** @type {Fl32_Dup_Front_Defaults} */
        const DEF = spec['Fl32_Dup_Front_Defaults$'];
        /** @type {TeqFw_Core_Shared_Api_ILogger} */
        const logger = spec['TeqFw_Core_Shared_Api_ILogger$$']; // instance
        /** @type {TeqFw_Web_Front_App_Event_Bus} */
        const eventsFront = spec['TeqFw_Web_Front_App_Event_Bus$'];
        /** @type {TeqFw_Web_Front_App_Connect_Event_Direct_Portal} */
        const portalBack = spec['TeqFw_Web_Front_App_Connect_Event_Direct_Portal$'];
        /** @type {Fl32_Dup_Shared_Event_Back_Msg_Post} */
        const esbPost = spec['Fl32_Dup_Shared_Event_Back_Msg_Post$'];
        /** @type {Fl32_Dup_Shared_Event_Front_Msg_Delivery} */
        const esfDelivery = spec['Fl32_Dup_Shared_Event_Front_Msg_Delivery$'];
        /** @type {TeqFw_Web_Shared_Api_Crypto_IScrambler} */
        const scrambler = spec['TeqFw_Web_Shared_Api_Crypto_IScrambler$'];
        /** @type {TeqFw_Web_Api_Front_Mod_App_Front_Identity} */
        const frontIdentity = spec['TeqFw_Web_Api_Front_Mod_App_Front_Identity$'];
        /** @type {TeqFw_Web_Front_App_Store_IDB} */
        const idb = spec['Fl32_Dup_Front_Store_Db$'];
        /** @type {Fl32_Dup_Front_Store_Entity_Contact} */
        const idbCard = spec['Fl32_Dup_Front_Store_Entity_Contact$'];
        /** @type {Fl32_Dup_Front_Store_Entity_Msg} */
        const idbMsg = spec['Fl32_Dup_Front_Store_Entity_Msg$'];
        /** @type {Fl32_Dup_Front_Mod_Msg_Saver} */
        const modMsgSaver = spec['Fl32_Dup_Front_Mod_Msg_Saver$'];
        /** @type {Fl32_Dup_Front_Dto_Message} */
        const dtoMsg = spec['Fl32_Dup_Front_Dto_Message$'];
        /** @type {Fl32_Dup_Front_Rx_Chat_Current} */
        const rxChat = spec['Fl32_Dup_Front_Rx_Chat_Current$'];
        /** @type {Fl32_Dup_Front_Widget_Home_Conversation} */
        const uiHomeConv = spec['Fl32_Dup_Front_Widget_Home_Conversation$'];
        /** @type {Fl32_Dup_Front_Proc_Msg_Read.process|function} */
        const procRead = spec['Fl32_Dup_Front_Proc_Msg_Read$'];
        /** @type {Fl32_Dup_Front_Widget_App} */
        const uiApp = spec['Fl32_Dup_Front_Widget_App$'];

        // VARS
        /** @type {typeof Fl32_Dup_Front_Store_Entity_Contact.INDEX} */
        const I_CONTACT = idbCard.getIndexes();
        /** @type {typeof Fl32_Dup_Front_Store_Entity_Msg.INDEX} */
        const I_MSG = idbMsg.getIndexes();

        // MAIN
        eventsFront.subscribe(esbPost.getEventName(), onEvent);
        logger.setNamespace(this.constructor.name);
        logger.info(`Process ${this.constructor.name} is subscribed to events.`);

        // FUNCS
        /**
         * @param {Fl32_Dup_Shared_Event_Back_Msg_Post.Dto} data
         * @param {TeqFw_Web_Shared_App_Event_Trans_Message_Meta.Dto} meta
         */
        async function onEvent({data, meta}) {
            // FUNCS
            async function getPublicKey(frontBid) {
                const trx = await idb.startTransaction(idbCard, false);
                /** @type {Fl32_Dup_Front_Store_Entity_Contact.Dto} */
                const one = await idb.readOne(trx, idbCard, frontBid, I_CONTACT.BY_BACK_ID);
                await trx.commit();
                return one?.keyPub;
            }

            /**
             * Send delivery report event back.
             * @param messageUuid
             * @param senderId
             */
            function publishDeliveryReport(messageUuid, senderId) {
                const event = new esfDelivery.createDto();
                event.data.dateDelivery = new Date();
                event.data.messageUuid = message.uuid;
                event.data.senderFrontId = senderId;
                portalBack.publish(event);
            }

            /**
             * Add incoming message to current band if acceptable.
             * @param {string} body
             * @param {Date} date
             * @param {string} uuid
             */
            function putToCurrentBand(body, date, uuid) {
                // push message to current band if it is acceptable
                const dto = dtoMsg.createDto();
                dto.body = body;
                dto.date = date;
                dto.sent = false;
                dto.uuid = uuid;
                rxChat.addMessage(dto);
            }

            /**
             * Remove 'unread' attribute for incoming messages if matched band is active.
             * @param uuid
             * @return {Promise<void>}
             */
            async function removeUnread(uuid) {
                const trx = await idb.startTransaction(idbMsg);
                /** @type {Fl32_Dup_Front_Store_Entity_Msg.Dto} */
                const one = await idb.readOne(trx, idbMsg, uuid, I_MSG.BY_UUID);
                if (one.unread) {
                    delete one.unread;
                    await idb.updateOne(trx, idbMsg, one);
                }
                await trx.commit();
            }

            // MAIN
            // decrypt message body
            const message = data.message;
            const senderId = message.senderId;
            const msgUuid = message.uuid;
            logger.info(`Chat message #${msgUuid} is received from front #${senderId}.`, {msgUuid});
            const encrypted = message.payload;
            const publicKey = await getPublicKey(senderId);
            const secretKey = frontIdentity.getSecretKey();
            scrambler.setKeys(publicKey, secretKey);
            const body = scrambler.decryptAndVerify(encrypted);
            // save message to IDB and push to current band (if required)
            if (body) {
                const {id, bandId, date: dateRead} = await modMsgSaver.savePersonalIn({
                    uuid: message.uuid,
                    body,
                    senderId,
                    dateSent: message.dateSent,
                });
                logger.info(`Chat message #${msgUuid} is saved to IDB as #${id}.`, {msgUuid})
                const currentBandId = rxChat.getBandId().value;
                if ((currentBandId === bandId) && (senderId)) {
                    const router = uiApp.getRouter();
                    const current = router.currentRoute._value;
                    if (current?.matched[1]?.path === DEF.ROUTE_CHAT_BAND) {
                        putToCurrentBand(body, dateRead, msgUuid);
                        // mark message as read
                        procRead({msgUuid, date: dateRead, authorId: senderId});
                        // noinspection ES6MissingAwait
                        removeUnread(msgUuid);
                    }
                }
                const homeUi = uiHomeConv.get();
                homeUi?.reload();
            } else {
                logger.error(`Cannot decrypt message body.`, meta);
            }
            // send receive confirmation back to server
            publishDeliveryReport(message.uuid, message.senderId);
        }

    }
}
