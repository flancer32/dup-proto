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
    PRIVATE: 'private',
    PUBLIC: 'public',
};

// MODULE'S CLASSES
/**
 * @memberOf Fl32_Dup_Front_Dto_Key_Asym
 */
class Dto {
    static name = `${NS}.Dto`;
    /** @type {string} */
    private;
    /** @type {string} */
    public;
}

/**
 * @implements TeqFw_Core_Shared_Api_Dto_IMeta
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
            res.private = castString(data?.private);
            res.public = castString(data?.public);
            return res;
        }

        this.getAttributes = () => ATTR;

        this.getAttrNames = () => Object.values(ATTR);
    }

}

// finalize code components for this es6-module
Object.freeze(ATTR);
