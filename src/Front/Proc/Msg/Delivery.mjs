/**
 * Process delivery report from backend and change chat message state.
 * @implements TeqFw_Core_Shared_Api_Event_IProcess
 */
export default class Fl32_Dup_Front_Proc_Msg_Delivery {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Web_Front_App_Event_Bus} */
        const eventsFront = spec['TeqFw_Web_Front_App_Event_Bus$'];
        /** @type {Fl32_Dup_Shared_Event_Back_Msg_Delivery} */
        const esbDelivered = spec['Fl32_Dup_Shared_Event_Back_Msg_Delivery$'];
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
        eventsFront.subscribe(esbDelivered.getEventName(), onDelivery);

        // FUNCS
        /**
         * @param {Fl32_Dup_Shared_Event_Back_Msg_Delivery.Dto} data
         * @param {TeqFw_Web_Shared_App_Event_Trans_Message_Meta.Dto} meta
         */
        async function onDelivery({data, meta}) {
            // FUNCS

            // MAIN
            // update delivery date for message in IDB
            const trx = await idb.startTransaction(idbMsg);
            const query = IDBKeyRange.only(data.uuid);
            /** @type {Fl32_Dup_Front_Store_Dto_Msg_Pers_Out.Dto[]} */
            const items = await idb.readSet(trx, idbMsg, I_MSG.BY_UUID, query);
            const [first] = items;
            first.dateDelivered = castDate(data.dateDelivered);
            first.state = STATE.DELIVERED;
            await idb.updateOne(trx, idbMsg, first);
            trx.commit();
        }

        // INSTANCE METHODS
        this.init = async function () {}
        this.run = async function ({}) {}
    }
}
