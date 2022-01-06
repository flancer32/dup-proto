/**
 * Front requested state of the hollow.
 */
// MODULE'S VARS
const NS = 'Fl32_Dup_Shared_Event_Front_Hollow_State_Requested';

// MODULE'S CLASSES
/**
 * @memberOf Fl32_Dup_Shared_Event_Front_Hollow_State_Requested
 */
class Dto {
    static namespace = `${NS}.Dto`;
    frontUUID;
}

/**
 * @implements TeqFw_Core_Shared_Api_IEvent
 */
export default class Fl32_Dup_Shared_Event_Front_Hollow_State_Requested {
    constructor(spec) {
        // EXTRACT DEPS
        /** @type {TeqFw_Core_Shared_Util_Cast.castString|function} */
        const castString = spec['TeqFw_Core_Shared_Util_Cast.castString'];

        // DEFINE INSTANCE METHODS

        /**
         * @param {Fl32_Dup_Shared_Event_Front_Hollow_State_Requested.Dto} [data]
         * @return {Fl32_Dup_Shared_Event_Front_Hollow_State_Requested.Dto}
         */
        this.createDto = function (data) {
            const res = new Dto();
            res.frontUUID = castString(data?.frontUUID);
            return res;
        }

        this.getName = () => NS;
    }
}
