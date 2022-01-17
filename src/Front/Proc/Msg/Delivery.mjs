/**
 * Process delivery report from backend and send confirmation.
 * @implements TeqFw_Core_Shared_Api_Event_IProcess
 */
export default class Fl32_Dup_Front_Proc_Msg_Delivery {
    constructor(spec) {
        // EXTRACT DEPS
        /** @type {TeqFw_Web_Front_App_Event_Bus} */
        const eventsFront = spec['TeqFw_Web_Front_App_Event_Bus$'];
        /** @type {TeqFw_Web_Front_App_Connect_Event_Direct_Portal} */
        const portalBack = spec['TeqFw_Web_Front_App_Connect_Event_Direct_Portal$'];
        /** @type {Fl32_Dup_Shared_Event_Back_Msg_Delivery} */
        const esbDelivered = spec['Fl32_Dup_Shared_Event_Back_Msg_Delivery$'];
        /** @type {Fl32_Dup_Shared_Event_Front_Msg_Confirm_Delivery} */
        const esfConfDelivery = spec['Fl32_Dup_Shared_Event_Front_Msg_Confirm_Delivery$'];

        // ENCLOSED VARS

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
        }

        // INSTANCE METHODS
        this.init = async function () {}
        this.run = async function ({}) {}
    }
}
