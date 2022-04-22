/**
 * Response with newly created invite data.
 */
// MODULE'S VARS
const NS = 'Fl32_Dup_Shared_Event_Back_User_Invite_Create_Response';

// MODULE'S CLASSES
/**
 * @memberOf Fl32_Dup_Shared_Event_Back_User_Invite_Create_Response
 */
class Dto {
    static namespace = NS;
    /**
     * Code to compose sign-up URL.
     * @type {string}
     */
    code;
}

/**
 * @implements TeqFw_Core_Shared_Api_Factory_Dto_IEvent
 */
export default class Fl32_Dup_Shared_Event_Back_User_Invite_Create_Response {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Web_Event_Shared_Dto_Event} */
        const dtoBase = spec['TeqFw_Web_Event_Shared_Dto_Event$'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castString|function} */
        const castString = spec['TeqFw_Core_Shared_Util_Cast.castString'];

        // VARS
        const ATTR = dtoBase.getAttributes();

        // FUNCS
        /**
         * @param {Fl32_Dup_Shared_Event_Back_User_Invite_Create_Response.Dto} [data]
         * @return {Fl32_Dup_Shared_Event_Back_User_Invite_Create_Response.Dto}
         */
        function createData(data) {
            const res = new Dto();
            res.code = castString(data?.code);
            return res;
        }

        // INSTANCE METHODS
        /**
         * @param {{data: Fl32_Dup_Shared_Event_Back_User_Invite_Create_Response.Dto, meta: TeqFw_Web_Event_Shared_Dto_Event_Meta.Dto}} [data]
         * @return {{data: Fl32_Dup_Shared_Event_Back_User_Invite_Create_Response.Dto, meta: TeqFw_Web_Event_Shared_Dto_Event_Meta.Dto}}
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
