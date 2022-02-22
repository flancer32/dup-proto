/**
 * DTO for UI message.
 */
// MODULE'S VARS
const NS = 'Fl32_Dup_Front_Dto_Message';

/**
 * @memberOf Fl32_Dup_Front_Dto_Message
 * @type {Object}
 */
const ATTR = {
    AUTHOR: 'author',
    BODY: 'body',
    DATE: 'date',
    KEY: 'key',
    SENT: 'sent',
};

// MODULE'S CLASSES
/**
 * @memberOf Fl32_Dup_Front_Dto_Message
 */
class Dto {
    static namespace = NS;
    /** @type {string} */
    author;
    /** @type {string} */
    body;
    /** @type {Date} */
    date;
    /** @type {string} */
    key;
    /** @type {boolean} */
    sent;
    /** @type {Fl32_Dup_Front_Enum_Msg_State} */
    state;
}

/**
 * @implements TeqFw_Core_Shared_Api_Factory_Dto_IMeta
 */
export default class Fl32_Dup_Front_Dto_Message {

    constructor(spec) {
        /** @type {TeqFw_Core_Shared_Util_Cast.castString|function} */
        const castString = spec['TeqFw_Core_Shared_Util_Cast.castString'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castDate|function} */
        const castDate = spec['TeqFw_Core_Shared_Util_Cast.castDate'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castBoolean|function} */
        const castBool = spec['TeqFw_Core_Shared_Util_Cast.castBoolean'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castEnum|function} */
        const castEnum = spec['TeqFw_Core_Shared_Util_Cast.castEnum'];
        /** @type {Fl32_Dup_Front_Enum_Msg_State} */
        const STATE = spec['Fl32_Dup_Front_Enum_Msg_State$'];

        // DEFINE INSTANCE METHODS
        /**
         * @param {Fl32_Dup_Front_Dto_Message.Dto} [data]
         * @return {Fl32_Dup_Front_Dto_Message.Dto}
         */
        this.createDto = function (data) {
            const res = new Dto();
            res.author = castString(data?.author);
            res.body = castString(data?.body);
            res.date = castDate(data?.date);
            res.key = castString(data?.key);
            res.sent = castBool(data?.sent);
            res.state = castEnum(data?.state, STATE);
            return res;
        }

        this.getAttributes = () => ATTR;

        this.getAttrNames = () => Object.values(ATTR);
    }

}

// finalize code components for this es6-module
Object.freeze(ATTR);
