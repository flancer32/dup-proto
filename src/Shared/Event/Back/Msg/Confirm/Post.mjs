/**
 * Posted message is saved to the 'Posted Messages Queue' on the back.
 *
 * @namespace Fl32_Dup_Shared_Event_Back_Msg_Confirm_Post
 */
// MODULE'S VARS
const NS = 'Fl32_Dup_Shared_Event_Back_Msg_Confirm_Post';

// MODULE'S CLASSES
/**
 * @memberOf Fl32_Dup_Shared_Event_Back_Msg_Confirm_Post
 */
class Dto {
    static namespace = NS;
    /** @type {string} */
    messageId;
}

/**
 * @implements TeqFw_Core_Shared_Api_Factory_Dto_IEvent
 */
export default class Fl32_Dup_Shared_Event_Back_Msg_Confirm_Post {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Web_Shared_App_Event_Trans_Message} */
        const dtoBase = spec['TeqFw_Web_Shared_App_Event_Trans_Message$'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castString|function} */
        const castString = spec['TeqFw_Core_Shared_Util_Cast.castString'];

        // VARS
        const ATTR = dtoBase.getAttributes();

        // FUNCS
        /**
         * @param {Fl32_Dup_Shared_Event_Back_Msg_Confirm_Post.Dto} [data]
         * @return {Fl32_Dup_Shared_Event_Back_Msg_Confirm_Post.Dto}
         */
        function createData(data) {
            const res = new Dto();
            res.messageId = castString(data?.messageId);
            return res;
        }

        // INSTANCE METHODS
        /**
         * @param {{data: Fl32_Dup_Shared_Event_Back_Msg_Confirm_Post.Dto, meta: TeqFw_Web_Shared_App_Event_Trans_Message_Meta.Dto}} [data]
         * @return {{data: Fl32_Dup_Shared_Event_Back_Msg_Confirm_Post.Dto, meta: TeqFw_Web_Shared_App_Event_Trans_Message_Meta.Dto}}
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

// MODULE'S FUNCTIONS

// MODULE'S MAIN
