/**
 * Asymmetric key.
 */
// MODULE'S VARS
const NS = 'Fl32_Dup_Front_Dto_Key_Asym';

/**
 * @memberOf Fl32_Dup_Front_Dto_Key_Asym
 * @type {Object}
 */
const ATTR = {
    PUBLIC: 'public',
    SECRET: 'secret',
};

// MODULE'S CLASSES
/**
 * @memberOf Fl32_Dup_Front_Dto_Key_Asym
 */
class Dto {
    static namespace = `${NS}.Dto`;
    /** @type {string} */
    public;
    /** @type {string} */
    secret;
}

/**
 * @implements TeqFw_Core_Shared_Api_Factory_Dto_IMeta
 */
export default class Fl32_Dup_Front_Dto_Key_Asym {

    constructor(spec) {
        /** @type {TeqFw_Core_Shared_Util_Cast.castString|function} */
        const castString = spec['TeqFw_Core_Shared_Util_Cast.castString'];

        // DEFINE INSTANCE METHODS
        /**
         * @param {Fl32_Dup_Front_Dto_Key_Asym.Dto} [data]
         * @return {Fl32_Dup_Front_Dto_Key_Asym.Dto}
         */
        this.createDto = function (data) {
            const res = new Dto();
            res.secret = castString(data?.secret);
            res.public = castString(data?.public);
            return res;
        }

        this.getAttributes = () => ATTR;

        this.getAttrNames = () => Object.values(ATTR);
    }

}

// finalize code components for this es6-module
Object.freeze(ATTR);
