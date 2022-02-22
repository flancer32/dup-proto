/**
 * Get incoming messages from backend, process it and send delivery confirmation back.
 * @implements TeqFw_Core_Shared_Api_Event_IProcess
 */
export default class Fl32_Dup_Front_Proc_Msg_Receive {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Core_Shared_Api_ILogger} */
        const logger = spec['TeqFw_Core_Shared_Api_ILogger$$']; // instance
        /** @type {TeqFw_Web_Front_App_Event_Bus} */
        const eventsFront = spec['TeqFw_Web_Front_App_Event_Bus$'];
        /** @type {TeqFw_Web_Front_App_Connect_Event_Direct_Portal} */
        const portalBack = spec['TeqFw_Web_Front_App_Connect_Event_Direct_Portal$'];
        /** @type {Fl32_Dup_Shared_Event_Back_Msg_Receive} */
        const esbReceived = spec['Fl32_Dup_Shared_Event_Back_Msg_Receive$'];
        /** @type {Fl32_Dup_Shared_Event_Front_Msg_Confirm_Receive} */
        const esfConfReceive = spec['Fl32_Dup_Shared_Event_Front_Msg_Confirm_Receive$'];
        /** @type {TeqFw_Web_Shared_Api_Crypto_IScrambler} */
        const scrambler = spec['TeqFw_Web_Shared_Api_Crypto_IScrambler$'];
        /** @type {TeqFw_Web_Front_Mod_App_Front_Identity} */
        const frontIdentity = spec['TeqFw_Web_Front_Mod_App_Front_Identity$'];
        /** @type {TeqFw_Web_Front_App_Store_IDB} */
        const idb = spec['Fl32_Dup_Front_Store_Db$'];
        /** @type {Fl32_Dup_Front_Store_Entity_Contact} */
        const idbCard = spec['Fl32_Dup_Front_Store_Entity_Contact$'];
        /** @type {Fl32_Dup_Front_Mod_Msg_Saver} */
        const modMsgSaver = spec['Fl32_Dup_Front_Mod_Msg_Saver$'];
        /** @type {Fl32_Dup_Front_Dto_Message} */
        const dtoMsg = spec['Fl32_Dup_Front_Dto_Message$'];
        /** @type {Fl32_Dup_Front_Rx_Chat_Current} */
        const rxChat = spec['Fl32_Dup_Front_Rx_Chat_Current$'];

        // ENCLOSED VARS
        /** @type {typeof Fl32_Dup_Front_Store_Entity_Contact.INDEX} */
        const I_CONTACT = idbCard.getIndexes();

        // MAIN
        eventsFront.subscribe(esbReceived.getEventName(), onReceive);
        logger.setNamespace(this.constructor.name);
        logger.info(`Process ${this.constructor.name} is subscribed to events.`);

        // FUNCS
        /**
         * @param {Fl32_Dup_Shared_Event_Back_Msg_Receive.Dto} data
         * @param {TeqFw_Web_Shared_App_Event_Trans_Message_Meta.Dto} meta
         */
        async function onReceive({data, meta}) {
            // FUNCS
            async function getPublicKey(userId) {
                const trx = await idb.startTransaction(idbCard, false);
                /** @type {Fl32_Dup_Front_Store_Entity_Contact.Dto} */
                const one = await idb.readOne(trx, idbCard, userId, I_CONTACT.BY_BACK_ID);
                await trx.commit();
                return one?.keyPub;
            }

            function publishConfirmation(messageUuid, senderId) {
                const event = new esfConfReceive.createDto();
                event.data.dateDelivery = new Date();
                event.data.messageUuid = message.uuid;
                event.data.senderFrontId = senderId;
                portalBack.publish(event);
            }

            // MAIN
            // decrypt message body
            const message = data.message;
            const senderId = message.senderId;
            const msgUuid = message.uuid;
            logger.info(`Chat message #${msgUuid} is received from front #${senderId}.`, {msgUuid});
            const encrypted = message.payload;
            const publicKey = await getPublicKey(message.senderId);
            const secretKey = frontIdentity.getSecretKey();
            scrambler.setKeys(publicKey, secretKey);
            const body = scrambler.decryptAndVerify(encrypted);
            // save message to IDB and push to current band (if required)
            if (body) {
                const {id, bandId, date} = await modMsgSaver.savePersonalIn({
                    uuid: message.uuid,
                    body,
                    senderId: message.senderId,
                    dateSent: message.dateSent,
                });
                logger.info(`Chat message #${msgUuid} is saved to IDB as #${id}.`, {msgUuid})
                const currentBandId = rxChat.getBandId().value;
                if (currentBandId === bandId) {
                    // push message to current band if it is compatible
                    const dto = dtoMsg.createDto();
                    dto.body = body;
                    dto.date = date;
                    dto.sent = false;
                    rxChat.addMessage(dto);
                }
            }
            // send receive confirmation back to server
            publishConfirmation(message.uuid, message.senderId);
        }

        // INSTANCE METHODS
        this.init = async function () {}
        this.run = async function ({}) {}
    }
}
