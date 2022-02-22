/**
 * Front requested state of the hollow.
 */
// MODULE'S VARS
const NS = 'Fl32_Dup_Shared_Event_Front_Hollow_State_Request';

// MODULE'S CLASSES
/**
 * @memberOf Fl32_Dup_Shared_Event_Front_Hollow_State_Request
 */
class Dto {
    static namespace = NS;
    /**
     * ID of the current front. This should be one only front registered on the back.
     * @type {number}
     */
    frontId;
}

/**
 * @implements TeqFw_Core_Shared_Api_Factory_Dto_IEvent
 */
export default class Fl32_Dup_Shared_Event_Front_Hollow_State_Request {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Web_Shared_App_Event_Trans_Message} */
        const dtoBase = spec['TeqFw_Web_Shared_App_Event_Trans_Message$'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castInt|function} */
        const castInt = spec['TeqFw_Core_Shared_Util_Cast.castInt'];

        // VARS
        const ATTR = dtoBase.getAttributes();

        // FUNCS
        /**
         * @param {Fl32_Dup_Shared_Event_Front_Hollow_State_Request.Dto} [data]
         * @return {Fl32_Dup_Shared_Event_Front_Hollow_State_Request.Dto}
         */
        function createData(data) {
            const res = new Dto();
            res.frontId = castInt(data?.frontId);
            return res;
        }

        // INSTANCE METHODS
        /**
         * @param {{data: Fl32_Dup_Shared_Event_Front_Hollow_State_Request.Dto, meta: TeqFw_Web_Shared_App_Event_Trans_Message_Meta.Dto}} [data]
         * @return {{data: Fl32_Dup_Shared_Event_Front_Hollow_State_Request.Dto, meta: TeqFw_Web_Shared_App_Event_Trans_Message_Meta.Dto}}
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
