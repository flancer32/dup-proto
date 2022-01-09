/**
 * Message is saved by recipient.
 *
 * @namespace Fl32_Dup_Shared_Event_Front_Msg_Confirm_Receive
 */
// MODULE'S IMPORT

// MODULE'S VARS
const NS = 'Fl32_Dup_Shared_Event_Front_Msg_Confirm_Receive';

// MODULE'S CLASSES
/**
 * @memberOf Fl32_Dup_Shared_Event_Front_Msg_Confirm_Receive
 */
class Dto {
    static namespace = `${NS}.Dto`;
}

/**
 * @implements TeqFw_Core_Shared_Api_IEvent
 */
export default class Fl32_Dup_Shared_Event_Front_Msg_Confirm_Receive {
    constructor(spec) {
        // EXTRACT DEPS

        // ENCLOSED VARS

        // MAIN

        // ENCLOSED FUNCTIONS

        // INSTANCE METHODS
        /**
         * @param {Fl32_Dup_Shared_Event_Front_Msg_Confirm_Receive.Dto} [data]
         * @return {Fl32_Dup_Shared_Event_Front_Msg_Confirm_Receive.Dto}
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
