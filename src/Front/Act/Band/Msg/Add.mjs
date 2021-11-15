/**
 * Action to add new message to messages band and reflect it on UI and in IDB.
 * @namespace Fl32_Dup_Front_Act_Band_Msg_Add
 */
// MODULE'S VARS
const NS = 'Fl32_Dup_Front_Act_Band_Msg_Add';

export default function (spec) {
    /** @type {TeqFw_Web_Front_Store_IDB} */
    const idb = spec['Fl32_Dup_Front_Store_Db$'];
    /** @type {Fl32_Dup_Front_Store_Entity_Msg} */
    const idbMsg = spec['Fl32_Dup_Front_Store_Entity_Msg$'];
    /** @type {Fl32_Dup_Front_Rx_Chat_Current} */
    const rxChat = spec['Fl32_Dup_Front_Rx_Chat_Current$'];
    /** @type {Fl32_Dup_Front_Dto_Message} */
    const dmMsg = spec['Fl32_Dup_Front_Dto_Message$'];

    /**
     * @return {Promise<void>}
     * @memberOf Fl32_Dup_Front_Act_Band_Msg_Add
     */
    async function act({authorId, bandId, body, date, msgId}) {
        // INNER FUNCTIONS
        async function saveMessage(authorId, bandId, body, date, msgId) {
            const dto = idbMsg.createDto();
            dto.authorId = authorId;
            dto.bandId = bandId;
            dto.body = body;
            dto.date = date;
            dto.msgId = msgId;
            const trx = await idb.startTransaction(idbMsg);
            const pk = await idb.add(trx, idbMsg, dto);
            await trx.commit();
        }

        /**
         * Add message to currently active bundle.
         * @param {string} body
         * @param {Date} date
         * @param {boolean} sent
         */
        function addToBand(body, date, sent) {
            /** @type {Fl32_Dup_Front_Dto_Message.Dto} */
            const dto = dmMsg.createDto();
            dto.body = body;
            dto.date = date;
            dto.sent = sent;
            rxChat.addMessage(dto);
        }

        // MAIN FUNCTIONALITY
        await saveMessage(authorId, bandId, body, date, msgId);
        const currentBand = parseInt(rxChat.getOtherSideId().value);
        if (currentBand === bandId) {
            // TODO: tmp variant to detect 'sent' attr for user band
            const sent = authorId !== bandId;
            addToBand(body, date, sent);
        }
    }

    Object.defineProperty(act, 'name', {value: `${NS}.act`});
    return act;
}
