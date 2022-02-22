/**
 * Message is delivered to recipient.
 *
 * @namespace Fl32_Dup_Shared_Event_Back_Msg_Delivery
 */
// MODULE'S VARS
const NS = 'Fl32_Dup_Shared_Event_Back_Msg_Delivery';

// MODULE'S CLASSES
/**
 * @memberOf Fl32_Dup_Shared_Event_Back_Msg_Delivery
 */
class Dto {
    static namespace = NS;
    /**
     * UTC date when message was delivered to recipient.
     * @type {Date}
     */
    dateDelivered;
    /** @type {string} */
    uuid;
}

/**
 * @implements TeqFw_Core_Shared_Api_Factory_Dto_IEvent
 */
export default class Fl32_Dup_Shared_Event_Back_Msg_Delivery {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Web_Shared_App_Event_Trans_Message} */
        const dtoBase = spec['TeqFw_Web_Shared_App_Event_Trans_Message$'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castDate|function} */
        const castDate = spec['TeqFw_Core_Shared_Util_Cast.castDate'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castString|function} */
        const castString = spec['TeqFw_Core_Shared_Util_Cast.castString'];

        // VARS
        const ATTR = dtoBase.getAttributes();

        // FUNCS
        /**
         * @param {Fl32_Dup_Shared_Event_Back_Msg_Delivery.Dto} [data]
         * @return {Fl32_Dup_Shared_Event_Back_Msg_Delivery.Dto}
         */
        function createData(data) {
            const res = new Dto();
            res.dateDelivered = castDate(data?.dateDelivered);
            res.uuid = castString(data?.uuid);
            return res;
        }

        // INSTANCE METHODS
        /**
         * @param {{data: Fl32_Dup_Shared_Event_Back_Msg_Delivery.Dto, meta: TeqFw_Web_Shared_App_Event_Trans_Message_Meta.Dto}} [data]
         * @return {{data: Fl32_Dup_Shared_Event_Back_Msg_Delivery.Dto, meta: TeqFw_Web_Shared_App_Event_Trans_Message_Meta.Dto}}
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
