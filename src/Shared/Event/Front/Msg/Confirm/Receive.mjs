/**
 * Message is saved by recipient, return delivery date.
 *
 * @namespace Fl32_Dup_Shared_Event_Front_Msg_Confirm_Receive
 */
// MODULE'S VARS
const NS = 'Fl32_Dup_Shared_Event_Front_Msg_Confirm_Receive';

// MODULE'S CLASSES
/**
 * @memberOf Fl32_Dup_Shared_Event_Front_Msg_Confirm_Receive
 */
class Dto {
    static namespace = NS;
    /** @type {Date} */
    dateDelivery;
    /** @type {string} */
    messageUuid;
    /**
     * Backend ID for front that sent original message.
     * @type {number}
     */
    senderFrontId;
}

/**
 * @implements TeqFw_Core_Shared_Api_Factory_Dto_IEvent
 */
export default class Fl32_Dup_Shared_Event_Front_Msg_Confirm_Receive {
    constructor(spec) {
        // EXTRACT DEPS
        /** @type {TeqFw_Web_Shared_App_Event_Trans_Message} */
        const dtoBase = spec['TeqFw_Web_Shared_App_Event_Trans_Message$'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castDate|function} */
        const castDate = spec['TeqFw_Core_Shared_Util_Cast.castDate'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castInt|function} */
        const castInt = spec['TeqFw_Core_Shared_Util_Cast.castInt'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castString|function} */
        const castString = spec['TeqFw_Core_Shared_Util_Cast.castString'];

        // ENCLOSED VARS
        const ATTR = dtoBase.getAttributes();

        // ENCLOSED FUNCTIONS
        /**
         * @param {Fl32_Dup_Shared_Event_Front_Msg_Confirm_Receive.Dto} [data]
         * @return {Fl32_Dup_Shared_Event_Front_Msg_Confirm_Receive.Dto}
         */
        function createData(data) {
            const res = new Dto();
            res.dateDelivery = castDate(data?.dateDelivery);
            res.messageUuid = castString(data?.messageUuid);
            res.senderFrontId = castInt(data?.senderFrontId);
            return res;
        }

        // INSTANCE METHODS
        /**
         * @param {{data: Fl32_Dup_Shared_Event_Front_Msg_Confirm_Receive.Dto, meta: TeqFw_Web_Shared_App_Event_Trans_Message_Meta.Dto}} [data]
         * @return {{data: Fl32_Dup_Shared_Event_Front_Msg_Confirm_Receive.Dto, meta: TeqFw_Web_Shared_App_Event_Trans_Message_Meta.Dto}}
         */
        this.createDto = function (data) {
            const res = dtoBase.createDto({[ATTR.META]: data?.[ATTR.META]});
            res.meta.name = NS;
            res.data = createData(data?.[ATTR.DATA]);
            // noinspection JSValidateTypes
            return res;
        }

        this.getEventName = () => NS;
    }
}
