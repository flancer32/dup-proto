/**
 * Message with success flag if new user is registered on backend.
 */
// MODULE'S VARS
const NS = 'Fl32_Dup_Shared_Event_Back_User_SignUp_Response';

// MODULE'S CLASSES
/**
 * @memberOf Fl32_Dup_Shared_Event_Back_User_SignUp_Response
 */
class Dto {
    static namespace = NS;
    /** @type {boolean} */
    success;
}

/**
 * @implements TeqFw_Core_Shared_Api_Factory_Dto_IEvent
 */
export default class Fl32_Dup_Shared_Event_Back_User_SignUp_Response {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Web_Event_Shared_Dto_Event} */
        const dtoBase = spec['TeqFw_Web_Event_Shared_Dto_Event$'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castBoolean|function} */
        const castBoolean = spec['TeqFw_Core_Shared_Util_Cast.castBoolean'];

        // VARS
        const ATTR = dtoBase.getAttributes();

        // FUNCS
        /**
         * @param {Fl32_Dup_Shared_Event_Back_User_SignUp_Response.Dto} [data]
         * @return {Fl32_Dup_Shared_Event_Back_User_SignUp_Response.Dto}
         */
        function createData(data) {
            const res = new Dto();
            res.success = castBoolean(data?.success);
            return res;
        }

        // INSTANCE METHODS
        /**
         * @param {{data: Fl32_Dup_Shared_Event_Back_User_SignUp_Response.Dto, meta: TeqFw_Web_Event_Shared_Dto_Event_Meta.Dto}} [data]
         * @return {{data: Fl32_Dup_Shared_Event_Back_User_SignUp_Response.Dto, meta: TeqFw_Web_Event_Shared_Dto_Event_Meta.Dto}}
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
