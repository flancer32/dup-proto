/**
 * Back is composed response for hollow state request.
 */
// MODULE'S VARS
const NS = 'Fl32_Dup_Shared_Event_Back_Hollow_State_Composed';

// MODULE'S CLASSES
/**
 * @memberOf Fl32_Dup_Shared_Event_Back_Hollow_State_Composed
 */
class Dto {
    static namespace = `${NS}.Dto`;
    /** @type {boolean} */
    hollowIsFree;
}

/**
 * @implements TeqFw_Core_Shared_Api_Factory_Dto_IEvent
 */
export default class Fl32_Dup_Shared_Event_Back_Hollow_State_Composed {
    constructor(spec) {
        // EXTRACT DEPS
        /** @type {TeqFw_Web_Shared_App_Event_Trans_Message} */
        const dtoBase = spec['TeqFw_Web_Shared_App_Event_Trans_Message$'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castString|function} */
        const castString = spec['TeqFw_Core_Shared_Util_Cast.castString'];

        // ENCLOSED VARS
        const ATTR = dtoBase.getAttributes();

        // ENCLOSED FUNCTIONS
        /**
         * @param {Fl32_Dup_Shared_Event_Back_Hollow_State_Composed.Dto} [data]
         * @return {Fl32_Dup_Shared_Event_Back_Hollow_State_Composed.Dto}
         */
        function createData(data) {
            const res = new Dto();
            res.backUUID = castString(data?.backUUID);
            res.frontUUID = castString(data?.frontUUID);
            res.streamUUID = castString(data?.streamUUID);
            return res;
        }

        // INSTANCE METHODS
        /**
         * @param {{data: Fl32_Dup_Shared_Event_Back_Hollow_State_Composed.Dto, meta: TeqFw_Web_Shared_App_Event_Trans_Message_Meta.Dto}} [data]
         * @return {{data: Fl32_Dup_Shared_Event_Back_Hollow_State_Composed.Dto, meta: TeqFw_Web_Shared_App_Event_Trans_Message_Meta.Dto}}
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
