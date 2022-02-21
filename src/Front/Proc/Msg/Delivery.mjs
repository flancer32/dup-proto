/**
 * Process delivery report from backend and send confirmation to clean up delivery queue on server.
 * @implements TeqFw_Core_Shared_Api_Event_IProcess
 */
export default class Fl32_Dup_Front_Proc_Msg_Delivery {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Web_Front_App_Event_Bus} */
        const eventsFront = spec['TeqFw_Web_Front_App_Event_Bus$'];
        /** @type {TeqFw_Web_Front_App_Connect_Event_Direct_Portal} */
        const portalBack = spec['TeqFw_Web_Front_App_Connect_Event_Direct_Portal$'];
        /** @type {Fl32_Dup_Shared_Event_Back_Msg_Delivery} */
        const esbDelivered = spec['Fl32_Dup_Shared_Event_Back_Msg_Delivery$'];
        /** @type {Fl32_Dup_Shared_Event_Front_Msg_Confirm_Delivery} */
        const esfConfDelivery = spec['Fl32_Dup_Shared_Event_Front_Msg_Confirm_Delivery$'];
        /** @type {TeqFw_Web_Front_App_Store_IDB} */
        const idb = spec['Fl32_Dup_Front_Store_Db$'];
        /** @type {Fl32_Dup_Front_Store_Entity_Msg} */
        const idbMsgBase = spec['Fl32_Dup_Front_Store_Entity_Msg$'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castDate|function} */
        const castDate = spec['TeqFw_Core_Shared_Util_Cast.castDate'];


        // ENCLOSED VARS
        const I_MSG = idbMsgBase.getIndexes();

        // MAIN
        eventsFront.subscribe(esbDelivered.getEventName(), onDelivery);

        // ENCLOSED FUNCTIONS
        /**
         * @param {Fl32_Dup_Shared_Event_Back_Msg_Delivery.Dto} data
         * @param {TeqFw_Web_Shared_App_Event_Trans_Message_Meta.Dto} meta
         */
        async function onDelivery({data, meta}) {
            // ENCLOSED FUNCTIONS

            // MAIN
            // send confirmation back to server
            const event = new esfConfDelivery.createDto();
            event.data.uuid = data.uuid;
            portalBack.publish(event);
            // update delivery date for message in IDB
            const trx = await idb.startTransaction(idbMsgBase);
            const query = IDBKeyRange.only(data.uuid);
            /** @type {Fl32_Dup_Front_Store_Dto_Msg_Pers_Out.Dto[]} */
            const items = await idb.readSet(trx, idbMsgBase, I_MSG.BY_UUID, query);
            const [first] = items;
            first.dateDelivered = castDate(data.dateDelivered);
            await idb.updateOne(trx, idbMsgBase, first);
            trx.commit();
        }

        // INSTANCE METHODS
        this.init = async function () {}
        this.run = async function ({}) {}
    }
}
