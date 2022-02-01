/**
 * Messages band data stored in IDB.
 * Each contact related to separate band of personal messages.
 *
 * @namespace Fl32_Dup_Front_Store_Entity_Band
 */
// MODULE'S VARS
const NS = 'Fl32_Dup_Front_Store_Entity_Band';
/**
 * Part of the entity key to store in Singletons IDB store.
 * @type {string}
 */
const ENTITY = '/band';

/**
 * @memberOf Fl32_Dup_Front_Store_Entity_Band
 * @type {Object}
 */
const ATTR = {
    CONTACT_REF: 'contactRef',
    DATE: 'date',
    ID: 'id',
};

/**
 * @memberOf Fl32_Dup_Front_Store_Entity_Band
 */
const INDEX = {
    BY_CONTACT: 'by_contact'
}

/**
 * @memberOf Fl32_Dup_Front_Store_Entity_Band
 */
class Dto {
    static namespace = NS;
    /**
     * Reference to related contact by local id (this IDB only).
     * @type {number}
     */
    contactRef;
    /**
     * UTC date when band was created in IDB.
     * @type {Date}
     */
    date;
    /**
     * Internal local ID for object in IDB.
     * @type {number}
     */
    id;
}

/**
 * @implements TeqFw_Web_Front_Api_Store_IEntity
 */
export default class Fl32_Dup_Front_Store_Entity_Band {
    constructor(spec) {
        /** @type {TeqFw_Core_Shared_Util_Cast.castInt|function} */
        const castInt = spec['TeqFw_Core_Shared_Util_Cast.castInt'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castDate|function} */
        const castDate = spec['TeqFw_Core_Shared_Util_Cast.castDate'];

        /**
         * @param {Fl32_Dup_Front_Store_Entity_Band.Dto} [data]
         * @return {Fl32_Dup_Front_Store_Entity_Band.Dto}
         */
        this.createDto = function (data) {
            const res = Object.assign(new Dto(), data);
            res.contactRef = castInt(data?.contactRef);
            res.date = castDate(data?.date) || new Date();
            res.id = castInt(data?.id);
            return res;
        }

    }

    /**
     * @return {typeof Fl32_Dup_Front_Store_Entity_Band.ATTR}
     */
    getAttributes = () => ATTR;

    getAttrNames = () => Object.values(ATTR);

    getEntityName = () => ENTITY;

    /**
     * @return {typeof Fl32_Dup_Front_Store_Entity_Band.INDEX}
     */
    getIndexes = () => INDEX;

    getPrimaryKey = () => [ATTR.ID];
}
