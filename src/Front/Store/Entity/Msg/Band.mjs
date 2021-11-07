/**
 * Structure of messages band object stored in IDB.
 *
 * @namespace Fl32_Dup_Front_Store_Entity_Msg_Band
 */
// MODULE'S VARS
const NS = 'Fl32_Dup_Front_Store_Entity_Msg_Band';
/**
 * Entity name (unique among all other IDB entities of the app).
 * @type {string}
 */
const ENTITY = '/msg/band';

/**
 * @memberOf Fl32_Dup_Front_Store_Entity_Msg_Band
 * @type {Object}
 */
const ATTR = {
    ID: 'id',
};

/**
 * @memberOf Fl32_Dup_Front_Store_Entity_Msg_Band
 */
class Dto {
    static name = `${NS}.Dto`;
    /** @type {number} */
    id;
}

/**
 * @implements TeqFw_Web_Front_Api_Store_IEntity
 */
export default class Fl32_Dup_Front_Store_Entity_Msg_Band {
    constructor(spec) {
        /** @type {TeqFw_Core_Shared_Util_Cast.castInt|function} */
        const castInt = spec['TeqFw_Core_Shared_Util_Cast.castInt'];

        /**
         * @param {Fl32_Dup_Front_Store_Entity_Msg_Band.Dto} [data]
         * @return {Fl32_Dup_Front_Store_Entity_Msg_Band.Dto}
         */
        this.createDto = function (data) {
            const res = new Dto();
            res.id = castInt(data?.id);
            return res;
        }

        this.getAttributes = () => ATTR;

        this.getAttrNames = () => Object.values(ATTR);

        this.getEntityName = () => ENTITY;

        this.getPrimaryKey = () => [ATTR.ID];
    }
}
