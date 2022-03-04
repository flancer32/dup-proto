/**
 * Messages loader for person chat.
 */
export default class Fl32_Dup_Front_Mod_Chat_Person {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Web_Front_App_Store_IDB} */
        const idb = spec['Fl32_Dup_Front_Store_Db$'];
        /** @type {Fl32_Dup_Front_Store_Entity_Band} */
        const idbBand = spec['Fl32_Dup_Front_Store_Entity_Band$'];
        /** @type {Fl32_Dup_Front_Store_Entity_Contact} */
        const idbContact = spec['Fl32_Dup_Front_Store_Entity_Contact$'];
        /** @type {Fl32_Dup_Front_Store_Entity_Msg} */
        const idbMsg = spec['Fl32_Dup_Front_Store_Entity_Msg$'];
        /** @type {Fl32_Dup_Front_Rx_Chat_Current} */
        const rxChat = spec['Fl32_Dup_Front_Rx_Chat_Current$'];
        /** @type {Fl32_Dup_Front_Dto_Message} */
        const dtoMsg = spec['Fl32_Dup_Front_Dto_Message$'];
        /** @type {typeof Fl32_Dup_Front_Enum_Msg_Direction} */
        const DIR = spec['Fl32_Dup_Front_Enum_Msg_Direction$'];
        /** @type {Fl32_Dup_Front_Rx_Title} */
        const rxTitle = spec['Fl32_Dup_Front_Rx_Title$'];
        /** @type {Fl32_Dup_Front_Proc_Msg_Read.process|function} */
        const procRead = spec['Fl32_Dup_Front_Proc_Msg_Read$'];
        /** @type {Fl32_Dup_Front_Act_GetFrontIdByBandId.act|function} */
        const actGetFrontIdByBandId = spec['Fl32_Dup_Front_Act_GetFrontIdByBandId$'];

        // VARS
        const I_MSG = idbMsg.getIndexes();

        /**
         * Load messages for chat with $bandId.
         * @param {number|string} bandId
         * @return {Promise<boolean>}
         */
        this.loadBand = async function (bandId) {
            // FUNCS
            /**
             * Remove 'unread' attribute for entity in IDB and send event message to author about chat message reading.
             * @param {IDBTransaction} trx
             * @param {Fl32_Dup_Front_Store_Entity_Msg.Dto} entity
             */
            async function processUnread(trx, entity) {
                delete entity.unread;
                idb.updateOne(trx, idbMsg, entity);
                const {frontBid: authorId} = await actGetFrontIdByBandId({trx, bandId: entity.bandRef});
                if (authorId) procRead({msgUuid: entity.uuid, date: entity.date, authorId});
            }

            // MAIN
            let res = false;
            bandId = parseInt(bandId);
            // validate contact card is in IDB
            const trx = await idb.startTransaction([idbBand, idbContact, idbMsg]);
            const band = await idb.readOne(trx, idbBand, bandId);
            if (bandId) {
                /** @type {Fl32_Dup_Front_Store_Entity_Contact.Dto} */
                const found = await idb.readOne(trx, idbContact, band.contactRef);
                rxChat.setTypeUser();
                // rxChat.setTitle(found.nick);
                rxChat.setBandId(bandId);
                rxTitle.set(found.nick);
                // load keys for messages from IDB
                const index = I_MSG.BY_BAND;
                const backward = true;
                const limit = 20;
                // short-circuited array sorting
                const query = IDBKeyRange.bound([band.id, DIR.IN, new Date(0)], [band.id, DIR.OUT, new Date()]);
                const keys = await idb.readKeys(trx, idbMsg, {index, query, backward, limit});
                // load messages by keys
                const messages = [];
                for (const key of keys) {
                    /** @type {Fl32_Dup_Front_Store_Entity_Msg.Dto} */
                    const one = await idb.readOne(trx, idbMsg, key, I_MSG.BY_BAND);
                    const dto = dtoMsg.createDto();
                    dto.body = one.body;
                    dto.date = one.date;
                    dto.sent = (one.direction === DIR.OUT);
                    dto.state = one.state;
                    dto.uuid = one.uuid;
                    messages.push(dto);
                    if (one.unread) await processUnread(trx, one);
                }
                // sort by date desc
                messages.sort((a, b) => (a.date - b.date));
                rxChat.resetBand(messages);
                res = true;
            }
            trx.commit();
            return res;
        }

    }
}
