/**
 * Sender side process to receive delivery reports from backend.
 * Change chat message state.
 */
export default class Fl32_Dup_Front_Hand_Msg_Report_Delivery {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Web_Front_App_Event_Bus} */
        const eventsFront = spec['TeqFw_Web_Front_App_Event_Bus$'];
        /** @type {Fl32_Dup_Shared_Event_Back_Msg_Delivery} */
        const esbDelivery = spec['Fl32_Dup_Shared_Event_Back_Msg_Delivery$'];
        /** @type {TeqFw_Web_Front_App_Store_IDB} */
        const idb = spec['Fl32_Dup_Front_Store_Db$'];
        /** @type {Fl32_Dup_Front_Store_Entity_Msg} */
        const idbMsg = spec['Fl32_Dup_Front_Store_Entity_Msg$'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castDate|function} */
        const castDate = spec['TeqFw_Core_Shared_Util_Cast.castDate'];
        /** @type {Fl32_Dup_Front_Ui_Chat_Band} */
        const uiBand = spec['Fl32_Dup_Front_Ui_Chat_Band$'];
        /** @type {typeof Fl32_Dup_Front_Enum_Msg_State} */
        const STATE = spec['Fl32_Dup_Front_Enum_Msg_State$'];

        // VARS
        const I_MSG = idbMsg.getIndexes();

        // MAIN
        eventsFront.subscribe(esbDelivery.getEventName(), onDelivery);

        // FUNCS
        /**
         * @param {Fl32_Dup_Shared_Event_Back_Msg_Delivery.Dto} data
         * @param {TeqFw_Web_Shared_App_Event_Trans_Message_Meta.Dto} meta
         */
        async function onDelivery({data, meta}) {
            // FUNCS
            /**
             * Update delivery date and state for message in IDB.
             * @param {string} uuid
             * @param {Date|string} date
             * @return {Promise<boolean>} 'true' if message state is updated to 'delivered'.
             */
            async function updateIdb(uuid, date) {
                let res = false;
                const trx = await idb.startTransaction(idbMsg);
                const query = IDBKeyRange.only(uuid);
                /** @type {Fl32_Dup_Front_Store_Dto_Msg_Pers_Out.Dto[]} */
                const items = await idb.readSet(trx, idbMsg, I_MSG.BY_UUID, query);
                const [first] = items;
                if (first) {
                    first.dateDelivered = castDate(date);
                    if ((first.state === STATE.ON_SERVER) || (first.state === STATE.NOT_SENT)) {
                        first.state = STATE.DELIVERED;
                        res = true;
                    }
                    await idb.updateOne(trx, idbMsg, first);
                }
                await trx.commit();
                return res;
            }

            /**
             * Update message state on UI (conversation band).
             * @param uuid
             */
            function updateUi(uuid) {
                /** @type {Fl32_Dup_Front_Widget_Chat_Msg_Band_Item.IUiComp} */
                const uiComp = uiBand.get(uuid);
                if (uiComp) uiComp.setDelivered();
            }

            // MAIN
            const updateState = await updateIdb(data.uuid, data.dateDelivered);
            if (updateState) updateUi(data.uuid);
        }
    }
}
