/**
 * Base structure for chat message stored in IDB.
 * Contains common attributes and should be converted to DTO according to type of the message.
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
 */
const ATTR = {
    BAND_REF: 'bandRef',
    BODY: 'body',
    DATE: 'date',
    DIRECTION: 'direction',
    ID: 'id',
    STATE: 'state',
    TYPE: 'type',
    UUID: 'uuid',
};

/**
 * @memberOf Fl32_Dup_Front_Store_Entity_Msg
 */
const INDEX = {
    BY_UUID: 'by_uuid',
    BY_BAND: 'by_band',
}

/**
 * @memberOf Fl32_Dup_Front_Store_Entity_Msg
 */
class Dto {
    static namespace = NS;
    /**
     * Local ID for related band in IDB.
     * @type {number}
     */
    bandRef;
    /**
     * Decrypted text body.
     * @type {string}
     */
    body;
    /**
     * UTC date when message (incoming or outgoing) was stored in IDB.
     * @type {Date}
     */
    date;
    /** @type {Fl32_Dup_Front_Enum_Msg_Direction} */
    direction;
    /**
     * Local ID for this object in IDB.
     * @type {number}
     */
    id;
    /** @type {Fl32_Dup_Front_Enum_Msg_State} */
    state;
    /** @type {Fl32_Dup_Front_Enum_Msg_Type} */
    type;
    /** @type {number} */
    uuid;
}

/**
 * @implements TeqFw_Web_Front_Api_Store_IEntity
 */
export default class Fl32_Dup_Front_Store_Entity_Msg {
    constructor(spec) {
        /** @type {TeqFw_Core_Shared_Util_Cast.castInt|function} */
        const castInt = spec['TeqFw_Core_Shared_Util_Cast.castInt'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castString|function} */
        const castStr = spec['TeqFw_Core_Shared_Util_Cast.castString'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castDate|function} */
        const castDate = spec['TeqFw_Core_Shared_Util_Cast.castDate'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castEnum|function} */
        const castEnum = spec['TeqFw_Core_Shared_Util_Cast.castEnum'];
        /** @type {Fl32_Dup_Front_Enum_Msg_Direction} */
        const DIR = spec['Fl32_Dup_Front_Enum_Msg_Direction$'];
        /** @type {Fl32_Dup_Front_Enum_Msg_State} */
        const STATE = spec['Fl32_Dup_Front_Enum_Msg_State$'];
        /** @type {Fl32_Dup_Front_Enum_Msg_Type} */
        const TYPE = spec['Fl32_Dup_Front_Enum_Msg_Type$'];

        /**
         * @param {Fl32_Dup_Front_Store_Entity_Msg.Dto} [data]
         * @return {Fl32_Dup_Front_Store_Entity_Msg.Dto}
         */
        this.createDto = function (data) {
            const res = Object.assign(new Dto(), data);
            res.bandRef = castInt(data?.bandRef);
            res.body = castStr(data?.body);
            res.date = castDate(data?.date) || new Date();
            res.direction = castEnum(data?.direction, DIR);
            res.id = castInt(data?.id);
            res.state = castEnum(data?.state, STATE);
            res.type = castEnum(data?.type, TYPE);
            res.uuid = castStr(data?.uuid);
            return res;
        }

        /**
         * @return {typeof Fl32_Dup_Front_Store_Entity_Msg.ATTR}
         */
        this.getAttributes = () => ATTR;
        /**
         *
         * @return {typeof Fl32_Dup_Front_Store_Entity_Msg.INDEX}
         */
        this.getIndexes = () => INDEX;

        this.getKeysForIndex = function (index) {
            if (index === INDEX.BY_BAND) return [ATTR.BAND_REF, ATTR.DATE, ATTR.DIRECTION];
            else if (index === INDEX.BY_UUID) return [ATTR.UUID];
            return this.getPrimaryKey();
        }

        this.getAttrNames = () => Object.values(ATTR);

        this.getEntityName = () => ENTITY;

        this.getPrimaryKey = () => [ATTR.ID];
    }
}
