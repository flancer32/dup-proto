/**
 * Contact card stored in IDB.
 *
 * @namespace Fl32_Dup_Front_Store_Entity_Contact
 */
// MODULE'S VARS
const NS = 'Fl32_Dup_Front_Store_Entity_Contact';
/**
 * Entity name (unique among all other IDB entities of the app).
 * @type {string}
 */
const ENTITY = '/contact';

/**
 * @memberOf Fl32_Dup_Front_Store_Entity_Contact
 * @type {Object}
 */
const ATTR = {
    DATE: 'date',
    ID: 'id',
    ID_ON_BACK: 'idOnBack',
    KEY_PUB: 'keyPub',
    NICK: 'nick',
};

/**
 * @memberOf Fl32_Dup_Front_Store_Entity_Contact
 */
const INDEX = {
    BY_BACK_ID: 'by_back_id',
}

/**
 * @memberOf Fl32_Dup_Front_Store_Entity_Contact
 */
class Dto {
    static namespace = NS;
    /**
     * UTC date when contact card was stored in IDB.
     * @type {Date}
     */
    date;
    /**
     * Local ID for this object in IDB.
     * @type {number}
     */
    id;
    /**
     * Backend ID for contact (front app) on the server.
     * @type {number}
     */
    idOnBack;
    /**
     * Contact's public key to encrypt data and to verify signature (base64 encoded).
     * @type {string}
     */
    keyPub;
    /**
     * Local label for the contact.
     * @type {string}
     */
    nick;
}

/**
 * @implements TeqFw_Web_Front_Api_Store_IEntity
 */
export default class Fl32_Dup_Front_Store_Entity_Contact {
    constructor(spec) {
        /** @type {TeqFw_Core_Shared_Util_Cast.castString|function} */
        const castString = spec['TeqFw_Core_Shared_Util_Cast.castString'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castInt|function} */
        const castInt = spec['TeqFw_Core_Shared_Util_Cast.castInt'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castDate|function} */
        const castDate = spec['TeqFw_Core_Shared_Util_Cast.castDate'];

        /**
         * @param {Fl32_Dup_Front_Store_Entity_Contact.Dto} [data]
         * @return {Fl32_Dup_Front_Store_Entity_Contact.Dto}
         */
        this.createDto = function (data) {
            const res = Object.assign(new Dto(), data);
            res.date = castDate(data?.date) || new Date();
            res.id = castInt(data?.id);
            res.idOnBack = castInt(data?.idOnBack);
            res.keyPub = castString(data?.keyPub);
            res.nick = castString(data?.nick);
            return res;
        }

    }

    /**
     * @return {typeof Fl32_Dup_Front_Store_Entity_Contact.ATTR}
     */

    getAttributes() { return ATTR;}

    getAttrNames() {return Object.values(ATTR);}

    getEntityName() { return ENTITY;}

    /**
     * @return {typeof Fl32_Dup_Front_Store_Entity_Contact.INDEX}
     */
    getIndexes() { return INDEX;}

    getKeysForIndex(index) {
        if (index === INDEX.BY_BACK_ID) return [ATTR.ID_ON_BACK];
        return this.getPrimaryKey();
    }

    getPrimaryKey() { return [ATTR.ID];}
}
