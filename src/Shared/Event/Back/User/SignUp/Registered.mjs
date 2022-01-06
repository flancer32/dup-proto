/**
 * New user is registered on backend.
 */
// MODULE'S VARS
const NS = 'Fl32_Dup_Shared_Event_Back_User_SignUp_Registered';

// MODULE'S CLASSES
/**
 * @memberOf Fl32_Dup_Shared_Event_Back_User_SignUp_Registered
 */
class Dto {
    static namespace = `${NS}.Dto`;
    /** @type {string} */
    serverPublicKey;
    /** @type {number} */
    userId;
}

/**
 * @implements TeqFw_Core_Shared_Api_IEvent
 */
export default class Fl32_Dup_Shared_Event_Back_User_SignUp_Registered {
    constructor(spec) {
        // EXTRACT DEPS
        /** @type {TeqFw_Core_Shared_Util_Cast.castInt|function} */
        const castInt = spec['TeqFw_Core_Shared_Util_Cast.castInt'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castString|function} */
        const castString = spec['TeqFw_Core_Shared_Util_Cast.castString'];

        // DEFINE INSTANCE METHODS

        /**
         * @param {Fl32_Dup_Shared_Event_Back_User_SignUp_Registered.Dto} [data]
         * @return {Fl32_Dup_Shared_Event_Back_User_SignUp_Registered.Dto}
         */
        this.createDto = function (data) {
            const res = new Dto();
            res.serverPublicKey = castString(data?.serverPublicKey);
            res.userId = castInt(data?.userId);
            return res;
        }

        this.getName = () => NS;
    }
}
