/**
 * Sender side process to receive posted reports from backend.
 * Change chat message state.
 */
export default class Fl32_Dup_Front_Hand_Msg_Report_Sending {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Web_Front_App_Event_Bus} */
        const eventsFront = spec['TeqFw_Web_Front_App_Event_Bus$'];
        /** @type {Fl32_Dup_Shared_Event_Back_Msg_Confirm_Post} */
        const esbConfirm = spec['Fl32_Dup_Shared_Event_Back_Msg_Confirm_Post$'];
        /** @type {TeqFw_Web_Front_App_Store_IDB} */
        const idb = spec['Fl32_Dup_Front_Store_Db$'];
        /** @type {Fl32_Dup_Front_Store_Entity_Msg} */
        const idbMsg = spec['Fl32_Dup_Front_Store_Entity_Msg$'];
        /** @type {Fl32_Dup_Front_Widget_Chat_Band} */
        const uiBand = spec['Fl32_Dup_Front_Widget_Chat_Band$'];
        /** @type {typeof Fl32_Dup_Front_Enum_Msg_State} */
        const STATE = spec['Fl32_Dup_Front_Enum_Msg_State$'];

        // VARS
        const I_MSG = idbMsg.getIndexes();

        // MAIN
        eventsFront.subscribe(esbConfirm.getEventName(), onEvent);

        // FUNCS
        /**
         * @param {Fl32_Dup_Shared_Event_Back_Msg_Confirm_Post.Dto} data
         * @param {TeqFw_Web_Shared_App_Event_Trans_Message_Meta.Dto} meta
         */
        function onEvent({data, meta}) {
            // FUNCS

            /**
             * Update message state in IDB.
             * @param {string} uuid
             * @return {Promise<void>}
             */
            async function updateIdb(uuid) {
                // update delivery date for message in IDB
                const trx = await idb.startTransaction(idbMsg);
                const query = IDBKeyRange.only(uuid);
                /** @type {Fl32_Dup_Front_Store_Dto_Msg_Pers_Out.Dto[]} */
                const items = await idb.readSet(trx, idbMsg, I_MSG.BY_UUID, query);
                const [first] = items;
                if (first) {
                    first.state = STATE.ON_SERVER;
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
                if (uiComp) uiComp.setOnServer();
            }

            // MAIN
            const uuid = data.messageId;
            updateIdb(uuid);
            updateUi(uuid);
        }

    }
}
