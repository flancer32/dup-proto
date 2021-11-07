/**
 * Structure of message object stored in IDB.
 *
 * @namespace Fl32_Dup_Front_Store_Entity_Msg
 */
// MODULE'S VARS
const NS = 'Fl32_Dup_Front_Store_Entity_Msg';
/**
 * Entity name (unique among all other IDB entities of the app).
 * @type {string}
 */
const ENTITY = '/msg';

/**
 * @memberOf Fl32_Dup_Front_Store_Entity_Msg
 * @type {Object}
 */
const ATTR = {
    BAND_ID: 'bandId',
    ID: 'id',
};

/**
 * @memberOf Fl32_Dup_Front_Store_Entity_Msg
 */
class Dto {
    static name = `${NS}.Dto`;
    /** @type {number} */
    bandId;
    /** @type {number} */
    id;
}

/**
 * @implements TeqFw_Web_Front_Api_Store_IEntity
 */
export default class Fl32_Dup_Front_Store_Entity_Msg {
    constructor(spec) {
        /** @type {TeqFw_Core_Shared_Util_Cast.castInt|function} */
        const castInt = spec['TeqFw_Core_Shared_Util_Cast.castInt'];

        /**
         * @param {Fl32_Dup_Front_Store_Entity_Msg.Dto} [data]
         * @return {Fl32_Dup_Front_Store_Entity_Msg.Dto}
         */
        this.createDto = function (data) {
            const res = new Dto();
            res.id = castInt(data?.id);
            res.bandId = castInt(data?.bandId);
            return res;
        }

        this.getAttributes = () => ATTR;

        this.getAttrNames = () => Object.values(ATTR);

        this.getEntityName = () => ENTITY;

        this.getPrimaryKey = () => [ATTR.ID];
    }
}
