/**
 * Base structure of messages band object stored in IDB.
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
 */
const ATTR = {
    ID: 'id',
};

/**
 * @memberOf Fl32_Dup_Front_Store_Entity_Msg_Band
 */
class Dto {
    static namespace = NS;
    /**
     * Internal local ID for object in IDB.
     * @type {number}
     */
    id;
    /**
     * UTC date when message (incoming or outgoing) was stored in IDB.
     * @type {Date}
     */
    date;
    /** @type {Fl32_Dup_Front_Enum_Msg_Type} */
    type;
    /** @type {number} */
    uuid;
}

/**
 * @implements TeqFw_Web_Front_Api_Store_IEntity
 */
export default class Fl32_Dup_Front_Store_Entity_Msg_Band {
    constructor(spec) {
        /** @type {TeqFw_Core_Shared_Util_Cast.castInt|function} */
        const castInt = spec['TeqFw_Core_Shared_Util_Cast.castInt'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castString|function} */
        const castStr = spec['TeqFw_Core_Shared_Util_Cast.castString'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castDate|function} */
        const castDate = spec['TeqFw_Core_Shared_Util_Cast.castDate'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castEnum|function} */
        const castEnum = spec['TeqFw_Core_Shared_Util_Cast.castEnum'];
        /** @type {Fl32_Dup_Front_Enum_Msg_Type} */
        const TYPE = spec['Fl32_Dup_Front_Enum_Msg_Type$'];

        /**
         * @param {Fl32_Dup_Front_Store_Entity_Msg_Band.Dto} [data]
         * @return {Fl32_Dup_Front_Store_Entity_Msg_Band.Dto}
         */
        this.createDto = function (data) {
            const res = Object.assign(new Dto(), data);
            res.body = castStr(data?.body);
            res.date = castDate(data?.date) || new Date();
            res.id = castInt(data?.id);
            res.type = castEnum(data?.type, TYPE);
            res.uuid = castStr(data?.uuid);
            return res;
        }

        /**
         * @return {typeof Fl32_Dup_Front_Store_Entity_Msg_Band.ATTR}
         */
        this.getAttributes = () => ATTR;

        /**
         * @return {(string)[]}
         */
        this.getAttrNames = () => Object.values(ATTR);

        /**
         * @return {string}
         */
        this.getEntityName = () => ENTITY;
        /**
         * @return {string[]}
         */
        this.getPrimaryKey = () => [ATTR.ID];
    }
}
