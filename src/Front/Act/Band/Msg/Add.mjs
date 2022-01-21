/**
 * Action to add new message to message band and reflect it on UI and in IDB.
 * @namespace Fl32_Dup_Front_Act_Band_Msg_Add
 */
// MODULE'S VARS
const NS = 'Fl32_Dup_Front_Act_Band_Msg_Add';

export default function (spec) {
    /** @type {TeqFw_Web_Front_Store_IDB} */
    const idb = spec['Fl32_Dup_Front_Store_Db$'];
    /** @type {Fl32_Dup_Front_Store_Entity_Msg} */
    const idbMsg = spec['Fl32_Dup_Front_Store_Entity_Msg$'];
    /** @type {Fl32_Dup_Front_Store_Entity_Msg_Base} */
    const idbMsgBase = spec['Fl32_Dup_Front_Store_Entity_Msg_Base$'];
    /** @type {Fl32_Dup_Front_Store_Dto_Msg_Pers_Out} */
    const dtoPersOut = spec['Fl32_Dup_Front_Store_Dto_Msg_Pers_Out$'];
    /** @type {Fl32_Dup_Front_Store_Dto_Msg_Pers_In} */
    const dtoPersIn = spec['Fl32_Dup_Front_Store_Dto_Msg_Pers_In$'];
    /** @type {Fl32_Dup_Front_Rx_Chat_Current} */
    const rxChat = spec['Fl32_Dup_Front_Rx_Chat_Current$'];
    /** @type {Fl32_Dup_Front_Dto_Message} */
    const dmMsg = spec['Fl32_Dup_Front_Dto_Message$'];
    /** @type {typeof Fl32_Dup_Front_Enum_Msg_Type} */
    const TYPE = spec['Fl32_Dup_Front_Enum_Msg_Type$'];

    /**
     * @return {Promise<void>}
     * @memberOf Fl32_Dup_Front_Act_Band_Msg_Add
     */
    async function act({authorId, bandId, body, date, uuid, type}) {
        // INNER FUNCTIONS
        async function saveMessage(authorId, bandId, body, date, uuid) {
            const dto = idbMsg.createDto();
            dto.authorId = authorId;
            dto.bandId = bandId;
            dto.body = body;
            dto.date = date;
            dto.uuid = uuid;
            const trx = await idb.startTransaction([idbMsg, idbMsgBase]);
            await idb.add(trx, idbMsg, dto);
            // NEW FORMAT

            let dtoNew;
            if (type === TYPE.PERS_OUT) {
                dtoNew = dtoPersOut.createDto();
                dtoNew.type = TYPE.PERS_OUT;
                dtoNew.recipientId = bandId;
            } else if (type === TYPE.PERS_IN) {
                dtoNew = dtoPersIn.createDto();
                dtoNew.type = TYPE.PERS_IN;
                dtoNew.senderId = bandId;
            } else {
                dtoNew = idbMsgBase.createDto();
            }
            dtoNew.body = body;
            dtoNew.date = new Date();
            dtoNew.uuid = uuid;
            const id = await idb.add(trx, idbMsgBase, dtoNew);
            console.log(`new message id: ${id}.`);
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
            if (!sent && navigator.vibrate) navigator.vibrate(150);
            rxChat.addMessage(dto);
        }

        // MAIN FUNCTIONALITY
        await saveMessage(authorId, bandId, body, date, uuid);
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
