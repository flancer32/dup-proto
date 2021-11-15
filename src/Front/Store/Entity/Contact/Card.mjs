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
    COLOR_BG: 'colorBg',
    COLOR_TEXT: 'colorText',
    KEY_PUB: 'keyPub',
    NICK: 'nick',
    PARENT_ID: 'parentId',
    USER_ID: 'userId',
};

/**
 * @memberOf Fl32_Dup_Front_Store_Entity_Contact_Card
 */
class Dto {
    static name = `${NS}.Dto`;
    /** @type {string} */
    colorBg;
    /** @type {string} */
    colorText;
    /** @type {number} */
    id;
    /** @type {string} */
    keyPub;
    /** @type {string} */
    nick;
    /** @type {number} */
    parentId;
    /** @type {number} */
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

        /**
         * @param {Fl32_Dup_Front_Store_Entity_Contact_Card.Dto} [data]
         * @return {Fl32_Dup_Front_Store_Entity_Contact_Card.Dto}
         */
        this.createDto = function (data) {
            const res = new Dto();
            res.colorBg = castString(data?.colorBg);
            res.colorText = castString(data?.colorText);
            res.id = castInt(data?.id);
            res.keyPub = castString(data?.keyPub);
            res.nick = castString(data?.nick);
            res.parentId = castInt(data?.parentId);
            res.userId = castInt(data?.userId);
            return res;
        }

        this.getAttributes = () => ATTR;

        this.getAttrNames = () => Object.values(ATTR);

        this.getEntityName = () => ENTITY;

        this.getPrimaryKey = () => [ATTR.USER_ID];
    }

}
