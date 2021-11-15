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
    AUTHOR_ID: 'authorId',
    BAND_ID: 'bandId',
    BODY: 'body',
    DATE: 'date',
    MSG_ID: 'msgId',
};

/**
 * @memberOf Fl32_Dup_Front_Store_Entity_Msg
 */
class Dto {
    static name = `${NS}.Dto`;
    /** @type {number} */
    authorId;
    /** @type {number} */
    bandId;
    /** @type {string} */
    body;
    /** @type {Date} */
    date;
    /** @type {number} */
    msgId;
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

        /**
         * @param {Fl32_Dup_Front_Store_Entity_Msg.Dto} [data]
         * @return {Fl32_Dup_Front_Store_Entity_Msg.Dto}
         */
        this.createDto = function (data) {
            const res = new Dto();
            res.authorId = castInt(data?.authorId);
            res.bandId = castInt(data?.bandId);
            res.body = castStr(data?.body);
            res.date = castDate(data?.date);
            res.msgId = castInt(data?.msgId);
            return res;
        }

        this.getAttributes = () => ATTR;

        this.getAttrNames = () => Object.values(ATTR);

        this.getEntityName = () => ENTITY;

        this.getPrimaryKey = () => [ATTR.MSG_ID];
    }
}
