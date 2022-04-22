/**
 * Send new chat message to recipient as continuation of 'Fl32_Dup_Shared_Event_Front_Msg_Post' event.
 *
 * @namespace Fl32_Dup_Shared_Event_Back_Msg_Post
 */
// MODULE'S VARS
const NS = 'Fl32_Dup_Shared_Event_Back_Msg_Post';

// MODULE'S CLASSES
/**
 * @memberOf Fl32_Dup_Shared_Event_Back_Msg_Post
 */
class Dto {
    static namespace = NS;
    /**
     * Message structure.
     * @type {Fl32_Dup_Shared_Dto_Msg.Dto}
     */
    message;
}

/**
 * @implements TeqFw_Core_Shared_Api_Factory_Dto_IEvent
 */
export default class Fl32_Dup_Shared_Event_Back_Msg_Post {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Web_Event_Shared_Dto_Event} */
        const dtoBase = spec['TeqFw_Web_Event_Shared_Dto_Event$'];
        /** @type {Fl32_Dup_Shared_Dto_Msg} */
        const dtoMsg = spec['Fl32_Dup_Shared_Dto_Msg$'];

        // VARS
        const ATTR = dtoBase.getAttributes();

        // FUNCS
        /**
         * @param {Fl32_Dup_Shared_Event_Back_Msg_Post.Dto} [data]
         * @return {Fl32_Dup_Shared_Event_Back_Msg_Post.Dto}
         */
        function createData(data) {
            const res = new Dto();
            res.message = dtoMsg.createDto(data?.message);
            return res;
        }

        // INSTANCE METHODS
        /**
         * @param {{data: Fl32_Dup_Shared_Event_Back_Msg_Post.Dto, meta: TeqFw_Web_Event_Shared_Dto_Event_Meta.Dto}} [data]
         * @return {{data: Fl32_Dup_Shared_Event_Back_Msg_Post.Dto, meta: TeqFw_Web_Event_Shared_Dto_Event_Meta.Dto}}
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
