/**
 * Application level user data (profile).
 */
// MODULE'S VARS
const NS = 'Fl32_Dup_Front_Dto_User';

/**
 * @memberOf Fl32_Dup_Front_Dto_User
 * @type {Object}
 */
const ATTR = {
    USERNAME: 'username',
};

// MODULE'S CLASSES
/**
 * @memberOf Fl32_Dup_Front_Dto_User
 */
class Dto {
    static namespace = NS;
    /** @type {string} */
    nick;
}

/**
 * @implements TeqFw_Core_Shared_Api_Factory_Dto_IMeta
 */
export default class Fl32_Dup_Front_Dto_User {

    constructor(spec) {
        /** @type {TeqFw_Core_Shared_Util_Cast.castString|function} */
        const castString = spec['TeqFw_Core_Shared_Util_Cast.castString'];

        // INSTANCE METHODS
        /**
         * @param {Fl32_Dup_Front_Dto_User.Dto} data
         * @return {Fl32_Dup_Front_Dto_User.Dto}
         */
        this.createDto = function (data = null) {
            const res = new Dto();
            res.nick = castString(data?.nick);
            return res;
        }

        this.getAttributes = () => ATTR;

        this.getAttrNames = () => Object.values(ATTR);
    }

}

// finalize code components for this es6-module
Object.freeze(ATTR);
