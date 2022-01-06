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
    /** @type {string} */
    frontUUID;
    /** @type {boolean} */
    hollowIsFree;
}

/**
 * @implements TeqFw_Core_Shared_Api_IEvent
 */
export default class Fl32_Dup_Shared_Event_Back_Hollow_State_Composed {
    constructor(spec) {
        // EXTRACT DEPS
        /** @type {TeqFw_Core_Shared_Util_Cast.castBoolean|function} */
        const castBoolean = spec['TeqFw_Core_Shared_Util_Cast.castBoolean'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castString|function} */
        const castString = spec['TeqFw_Core_Shared_Util_Cast.castString'];

        // DEFINE INSTANCE METHODS

        /**
         * @param {Fl32_Dup_Shared_Event_Back_Hollow_State_Composed.Dto} [data]
         * @return {Fl32_Dup_Shared_Event_Back_Hollow_State_Composed.Dto}
         */
        this.createDto = function (data) {
            const res = new Dto();
            res.frontUUID = castString(data?.frontUUID);
            res.hollowIsFree = castBoolean(data?.hollowIsFree);
            return res;
        }

        this.getName = () => NS;
    }
}
