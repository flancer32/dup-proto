/**
 * User chat model.
 *
 * Access to locally stored data (IDB) and to syncing local data with remote.
 *
 * @namespace Fl32_Dup_Front_Model_Chat_User
 */
export default class Fl32_Dup_Front_Model_Chat_User {
    constructor(spec) {
        // EXTRACT DEPS
        /** @type {TeqFw_Web_Front_Store_IDB} */
        const idb = spec['Fl32_Dup_Front_Store_Db$'];
        /** @type {Fl32_Dup_Front_Store_Entity_Band} */
        const idbBand = spec['Fl32_Dup_Front_Store_Entity_Band$'];
        /** @type {Fl32_Dup_Front_Store_Entity_Contact_Card} */
        const idbContact = spec['Fl32_Dup_Front_Store_Entity_Contact_Card$'];
        /** @type {Fl32_Dup_Front_Store_Entity_Msg_Base} */
        const idbMsg = spec['Fl32_Dup_Front_Store_Entity_Msg_Base$'];
        /** @type {Fl32_Dup_Front_Rx_Chat_Current} */
        const rxChat = spec['Fl32_Dup_Front_Rx_Chat_Current$'];
        /** @type {Fl32_Dup_Front_Dto_Message} */
        const dtoMsg = spec['Fl32_Dup_Front_Dto_Message$'];
        /** @type {typeof Fl32_Dup_Front_Enum_Msg_Type} */
        const TYPE = spec['Fl32_Dup_Front_Enum_Msg_Type$'];

        // ENCLOSED VARS
        const I_BAND = idbBand.getIndexes();
        const I_CONTACT = idbContact.getIndexes();
        const I_MSG = idbMsg.getIndexes();

        /**
         * Load messages for chat with user $userId.
         * @param {number|string} userId
         * @return {Promise<boolean>}
         */
        this.loadBand = async function (userId) {
            // ENCLOSED FUNCTIONS
            /**
             * Lookup for band's local id by user's backend ID.
             * @param {IDBTransaction} trx
             * @param {number} userId
             * @return {Promise<Fl32_Dup_Front_Store_Entity_Band.Dto>}
             */
            async function getBandId(trx, userId) {
                const contact = await idb.readOne(trx, idbContact, userId, I_CONTACT.BY_USER);
                const contactId = contact?.id; // local ID
                const found = await idb.readOne(trx, idbBand, contactId, I_BAND.BY_CONTACT);
                if (found) return found;
                const dto = idbBand.createDto();
                dto.contactRef = contactId;
                const id = await idb.add(trx, idbBand, dto);
                return await idb.readOne(trx, idbBand, id);
            }

            // MAIN
            let res = false;
            userId = parseInt(userId);
            // validate contact card is in IDB
            const trx = await idb.startTransaction([idbBand, idbContact, idbMsg]);
            const band = await getBandId(trx, userId);
            if (band) {
                /** @type {Fl32_Dup_Front_Store_Entity_Contact_Card.Dto} */
                const found = await idb.readOne(trx, idbContact, band.contactRef);
                const contactId = found.id;
                rxChat.setTypeUser();
                rxChat.setTitle(found.nick);
                rxChat.setOtherSideId(contactId);
                // load keys for messages from IDB
                const index = I_MSG.BY_BAND;
                const backward = true;
                const limit = 20;
                const query = IDBKeyRange.bound([contactId, new Date(0)], [contactId, new Date()]);
                const keys = await idb.readKeys(trx, idbMsg, {index, query, backward, limit});
                // load messages by keys
                const messages = [];
                for (const key of keys) {
                    /** @type {Fl32_Dup_Front_Store_Entity_Msg_Base.Dto} */
                    const one = await idb.readOne(trx, idbMsg, key, I_MSG.BY_BAND);
                    const dto = dtoMsg.createDto();
                    dto.body = one.body;
                    dto.date = one.date;
                    dto.sent = (one.type === TYPE.PERS_OUT);
                    messages.push(dto);
                }
                rxChat.resetBand(messages);
                res = true;
            }
            trx.commit();
            return res;
        }

        /**
         * Get user card from IDB cache or load from server.
         * @param {number|string} userId
         * @return {Promise<Fl32_Dup_Front_Store_Entity_Contact_Card.Dto|null>}
         */
        this.getCard = async function (userId) {
            let res;
            // load data from IDB
            const trxRead = await idb.startTransaction([idbContact, idbMsg], false);
            /** @type {Fl32_Dup_Front_Store_Entity_Contact_Card.Dto} */
            res = await idb.readOne(trxRead, idbContact, parseInt(userId), I_CONTACT.BY_USER);
            if (!res) {
                rxChat.setTypeUser();
                rxChat.setOtherSideId(null);
                rxChat.setTitle(null);
            }
            trxRead.commit();
            return res;
        }
    }
}
