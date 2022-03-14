/**
 * Sender side process to receive reports about chat message reading sent by recipients.
 */
export default class Fl32_Dup_Front_Hand_Msg_Report_Read {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Core_Shared_Api_ILogger} */
        const logger = spec['TeqFw_Core_Shared_Api_ILogger$$']; // instance
        /** @type {TeqFw_Web_Front_App_Event_Bus} */
        const eventsFront = spec['TeqFw_Web_Front_App_Event_Bus$'];
        /** @type {Fl32_Dup_Shared_Event_Back_Msg_Read} */
        const esbRead = spec['Fl32_Dup_Shared_Event_Back_Msg_Read$'];
        /** @type {TeqFw_Web_Front_App_Store_IDB} */
        const idb = spec['Fl32_Dup_Front_Store_Db$'];
        /** @type {Fl32_Dup_Front_Store_Entity_Msg} */
        const idbMsg = spec['Fl32_Dup_Front_Store_Entity_Msg$'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castDate|function} */
        const castDate = spec['TeqFw_Core_Shared_Util_Cast.castDate'];
        /** @type {Fl32_Dup_Front_Widget_Chat_Band} */
        const uiBand = spec['Fl32_Dup_Front_Widget_Chat_Band$'];
        /** @type {typeof Fl32_Dup_Front_Enum_Msg_State} */
        const STATE = spec['Fl32_Dup_Front_Enum_Msg_State$'];

        // VARS
        const I_MSG = idbMsg.getIndexes();

        // MAIN
        logger.setNamespace(this.constructor.name);
        eventsFront.subscribe(esbRead.getEventName(), onEvent);

        // FUNCS
        /**
         * @param {Fl32_Dup_Shared_Event_Back_Msg_Read.Dto} data
         * @param {TeqFw_Web_Shared_App_Event_Trans_Message_Meta.Dto} meta
         */
        async function onEvent({data, meta}) {
            // FUNCS
            /**
             * Update read date and state for message in IDB.
             * @param {string} uuid
             * @param {Date|string} date
             * @return {Promise<void>}
             */
            async function updateIdb(uuid, date) {
                const trx = await idb.startTransaction(idbMsg);
                const query = IDBKeyRange.only(uuid);
                /** @type {Fl32_Dup_Front_Store_Dto_Msg_Pers_Out.Dto[]} */
                const items = await idb.readSet(trx, idbMsg, I_MSG.BY_UUID, query);
                const [first] = items;
                if (first) {
                    first.dateRead = castDate(date);
                    first.state = STATE.READ;
                    delete first.unread;
                    await idb.updateOne(trx, idbMsg, first);
                }
                trx.commit();
            }

            /**
             * Update message state on UI (conversation band).
             * @param uuid
             */
            function updateUi(uuid) {
                /** @type {Fl32_Dup_Front_Ui_Chat_Msg_Band_Item.IUiComp} */
                const uiComp = uiBand.get(uuid);
                if (uiComp) uiComp.setRead();
            }

            // MAIN
            // noinspection ES6MissingAwait
            logger.info(`Read report for chat message #${data.messageUuid} is received.`, meta);
            updateIdb(data.messageUuid, data.dateRead);
            updateUi(data.messageUuid);
        }
    }
}
