/**
 * Posted message is saved to the 'Posted Messages Queue' on the back.
 *
 * @namespace Fl32_Dup_Shared_Event_Back_Msg_Confirm_Post
 */
// MODULE'S IMPORT

// MODULE'S VARS
const NS = 'Fl32_Dup_Shared_Event_Back_Msg_Confirm_Post';

// MODULE'S CLASSES
/**
 * @memberOf Fl32_Dup_Shared_Event_Back_Msg_Confirm_Post
 */
class Dto {
    static namespace = `${NS}.Dto`;
    /** @type {string} */
    messageId;
}

/**
 * @implements TeqFw_Core_Shared_Api_IEvent
 */
export default class Fl32_Dup_Shared_Event_Back_Msg_Confirm_Post {
    constructor(spec) {
        // EXTRACT DEPS
        /** @type {TeqFw_Core_Shared_Util_Cast.castString|function} */
        const castString = spec['TeqFw_Core_Shared_Util_Cast.castString'];
        // ENCLOSED VARS

        // MAIN

        // ENCLOSED FUNCTIONS

        // INSTANCE METHODS
        /**
         * @param {Fl32_Dup_Shared_Event_Back_Msg_Confirm_Post.Dto} [data]
         * @return {Fl32_Dup_Shared_Event_Back_Msg_Confirm_Post.Dto}
         */
        this.createDto = function (data) {
            const res = new Dto();
            res.messageId = castString(data?.messageId);
            return res;
        }

        this.getName = () => NS;
    }
}

// MODULE'S FUNCTIONS

// MODULE'S MAIN
