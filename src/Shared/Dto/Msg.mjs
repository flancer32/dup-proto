/**
 * Text message DTO.
 *
 * @namespace Fl32_Dup_Shared_Dto_Msg
 */
// MODULE'S VARS
const NS = 'Fl32_Dup_Shared_Dto_Msg';

/**
 * @memberOf Fl32_Dup_Shared_Dto_Msg
 * @type {Object}
 */
const ATTR = {
    DATE_DELIVERED: 'dateDelivered',
    DATE_SENT: 'dateSent',
    PAYLOAD: 'payload',
    RECIPIENT_ID: 'recipientId',
    SENDER_ID: 'senderId',
    UUID: 'uuid',
};

// MODULE'S CLASSES
/**
 * @memberOf Fl32_Dup_Shared_Dto_Msg
 */
class Dto {
    static namespace = NS;
    /**
     * UTC date when message was delivered to recipient.
     * @type {Date}
     */
    dateDelivered;
    /**
     * UTC date when message was sent to the server to delivery.
     * @type {Date}
     */
    dateSent;
    /**
     * Message text, encrypted by recipient's public key and signed by sender's secret key.
     * @type {string}
     */
    payload;
    /**
     * RDB User ID for receiver.
     * @type {number}
     */
    recipientId;
    /**
     * RDB User ID for sender (used on recipient side).
     * @type {number}
     */
    senderId;
    /**
     * UUID for this text message.
     * @type {string}
     */
    uuid;
}

/**
 * @implements TeqFw_Core_Shared_Api_Factory_Dto_IMeta
 */
export default class Fl32_Dup_Shared_Dto_Msg {

    constructor(spec) {
        /** @type {TeqFw_Core_Shared_Util_Cast.castDate|function} */
        const castDate = spec['TeqFw_Core_Shared_Util_Cast.castDate'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castInt|function} */
        const castInt = spec['TeqFw_Core_Shared_Util_Cast.castInt'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castString|function} */
        const castString = spec['TeqFw_Core_Shared_Util_Cast.castString'];

        // DEFINE INSTANCE METHODS
        /**
         * @param {Fl32_Dup_Shared_Dto_Msg.Dto} data
         * @return {Fl32_Dup_Shared_Dto_Msg.Dto}
         */
        this.createDto = function (data) {
            const res = new Dto();
            res.dateDelivered = castDate(data?.dateDelivered);
            res.dateSent = castDate(data?.dateSent);
            res.payload = castString(data?.payload);
            res.recipientId = castInt(data?.recipientId);
            res.senderId = castInt(data?.senderId);
            res.uuid = castString(data?.uuid);
            return res;
        }

        /**
         * @return {typeof Fl32_Dup_Shared_Dto_Msg.ATTR}
         */
        this.getAttributes = () => ATTR;

        /**
         * @return {string[]}
         */
        this.getAttrNames = () => Object.values(ATTR);
    }

}

// finalize code components for this es6-module
Object.freeze(ATTR);
