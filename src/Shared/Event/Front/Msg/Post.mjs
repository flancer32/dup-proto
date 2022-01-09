/**
 * Message is posted on the sender's front.
 *
 * @namespace Fl32_Dup_Shared_Event_Front_Msg_Post
 */
// MODULE'S VARS
const NS = 'Fl32_Dup_Shared_Event_Front_Msg_Post';

// MODULE'S CLASSES
/**
 * @memberOf Fl32_Dup_Shared_Event_Front_Msg_Post
 */
class Dto {
    static namespace = `${NS}.Dto`;
    /** @type {string} */
    frontUUID;
    /**
     * Message body, encrypted and base64 encoded.
     * @type {string}
     */
    message;
    /** @type {number} */
    recipientId;
    /** @type {number} */
    userId;
}

/**
 * @implements TeqFw_Core_Shared_Api_IEvent
 */
export default class Fl32_Dup_Shared_Event_Front_Msg_Post {
    constructor(spec) {
        // EXTRACT DEPS
        /** @type {TeqFw_Core_Shared_Util_Cast.castInt|function} */
        const castInt = spec['TeqFw_Core_Shared_Util_Cast.castInt'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castString|function} */
        const castString = spec['TeqFw_Core_Shared_Util_Cast.castString'];

        // INSTANCE METHODS
        /**
         * @param {Fl32_Dup_Shared_Event_Front_Msg_Post.Dto} [data]
         * @return {Fl32_Dup_Shared_Event_Front_Msg_Post.Dto}
         */
        this.createDto = function (data) {
            const res = new Dto();
            res.frontUUID = castString(data?.frontUUID);
            res.message = castString(data?.message);
            res.recipientId = castInt(data?.recipientId);
            res.userId = castInt(data?.userId);
            return res;
        }

        this.getName = () => NS;
    }
}
