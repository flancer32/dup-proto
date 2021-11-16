/**
 * DTO for SSE connection registry item.
 * SSE connection registry is used by SSE processor to register all opened connections.
 */
// MODULE'S VARS
const NS = 'Fl32_Dup_Back_Handler_SSE_DTO_Registry_Item';

/**
 * @memberOf Fl32_Dup_Back_Handler_SSE_DTO_Registry_Item
 * @type {Object}
 */
const ATTR = {
    CLOSE: 'close',
    CONNECTION_ID: 'connectionId',
    MESSAGE_ID: 'id',
    RESPOND: 'respond',
    STATE: 'state',
};

// MODULE'S CLASSES
/**
 * @memberOf Fl32_Dup_Back_Handler_SSE_DTO_Registry_Item
 */
class Dto {
    static name = `${NS}.Dto`;
    /** @type {function} */
    close;
    /** @type {number} */
    connectionId;
    /** @type {number} */
    messageId;
    /** @type {function} */
    respond;
    /** @type {string} TODO: use it or remove it */
    state;
    /** @type {number} */
    userId;
}

/**
 * @implements TeqFw_Core_Shared_Api_Dto_IMeta
 */
export default class Fl32_Dup_Back_Handler_SSE_DTO_Registry_Item {

    constructor(spec) {
        /** @type {TeqFw_Core_Shared_Util_Cast.castString|function} */
        const castString = spec['TeqFw_Core_Shared_Util_Cast.castString'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castInt|function} */
        const castInt = spec['TeqFw_Core_Shared_Util_Cast.castInt'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castFunction|function} */
        const castFun = spec['TeqFw_Core_Shared_Util_Cast.castFunction'];


        // DEFINE INSTANCE METHODS
        /**
         * @param {Fl32_Dup_Back_Handler_SSE_DTO_Registry_Item.Dto} data
         * @return {Fl32_Dup_Back_Handler_SSE_DTO_Registry_Item.Dto}
         */
        this.createDto = function (data = null) {
            const res = new Dto();
            res.close = castFun(data?.close);
            res.connectionId = castInt(data?.connectionId);
            res.messageId = castInt(data?.messageId);
            res.respond = castFun(data?.respond);
            res.state = castString(data?.state);
            res.userId = castInt(data?.userId);
            return res;
        }

        this.getAttributes = () => ATTR;

        this.getAttrNames = () => Object.values(ATTR);
    }

}

// finalize code components for this es6-module
Object.freeze(ATTR);
