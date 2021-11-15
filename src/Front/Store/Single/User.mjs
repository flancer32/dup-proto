/**
 * This is DTO for IDB singletons (see TeqFw_Web_Front_Store)
 * @type {string}
 */
// MODULE'S VARS
const NS = 'Fl32_Dup_Front_Store_Single_User';
/**
 * Part of the entity key to store in Singletons IDB store.
 * @type {string}
 */
const ENTITY = '/user';

/**
 * @memberOf Fl32_Dup_Front_Store_Single_User
 * @type {Object}
 */
const ATTR = {
    HOLLOW_SECRET_KEY: 'hollowSecretKey',
    ID: 'id',
    KEY: 'key',
    NICK: 'nick',
    SERVER_PUB_KEY: 'serverPubKey',
    SUBSCRIPTION: 'subscription',
};

/**
 * @memberOf Fl32_Dup_Front_Store_Single_User
 */
class Dto {
    static name = `${NS}.Dto`;
    /** @type {string} */
    hollowSecretKey;
    /** @type {number} */
    id;
    /** @type {Fl32_Dup_Front_Dto_Key_Asym.Dto} */
    key;
    /** @type {string} */
    nick;
    /** @type {string} */
    serverPubKey;
    /** @type {Fl32_Dup_Front_Dto_User_Subscription.Dto} */
    subscription;
}

/**
 * @implements TeqFw_Web_Front_Api_Store_IEntity
 */
export default class Fl32_Dup_Front_Store_Single_User {
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
         * @param {Fl32_Dup_Front_Store_Single_User.Dto} [data]
         * @return {Fl32_Dup_Front_Store_Single_User.Dto}
         */
        this.createDto = function (data) {
            const res = new Dto();
            res.hollowSecretKey = castString(data?.hollowSecretKey)
            res.id = castInt(data?.id)
            res.key = dtoKey.createDto(data?.key);
            res.nick = castString(data?.nick)
            res.serverPubKey = castString(data?.serverPubKey)
            res.subscription = dtoSubscript.createDto(data?.subscription);
            return res;
        }

        this.getAttributes = () => ATTR;

        this.getAttrNames = () => Object.values(ATTR);

        this.getEntityName = () => `${DEF.SHARED.NAME}${ENTITY}`;

        this.getPrimaryKey = () => [ATTR.ID];
    }

}
