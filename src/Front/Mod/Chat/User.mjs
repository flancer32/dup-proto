/**
 * User chat model.
 *
 * Access to locally stored data (IDB) and to syncing local data with remote.
 *
 * @namespace Fl32_Dup_Front_Mod_Chat_User
 */
export default class Fl32_Dup_Front_Mod_Chat_User {
    constructor(spec) {
        // EXTRACT DEPS
        /** @type {TeqFw_Web_Front_App_Store_IDB} */
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
        /** @type {Fl32_Dup_Front_Rx_Title} */
        const rxTitle = spec['Fl32_Dup_Front_Rx_Title$'];

        // ENCLOSED VARS
        const I_MSG = idbMsg.getIndexes();

        /**
         * Load messages for chat with $bandId.
         * @param {number|string} bandId
         * @return {Promise<boolean>}
         */
        this.loadBand = async function (bandId) {
            // ENCLOSED FUNCTIONS

            // MAIN
            let res = false;
            bandId = parseInt(bandId);
            // validate contact card is in IDB
            const trx = await idb.startTransaction([idbBand, idbContact, idbMsg]);
            const band = await idb.readOne(trx, idbBand, bandId);
            if (bandId) {
                /** @type {Fl32_Dup_Front_Store_Entity_Contact_Card.Dto} */
                const found = await idb.readOne(trx, idbContact, band.contactRef);
                rxChat.setTypeUser();
                // rxChat.setTitle(found.nick);
                rxChat.setBandId(bandId);
                rxTitle.set(found.nick);
                // load keys for messages from IDB
                const index = I_MSG.BY_BAND;
                const backward = true;
                const limit = 20;
                const query = IDBKeyRange.bound([band.id, new Date(0)], [band.id, new Date()]);
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
         * Get contact card from IDB.
         * @param {number|string} contactId
         * @return {Promise<Fl32_Dup_Front_Store_Entity_Contact_Card.Dto|null>}
         */
        this.getCard = async function (contactId) {
            let res;
            // load data from IDB
            const trxRead = await idb.startTransaction([idbContact, idbMsg], false);
            /** @type {Fl32_Dup_Front_Store_Entity_Contact_Card.Dto} */
            res = await idb.readOne(trxRead, idbContact, parseInt(contactId));
            if (!res) {
                rxChat.setTypeUser();
                rxChat.setBandId(null);
                rxChat.setTitle(null);
            }
            trxRead.commit();
            return res;
        }
    }
}
