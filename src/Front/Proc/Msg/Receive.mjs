/**
 * Get incoming messages from backend and send receive confirmation back.
 * @implements TeqFw_Core_Shared_Api_Event_IProcess
 */
export default class Fl32_Dup_Front_Proc_Msg_Receive {
    constructor(spec) {
        // EXTRACT DEPS
        /** @type {TeqFw_Web_Front_App_Event_Bus} */
        const eventsFront = spec['TeqFw_Web_Front_App_Event_Bus$'];
        /** @type {TeqFw_Web_Front_App_Connect_Event_Direct_Portal} */
        const portalBack = spec['TeqFw_Web_Front_App_Connect_Event_Direct_Portal$'];
        /** @type {Fl32_Dup_Shared_Event_Back_Msg_Receive} */
        const esbReceived = spec['Fl32_Dup_Shared_Event_Back_Msg_Receive$'];
        /** @type {Fl32_Dup_Shared_Event_Front_Msg_Confirm_Receive} */
        const esfConfReceive = spec['Fl32_Dup_Shared_Event_Front_Msg_Confirm_Receive$'];
        /** @type {TeqFw_User_Shared_Api_Crypto_IScrambler} */
        const scrambler = spec['TeqFw_User_Shared_Api_Crypto_IScrambler$'];
        /** @type {TeqFw_User_Front_DSource_User} */
        const dsUser = spec['TeqFw_User_Front_DSource_User$'];
        /** @type {TeqFw_Web_Front_Store_IDB} */
        const idb = spec['Fl32_Dup_Front_Store_Db$'];
        /** @type {Fl32_Dup_Front_Store_Entity_Contact_Card} */
        const idbCard = spec['Fl32_Dup_Front_Store_Entity_Contact_Card$'];
        /** @type {Fl32_Dup_Front_Store_Entity_Msg_Base} */
        const idbMsg = spec['Fl32_Dup_Front_Store_Entity_Msg_Base$'];
        /** @type {Fl32_Dup_Front_Model_Msg_Saver} */
        const modMsgSaver = spec['Fl32_Dup_Front_Model_Msg_Saver$'];
        /** @type {Fl32_Dup_Front_Dto_Message} */
        const dtoMsg = spec['Fl32_Dup_Front_Dto_Message$'];
        /** @type {typeof Fl32_Dup_Front_Enum_Msg_Type} */
        const TYPE = spec['Fl32_Dup_Front_Enum_Msg_Type$'];
        /** @type {Fl32_Dup_Front_Rx_Chat_Current} */
        const rxChat = spec['Fl32_Dup_Front_Rx_Chat_Current$'];

        // ENCLOSED VARS
        /** @type {typeof Fl32_Dup_Front_Store_Entity_Contact_Card.INDEX} */
        const I_CONTACT = idbCard.getIndexes();
        /** @type {typeof Fl32_Dup_Front_Store_Entity_Msg_Base.INDEX} */
        const I_MSG = idbMsg.getIndexes();

        // MAIN
        eventsFront.subscribe(esbReceived.getEventName(), onReceive);

        // ENCLOSED FUNCTIONS
        /**
         * @param {Fl32_Dup_Shared_Event_Back_Msg_Receive.Dto} data
         * @param {TeqFw_Web_Shared_App_Event_Trans_Message_Meta.Dto} meta
         */
        async function onReceive({data, meta}) {
            // ENCLOSED FUNCTIONS
            async function getPublicKey(userId) {
                const trx = await idb.startTransaction(idbCard, false);
                /** @type {Fl32_Dup_Front_Store_Entity_Contact_Card.Dto} */
                const one = await idb.readOne(trx, idbCard, userId, I_CONTACT.BY_USER);
                await trx.commit();
                return one?.keyPub;
            }

            // MAIN
            // decrypt message body
            const message = data.message;
            const encrypted = message.payload;
            const publicKey = await getPublicKey(message.senderId);
            const user = await dsUser.get();
            scrambler.setKeys(publicKey, user.keys.secret);
            const body = scrambler.decryptAndVerify(encrypted);
            // save message to IDB and push to current band (if required)
            if (body) {
                const msgId = modMsgSaver.savePersonalIn({
                    uuid: message.uuid,
                    body,
                    senderId: message.senderId,
                    dateSent: message.dateSent,
                });
                // push message to current band
                const trx = await idb.startTransaction([idbMsg]);
                /** @type {Fl32_Dup_Front_Store_Entity_Msg_Base.Dto} */
                const one = await idb.readOne(trx, idbMsg, message.uuid, I_MSG.BY_UUID);
                await trx.commit();
                const dto = dtoMsg.createDto();
                dto.body = one.body;
                dto.date = one.date;
                dto.sent = (one.type === TYPE.PERS_OUT);
                rxChat.addMessage(dto);
            }
            // send receive confirmation back to server
            const event = new esfConfReceive.createDto();
            event.data.dateDelivery = new Date();
            event.data.uuid = message.uuid;
            portalBack.publish(event);
        }

        // INSTANCE METHODS
        this.init = async function () {}
        this.run = async function ({}) {}
    }
}
