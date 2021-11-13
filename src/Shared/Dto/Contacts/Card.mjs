/**
 * Contact card DTO.
 */
// MODULE'S VARS
const NS = 'Fl32_Dup_Shared_Dto_Contacts_Card';

/**
 * @memberOf Fl32_Dup_Shared_Dto_Contacts_Card
 * @type {Object}
 */
const ATTR = {
    DATE_REGISTERED: 'dateRegistered',
    KEY_PUBLIC: 'keyPublic',
    NICK: 'nick',
    PARENT_ID: 'parentId',
    USER_ID: 'userId',
};

// MODULE'S CLASSES
/**
 * @memberOf Fl32_Dup_Shared_Dto_Contacts_Card
 */
class Dto {
    static name = `${NS}.Dto`;
    /** @type {Date} */
    dateRegistered;
    /** @type {string} */
    keyPublic;
    /** @type {string} */
    nick;
    /** @type {number} */
    parentId;
    /** @type {number} */
    userId;
}

/**
 * @implements TeqFw_Core_Shared_Api_Dto_IMeta
 */
export default class Fl32_Dup_Shared_Dto_Contacts_Card {

    constructor(spec) {
        /** @type {TeqFw_Core_Shared_Util_Cast.castDate|function} */
        const castDate = spec['TeqFw_Core_Shared_Util_Cast.castDate'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castInt|function} */
        const castInt = spec['TeqFw_Core_Shared_Util_Cast.castInt'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castString|function} */
        const castString = spec['TeqFw_Core_Shared_Util_Cast.castString'];

        // DEFINE INSTANCE METHODS
        /**
         * @param {Fl32_Dup_Shared_Dto_Contacts_Card.Dto} data
         * @return {Fl32_Dup_Shared_Dto_Contacts_Card.Dto}
         */
        this.createDto = function (data) {
            const res = new Dto();
            res.dateRegistered = castDate(data?.dateRegistered);
            res.keyPublic = castString(data?.keyPublic);
            res.nick = castString(data?.nick);
            res.parentId = castInt(data?.parentId);
            res.userId = castInt(data?.userId);
            return res;
        }
        /**
         * @return {typeof Fl32_Dup_Shared_Dto_Contacts_Card.ATTR}
         */
        this.getAttributes = () => ATTR;

        this.getAttrNames = () => Object.values(ATTR);
    }

}

// finalize code components for this es6-module
Object.freeze(ATTR);
