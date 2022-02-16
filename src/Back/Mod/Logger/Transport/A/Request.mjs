/**
 * DTO to send logs to monitoring server with POST requests.
 * see Fl64_Log_Agg_Shared_WAPI_Add.Request
 */
// MODULE'S VARS
const NS = 'Fl32_Dup_Back_Mod_Logger_Transport_A_Request';

/**
 * @memberOf Fl32_Dup_Back_Mod_Logger_Transport_A_Request
 * @type {Object}
 */
const ATTR = {
    DATE: 'date',
    LEVEL: 'level',
    MESSAGE: 'message',
    META: 'meta',
    SOURCE: 'source',
};

// MODULE'S CLASSES
/**
 * @memberOf Fl32_Dup_Back_Mod_Logger_Transport_A_Request
 */
class Dto {
    static namespace = NS;
    /**
     * Log event date (UTC).
     * @type {Date}
     */
    date;
    /**
     * Unsigned integer to indicate logged event level. Custom values.
     * @type {number}
     */
    level;
    /**
     * Log message to aggregate.
     * @type {string}
     */
    message;
    /**
     * Metadata as JSON object.
     * @type {Object}
     */
    meta;
    /**
     * Log event source (namespace, filename, process id, ...).
     * @type {string}
     */
    source;
}

/**
 * @implements TeqFw_Core_Shared_Api_Factory_Dto_IMeta
 */
export default class Fl32_Dup_Back_Mod_Logger_Transport_A_Request {

    constructor(spec) {
        /** @type {TeqFw_Core_Shared_Util_Cast.castDate|function} */
        const castDate = spec['TeqFw_Core_Shared_Util_Cast.castDate'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castInt|function} */
        const castInt = spec['TeqFw_Core_Shared_Util_Cast.castInt'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castString|function} */
        const castString = spec['TeqFw_Core_Shared_Util_Cast.castString'];
        /** @type {TeqFw_Core_Shared_Dto_Formless} */
        const dtoFormless = spec['TeqFw_Core_Shared_Dto_Formless$'];

        // INSTANCE METHODS
        /**
         * @param {Fl32_Dup_Back_Mod_Logger_Transport_A_Request.Dto} data
         * @return {Fl32_Dup_Back_Mod_Logger_Transport_A_Request.Dto}
         */
        this.createDto = function (data = null) {
            const res = new Dto();
            res.date = castDate(data?.date);
            res.level = castInt(data?.level);
            res.message = castString(data?.message);
            res.source = castString(data?.source);
            // noinspection JSValidateTypes
            res.meta = dtoFormless.createDto(data?.meta);
            return res;
        }

        this.getAttributes = () => ATTR;

        this.getAttrNames = () => Object.values(ATTR);
    }

}

// finalize code components for this es6-module
Object.freeze(ATTR);
