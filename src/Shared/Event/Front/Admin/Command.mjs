/**
 * Admin command for backend.
 */
// MODULE'S VARS
const NS = 'Fl32_Dup_Shared_Event_Front_Admin_Command';
/**
 * @memberOf Fl32_Dup_Shared_Event_Front_Admin_Command
 */
const COMMAND = {
    LOG_DISABLE: 'LOG_DISABLE',
    LOG_ENABLE: 'LOG_ENABLE',
    LOG_STATE: 'LOG_STATE',
}

// MODULE'S CLASSES
/**
 * @memberOf Fl32_Dup_Shared_Event_Front_Admin_Command
 */
class Dto {
    static namespace = NS;
    /** @type {typeof COMMAND} */
    command;
}

/**
 * @implements TeqFw_Core_Shared_Api_Factory_Dto_IEvent
 */
export default class Fl32_Dup_Shared_Event_Front_Admin_Command {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Web_Shared_App_Event_Trans_Message} */
        const dtoBase = spec['TeqFw_Web_Shared_App_Event_Trans_Message$'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castEnum|function} */
        const castEnum = spec['TeqFw_Core_Shared_Util_Cast.castEnum'];

        // VARS
        const ATTR = dtoBase.getAttributes();

        // FUNCS
        /**
         * @param {Fl32_Dup_Shared_Event_Front_Admin_Command.Dto} [data]
         * @return {Fl32_Dup_Shared_Event_Front_Admin_Command.Dto}
         */
        function createData(data) {
            const res = new Dto();
            res.command = castEnum(data?.command, COMMAND, true);
            return res;
        }

        // INSTANCE METHODS
        /**
         * @param {{data: Fl32_Dup_Shared_Event_Front_Admin_Command.Dto, meta: TeqFw_Web_Shared_App_Event_Trans_Message_Meta.Dto}} [data]
         * @return {{data: Fl32_Dup_Shared_Event_Front_Admin_Command.Dto, meta: TeqFw_Web_Shared_App_Event_Trans_Message_Meta.Dto}}
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

export {
    COMMAND
}
