/**
 * Message is delivered to recipient.
 *
 * @namespace Fl32_Dup_Shared_Event_Back_Msg_Delivery
 */
// MODULE'S IMPORT

// MODULE'S VARS
const NS = 'Fl32_Dup_Shared_Event_Back_Msg_Delivery';

// MODULE'S CLASSES
/**
 * @memberOf Fl32_Dup_Shared_Event_Back_Msg_Delivery
 */
class Dto {
    static namespace = NS;
}

/**
 * @implements TeqFw_Core_Shared_Api_IEvent
 */
export default class Fl32_Dup_Shared_Event_Back_Msg_Delivery {
    constructor(spec) {
        // EXTRACT DEPS

        // ENCLOSED VARS

        // MAIN

        // ENCLOSED FUNCTIONS

        // INSTANCE METHODS
        /**
         * @param {Fl32_Dup_Shared_Event_Back_Msg_Delivery.Dto} [data]
         * @return {Fl32_Dup_Shared_Event_Back_Msg_Delivery.Dto}
         */
        this.createDto = function (data) {
            const res = new Dto();
            return res;
        }

        this.getName = () => NS;
    }
}

// MODULE'S FUNCTIONS

// MODULE'S MAIN
