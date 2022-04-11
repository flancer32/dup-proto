/**
 * User subscription DTO.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/PushSubscription
 */
// MODULE'S VARS
const NS = 'Fl32_Dup_Front_Dto_User_Subscription';

/**
 * @memberOf Fl32_Dup_Front_Dto_User_Subscription
 * @type {Object}
 */
const ATTR = {
    ENDPOINT: 'endpoint',
    EXPIRATION_TIME: 'expirationTime',
    KEYS: 'keys',
};

// MODULE'S CLASSES
/**
 * @memberOf Fl32_Dup_Front_Dto_User_Subscription
 */
class Dto {
    static namespace = NS;
    /** @type {Date} */
    expirationTime;
    /** @type {string} */
    endpoint;
    /** @type {Fl32_Dup_Front_Dto_User_Subscription_Keys.Dto} */
    keys;
}

/**
 * @implements TeqFw_Core_Shared_Api_Factory_Dto_IMeta
 */
export default class Fl32_Dup_Front_Dto_User_Subscription {

    constructor(spec) {
        /** @type {TeqFw_Core_Shared_Util_Cast.castDate|function} */
        const castDate = spec['TeqFw_Core_Shared_Util_Cast.castDate'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castString|function} */
        const castString = spec['TeqFw_Core_Shared_Util_Cast.castString'];
        /** @type {Fl32_Dup_Front_Dto_User_Subscription_Keys} */
        const dtoKeys = spec['Fl32_Dup_Front_Dto_User_Subscription_Keys$'];

        // INSTANCE METHODS
        /**
         * @param {Fl32_Dup_Front_Dto_User_Subscription.Dto} data
         * @return {Fl32_Dup_Front_Dto_User_Subscription.Dto}
         */
        this.createDto = function (data) {
            const res = new Dto();
            res.expirationTime = castDate(data?.expirationTime);
            res.endpoint = castString(data?.endpoint);
            res.keys = dtoKeys.createDto(data?.keys);
            return res;
        }

        this.getAttributes = () => ATTR;

        this.getAttrNames = () => Object.values(ATTR);
    }

}

// finalize code components for this es6-module
Object.freeze(ATTR);
