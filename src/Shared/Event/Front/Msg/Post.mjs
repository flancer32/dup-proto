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
 * @implements TeqFw_Core_Shared_Api_Factory_Dto_IEvent
 */
export default class Fl32_Dup_Shared_Event_Front_Msg_Post {
    constructor(spec) {
        // EXTRACT DEPS
        /** @type {TeqFw_Web_Shared_App_Event_Trans_Message} */
        const dtoBase = spec['TeqFw_Web_Shared_App_Event_Trans_Message$'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castInt|function} */
        const castInt = spec['TeqFw_Core_Shared_Util_Cast.castInt'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castString|function} */
        const castString = spec['TeqFw_Core_Shared_Util_Cast.castString'];

        // ENCLOSED VARS
        const ATTR = dtoBase.getAttributes();

        // ENCLOSED FUNCTIONS
        /**
         * @param {Fl32_Dup_Shared_Event_Front_Msg_Post.Dto} [data]
         * @return {Fl32_Dup_Shared_Event_Front_Msg_Post.Dto}
         */
        function createData(data) {
            const res = new Dto();
            res.message = castString(data?.message);
            res.recipientId = castInt(data?.recipientId);
            res.userId = castInt(data?.userId);
            return res;
        }

        // INSTANCE METHODS
        /**
         * @param {{data: Fl32_Dup_Shared_Event_Front_Msg_Post.Dto, meta: TeqFw_Web_Shared_App_Event_Trans_Message_Meta.Dto}} [data]
         * @return {{data: Fl32_Dup_Shared_Event_Front_Msg_Post.Dto, meta: TeqFw_Web_Shared_App_Event_Trans_Message_Meta.Dto}}
         */
        this.createDto = function (data) {
            const res = dtoBase.createDto({[ATTR.META]: data?.[ATTR.META]});
            res.meta.name = NS;
            res.data = createData(data?.[ATTR.DATA]);
            // noinspection JSValidateTypes
            return res;
        }

        this.getEventName = () => NS;
    }
}
