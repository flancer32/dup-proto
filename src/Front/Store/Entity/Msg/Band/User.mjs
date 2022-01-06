/**
 * Structure of user-to-user messages band object stored in IDB.
 *
 * @namespace Fl32_Dup_Front_Store_Entity_Msg_Band_User
 */
// MODULE'S VARS
const NS = 'Fl32_Dup_Front_Store_Entity_Msg_Band_User';
/**
 * Entity name (unique among all other IDB entities of the app).
 * @type {string}
 */
const ENTITY = '/msg/band';

/**
 * @memberOf Fl32_Dup_Front_Store_Entity_Msg_Band_User
 * @type {Object}
 */
const ATTR = {
    USER_ID: 'userId',
};

/**
 * @memberOf Fl32_Dup_Front_Store_Entity_Msg_Band_User
 */
class Dto {
    static namespace = `${NS}.Dto`;
    /** @type {number} */
    id;
}

/**
 * @implements TeqFw_Web_Front_Api_Store_IEntity
 */
export default class Fl32_Dup_Front_Store_Entity_Msg_Band_User {
    constructor(spec) {
        /** @type {TeqFw_Core_Shared_Util_Cast.castInt|function} */
        const castInt = spec['TeqFw_Core_Shared_Util_Cast.castInt'];

        /**
         * @param {Fl32_Dup_Front_Store_Entity_Msg_Band_User.Dto} [data]
         * @return {Fl32_Dup_Front_Store_Entity_Msg_Band_User.Dto}
         */
        this.createDto = function (data) {
            const res = new Dto();
            res.id = castInt(data?.id);
            return res;
        }

        this.getAttributes = () => ATTR;

        this.getAttrNames = () => Object.values(ATTR);

        this.getEntityName = () => ENTITY;

        this.getPrimaryKey = () => [ATTR.USER_ID];
    }
}
