/**
 * Contact card stored in IDB.
 *
 * @namespace Fl32_Dup_Front_Store_Entity_Contact_Card
 */
// MODULE'S VARS
const NS = 'Fl32_Dup_Front_Store_Entity_Contact_Card';
/**
 * Part of the entity key to store in Singletons IDB store.
 * @type {string}
 */
const ENTITY = '/contact/card';

/**
 * @memberOf Fl32_Dup_Front_Store_Entity_Contact_Card
 * @type {Object}
 */
const ATTR = {
    DATE: 'date',
    ID: 'id',
    KEY_PUB: 'keyPub',
    NICK: 'nick',
    USER_ID: 'userId',
};

/**
 * @memberOf Fl32_Dup_Front_Store_Entity_Contact_Card
 */
const INDEX = {
    BY_USER: 'by_user',
}

/**
 * @memberOf Fl32_Dup_Front_Store_Entity_Contact_Card
 */
class Dto {
    static namespace = NS;
    /**
     * UTC date when contact card was stored in IDB.
     * @type {Date}
     */
    date;
    /**
     * Internal local ID for object in IDB.
     * @type {number}
     */
    id;
    /**
     * User's public key to encrypt data and to verify signature (base64 encoded).
     * @type {string}
     */
    keyPub;
    /**
     * Local label for the contact.
     * @type {string}
     */
    nick;
    /**
     * Backend ID for related user.
     * @type {number}
     */
    userId;
}

/**
 * @implements TeqFw_Web_Front_Api_Store_IEntity
 */
export default class Fl32_Dup_Front_Store_Entity_Contact_Card {
    constructor(spec) {
        /** @type {TeqFw_Core_Shared_Util_Cast.castString|function} */
        const castString = spec['TeqFw_Core_Shared_Util_Cast.castString'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castInt|function} */
        const castInt = spec['TeqFw_Core_Shared_Util_Cast.castInt'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castDate|function} */
        const castDate = spec['TeqFw_Core_Shared_Util_Cast.castDate'];

        /**
         * @param {Fl32_Dup_Front_Store_Entity_Contact_Card.Dto} [data]
         * @return {Fl32_Dup_Front_Store_Entity_Contact_Card.Dto}
         */
        this.createDto = function (data) {
            const res = Object.assign(new Dto(), data);
            res.date = castDate(data?.date) || new Date();
            res.id = castInt(data?.id);
            res.keyPub = castString(data?.keyPub);
            res.nick = castString(data?.nick);
            res.userId = castInt(data?.userId);
            return res;
        }

    }

    /**
     * @return {typeof Fl32_Dup_Front_Store_Entity_Contact_Card.ATTR}
     */

    getAttributes() { return ATTR;}

    getAttrNames() {return Object.values(ATTR);}

    getEntityName() { return ENTITY;}

    /**
     * @return {typeof Fl32_Dup_Front_Store_Entity_Contact_Card.INDEX}
     */
    getIndexes() { return INDEX;}

    getPrimaryKey() { return [ATTR.ID];}
}
