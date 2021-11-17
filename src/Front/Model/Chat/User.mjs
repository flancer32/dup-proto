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
        /** @type {Fl32_Dup_Front_Store_Entity_Contact_Card} */
        const idbContact = spec['Fl32_Dup_Front_Store_Entity_Contact_Card$'];
        /** @type {Fl32_Dup_Front_Store_Entity_Msg} */
        const idbMsg = spec['Fl32_Dup_Front_Store_Entity_Msg$'];
        /** @type {Fl32_Dup_Front_Rx_Chat_Current} */
        const rxChat = spec['Fl32_Dup_Front_Rx_Chat_Current$'];
        /** @type {Fl32_Dup_Front_Dto_Message} */
        const dtoMsg = spec['Fl32_Dup_Front_Dto_Message$'];

        // WORKING VARS
        /** @type {typeof Fl32_Dup_Front_Store_Entity_Msg.ATTR} */
        const A_MSG = idbMsg.getAttributes();

        /**
         * Load messages for chat with user $userId.
         * @param {number|string} userId
         * @return {Promise<boolean>}
         */
        this.loadBand = async function (userId) {
            let res = false;
            // validate contact card is in IDB
            const trx = await idb.startTransaction(idbContact, false);
            const found = await idb.readOne(trx, idbContact, parseInt(userId));
            if (!found) {
                res = false;
            } else {
                const bandId = found.userId;
                rxChat.setTypeUser();
                rxChat.setTitle(found.nick);
                rxChat.setOtherSideId(bandId);
                // load messages from IDB
                const trx = await idb.startTransaction(idbMsg, false);
                const query = IDBKeyRange.only(bandId);
                /** @type {Fl32_Dup_Front_Store_Entity_Msg.Dto[]} */
                const items = await idb.readSet(trx, idbMsg, A_MSG.BAND_ID, query);
                // sort selected messages by date asc
                items.some((a, b) => {
                    return (a.date - b.date);
                });
                const messages = [];
                for (const item of items) {
                    const dto = dtoMsg.createDto();
                    dto.body = item.body;
                    dto.date = item.date;
                    dto.sent = (item.authorId !== item.bandId);
                    messages.push(dto);
                }
                rxChat.resetBand(messages);
                res = true;
            }
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
            const trxRead = await idb.startTransaction(idbContact, false);
            /** @type {Fl32_Dup_Front_Store_Entity_Contact_Card.Dto} */
            res = await idb.readOne(trxRead, idbContact, parseInt(userId));
            if (!res) {
                rxChat.setTypeUser();
                rxChat.setOtherSideId(null);
                rxChat.setTitle(null);
            }
            return res;
        }
    }
}
