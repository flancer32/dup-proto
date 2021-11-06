// MODULE'S VARS
const NS = 'Fl32_Dup_Front_Store_Contacts';
/**
 * Part of the entity key to store in Singletons IDB store.
 * @type {string}
 */
const ENTITY = '/contacts';

/**
 * @memberOf Fl32_Dup_Front_Store_Contacts
 * @type {Object}
 */
const ATTR = {
    ID: 'id',
    KEY: 'key',
    NICK: 'nick',
    SUBSCRIPTION: 'subscription',
};

/**
 * @memberOf Fl32_Dup_Front_Store_Contacts
 */
class Dto {
    static name = `${NS}.Dto`;
    /** @type {number} */
    id;
    /** @type {Fl32_Dup_Front_Dto_Key_Asym.Dto} */
    key;
    /** @type {string} */
    nick;
    /** @type {Fl32_Dup_Front_Dto_User_Subscription.Dto} */
    subscription;
}

export default class Fl32_Dup_Front_Store_Contacts {
    constructor(spec) {
        /** @type {TeqFw_Web_Push_Back_Defaults} */
        const DEF = spec['TeqFw_Web_Push_Back_Defaults$'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castString|function} */
        const castString = spec['TeqFw_Core_Shared_Util_Cast.castString'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castInt|function} */
        const castInt = spec['TeqFw_Core_Shared_Util_Cast.castInt'];
        /** @type {Fl32_Dup_Front_Dto_Key_Asym} */
        const dtoKey = spec['Fl32_Dup_Front_Dto_Key_Asym$'];
        /** @type {Fl32_Dup_Front_Dto_User_Subscription} */
        const dtoSubscript = spec['Fl32_Dup_Front_Dto_User_Subscription$'];

        /**
         * @param {Fl32_Dup_Front_Store_Contacts.Dto} [data]
         * @return {Fl32_Dup_Front_Store_Contacts.Dto}
         */
        this.createDto = function (data) {
            const res = new Dto();
            res.id = castInt(data?.id)
            res.key = dtoKey.createDto(data?.key);
            res.nick = castString(data?.nick)
            res.subscription = dtoSubscript.createDto(data?.subscription);
            return res;
        }

        this.getAttributes = () => ATTR;

        this.getAttrNames = () => Object.values(ATTR);

        /**
         * Get entity name: '@vnd/plugin/path/to/entity'.
         * @return {string}
         */
        this.getEntityName = function () {
            return `${DEF.SHARED.NAME}${ENTITY}`
        }
    }
}
