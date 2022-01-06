/**
 * User subscription's keys DTO.
 */
// MODULE'S VARS
const NS = 'Fl32_Dup_Front_Dto_User_Subscription_Keys';

/**
 * @memberOf Fl32_Dup_Front_Dto_User_Subscription_Keys
 * @type {Object}
 */
const ATTR = {
    AUTH: 'auth',
    P256DH: 'p256dh',
};

// MODULE'S CLASSES
/**
 * @memberOf Fl32_Dup_Front_Dto_User_Subscription_Keys
 */
class Dto {
    static namespace = `${NS}.Dto`;
    /** @type {string} */
    auth;
    /** @type {string} */
    p256dh;
}

/**
 * @implements TeqFw_Core_Shared_Api_Dto_IMeta
 */
export default class Fl32_Dup_Front_Dto_User_Subscription_Keys {

    constructor(spec) {
        /** @type {TeqFw_Core_Shared_Util_Cast.castString|function} */
        const castString = spec['TeqFw_Core_Shared_Util_Cast.castString'];

        // DEFINE INSTANCE METHODS
        /**
         * @param {Fl32_Dup_Front_Dto_User_Subscription_Keys.Dto} data
         * @return {Fl32_Dup_Front_Dto_User_Subscription_Keys.Dto}
         */
        this.createDto = function (data) {
            const res = new Dto();
            res.auth = castString(data?.auth);
            res.p256dh = castString(data?.p256dh);
            return res;
        }

        this.getAttributes = () => ATTR;

        this.getAttrNames = () => Object.values(ATTR);
    }

}

// finalize code components for this es6-module
Object.freeze(ATTR);
