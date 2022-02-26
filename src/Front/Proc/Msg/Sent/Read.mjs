/**
 * Sender side process to receive reports about chat message reading sent by recipients.
 */
export default class Fl32_Dup_Front_Proc_Msg_Sent_Read {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Web_Front_App_Event_Bus} */
        const eventsFront = spec['TeqFw_Web_Front_App_Event_Bus$'];
        /** @type {Fl32_Dup_Shared_Event_Back_Msg_Send_Read} */
        const esbRead = spec['Fl32_Dup_Shared_Event_Back_Msg_Send_Read$'];
        /** @type {TeqFw_Web_Front_App_Store_IDB} */
        const idb = spec['Fl32_Dup_Front_Store_Db$'];
        /** @type {Fl32_Dup_Front_Store_Entity_Msg} */
        const idbMsg = spec['Fl32_Dup_Front_Store_Entity_Msg$'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castDate|function} */
        const castDate = spec['TeqFw_Core_Shared_Util_Cast.castDate'];
        /** @type {typeof Fl32_Dup_Front_Enum_Msg_State} */
        const STATE = spec['Fl32_Dup_Front_Enum_Msg_State$'];

        // VARS
        const I_MSG = idbMsg.getIndexes();

        // MAIN
        eventsFront.subscribe(esbRead.getEventName(), onEvent);

        // FUNCS
        /**
         * @param {Fl32_Dup_Shared_Event_Back_Msg_Send_Read.Dto} data
         * @param {TeqFw_Web_Shared_App_Event_Trans_Message_Meta.Dto} meta
         */
        async function onEvent({data, meta}) {
            // FUNCS

            // MAIN
            // update unread status for chat message in IDB
            const trx = await idb.startTransaction(idbMsg);
            const query = IDBKeyRange.only(data.messageUuid);
            /** @type {Fl32_Dup_Front_Store_Dto_Msg_Pers_Out.Dto[]} */
            const items = await idb.readSet(trx, idbMsg, I_MSG.BY_UUID, query);
            const [first] = items;
            first.dateRead = castDate(data.dateRead);
            first.state = STATE.READ;
            delete first.unread;
            await idb.updateOne(trx, idbMsg, first);
            trx.commit();
        }
    }
}
