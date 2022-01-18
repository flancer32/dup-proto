/**
 * Get delivery report confirmation from sender and remove message from queue.
 */
export default class Fl32_Dup_Back_Proc_Msg_Confirm_Delivery {
    constructor(spec) {
        // EXTRACT DEPS
        /** @type {TeqFw_Core_Back_App_Event_Bus} */
        const eventsBack = spec['TeqFw_Core_Back_App_Event_Bus$'];
        /** @type {Fl32_Dup_Shared_Event_Front_Msg_Confirm_Delivery} */
        const esfConfDelivery = spec['Fl32_Dup_Shared_Event_Front_Msg_Confirm_Delivery$'];
        /** @type {Fl32_Dup_Back_Mod_Msg_Queue_Delivered} */
        const queDelivered = spec['Fl32_Dup_Back_Mod_Msg_Queue_Delivered$'];

        // MAIN

        eventsBack.subscribe(esfConfDelivery.getEventName(), onConfirm)

        // ENCLOSED FUNCTIONS

        /**
         * @param {Fl32_Dup_Shared_Event_Front_Msg_Confirm_Delivery.Dto} data
         * @param {TeqFw_Web_Shared_App_Event_Trans_Message_Meta.Dto} meta
         * @return {Promise<void>}
         */
        async function onConfirm({data, meta}) {
            const uuid = data.uuid;
            const delivery = queDelivered.get(uuid);
            if (delivery) {
                queDelivered.remove(uuid);
            }
        }
    }
}
