/**
 * Back response on log state request.
 */
// MODULE'S VARS
const NS = 'Fl32_Dup_Shared_Event_Back_Admin_Command_Log_State';

// MODULE'S CLASSES
/**
 * @memberOf Fl32_Dup_Shared_Event_Back_Admin_Command_Log_State
 */
class Dto {
    static namespace = NS;
    /** @type {boolean} */
    enabled;
}

/**
 * @implements TeqFw_Core_Shared_Api_Factory_Dto_IEvent
 */
export default class Fl32_Dup_Shared_Event_Back_Admin_Command_Log_State {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Web_Shared_App_Event_Trans_Message} */
        const dtoBase = spec['TeqFw_Web_Shared_App_Event_Trans_Message$'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castBoolean|function} */
        const castBoolean = spec['TeqFw_Core_Shared_Util_Cast.castBoolean'];

        // VARS
        const ATTR = dtoBase.getAttributes();

        // FUNCS
        /**
         * @param {Fl32_Dup_Shared_Event_Back_Admin_Command_Log_State.Dto} [data]
         * @return {Fl32_Dup_Shared_Event_Back_Admin_Command_Log_State.Dto}
         */
        function createData(data) {
            const res = new Dto();
            res.enabled = castBoolean(data?.enabled);
            return res;
        }

        // INSTANCE METHODS
        /**
         * @param {{data: Fl32_Dup_Shared_Event_Back_Admin_Command_Log_State.Dto, meta: TeqFw_Web_Shared_App_Event_Trans_Message_Meta.Dto}} [data]
         * @return {{data: Fl32_Dup_Shared_Event_Back_Admin_Command_Log_State.Dto, meta: TeqFw_Web_Shared_App_Event_Trans_Message_Meta.Dto}}
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
