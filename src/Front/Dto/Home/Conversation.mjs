/**
 * Description.
 */
// MODULE'S VARS
const NS = 'Fl32_Dup_Front_Dto_Home_Conversation';

/**
 * @memberOf Fl32_Dup_Front_Dto_Home_Conversation
 * @type {Object}
 */
const ATTR = {
    BAND_ID: 'bandId',
    CONTACT_ID: 'contactId',
    MESSAGE: 'message',
    NAME: 'name',
    TIME: 'time',
    UNREAD: 'unread',
};

// MODULE'S CLASSES
/**
 * @memberOf Fl32_Dup_Front_Dto_Home_Conversation
 */
export class Dto {
    static namespace = NS;
    /** @type {number} */
    bandId;
    /** @type {number} */
    contactId;
    /** @type {string} */
    message;
    /** @type {string} */
    name;
    /** @type {Date} */
    time;
    /** @type {boolean} */
    unread;
}

/**
 * @implements TeqFw_Core_Shared_Api_Factory_Dto_IMeta
 */
export default class Fl32_Dup_Front_Dto_Home_Conversation {

    constructor(spec) {
        /** @type {TeqFw_Core_Shared_Util_Cast.castBoolean|function} */
        const castBoolean = spec['TeqFw_Core_Shared_Util_Cast.castBoolean'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castDate|function} */
        const castDate = spec['TeqFw_Core_Shared_Util_Cast.castDate'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castInt|function} */
        const castInt = spec['TeqFw_Core_Shared_Util_Cast.castInt'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castString|function} */
        const castString = spec['TeqFw_Core_Shared_Util_Cast.castString'];

        // INSTANCE METHODS
        /**
         * @param {Fl32_Dup_Front_Dto_Home_Conversation.Dto} data
         * @return {Fl32_Dup_Front_Dto_Home_Conversation.Dto}
         */
        this.createDto = function (data = null) {
            const res = new Dto();
            res.bandId = castInt(data?.bandId);
            res.contactId = castInt(data?.contactId);
            res.message = castString(data?.message);
            res.name = castString(data?.name);
            res.time = castDate(data?.time);
            res.unread = castBoolean(data?.unread);
            return res;
        }

        this.getAttributes = () => ATTR;

        this.getAttrNames = () => Object.values(ATTR);
    }

}

// finalize code components for this es6-module
Object.freeze(ATTR);
