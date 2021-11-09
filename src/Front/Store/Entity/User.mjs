// MODULE'S VARS
const NS = 'Fl32_Dup_Front_Store_Entity_User';
/**
 * Part of the entity key to store in Singletons IDB store.
 * @type {string}
 */
const ENTITY = '/user';

/**
 * @memberOf Fl32_Dup_Front_Store_Entity_User
 * @type {Object}
 */
const ATTR = {
    ID: 'id',
    KEY: 'key',
    NICK: 'nick',
    SUBSCRIPTION: 'subscription',
};

/**
 * @memberOf Fl32_Dup_Front_Store_Entity_User
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

/**
 * @implements TeqFw_Web_Front_Api_Store_IEntity
 */
export default class Fl32_Dup_Front_Store_Entity_User {
    constructor(spec) {
        /** @type {Fl32_Dup_Back_Defaults} */
        const DEF = spec['Fl32_Dup_Back_Defaults$'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castString|function} */
        const castString = spec['TeqFw_Core_Shared_Util_Cast.castString'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castInt|function} */
        const castInt = spec['TeqFw_Core_Shared_Util_Cast.castInt'];
        /** @type {Fl32_Dup_Front_Dto_Key_Asym} */
        const dtoKey = spec['Fl32_Dup_Front_Dto_Key_Asym$'];
        /** @type {Fl32_Dup_Front_Dto_User_Subscription} */
        const dtoSubscript = spec['Fl32_Dup_Front_Dto_User_Subscription$'];

        /**
         * @param {Fl32_Dup_Front_Store_Entity_User.Dto} [data]
         * @return {Fl32_Dup_Front_Store_Entity_User.Dto}
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
            return `${DEF.SHARED.NAME}${ENTITY}`;
        }
    }
}