/**
 * Send read confirmation to sender as continuation of 'Fl32_Dup_Shared_Event_Front_Msg_Read' event.
 *
 * @namespace Fl32_Dup_Shared_Event_Back_Msg_Read
 */
// MODULE'S VARS
const NS = 'Fl32_Dup_Shared_Event_Back_Msg_Read';

// MODULE'S CLASSES
/**
 * @memberOf Fl32_Dup_Shared_Event_Back_Msg_Read
 */
class Dto {
    static namespace = NS;
    /** @type {Date} */
    dateRead;
    /** @type {string} */
    messageUuid;
}

/**
 * @implements TeqFw_Core_Shared_Api_Factory_Dto_IEvent
 */
export default class Fl32_Dup_Shared_Event_Back_Msg_Read {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Web_Event_Shared_Dto_Event} */
        const dtoBase = spec['TeqFw_Web_Event_Shared_Dto_Event$'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castDate|function} */
        const castDate = spec['TeqFw_Core_Shared_Util_Cast.castDate'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castString|function} */
        const castString = spec['TeqFw_Core_Shared_Util_Cast.castString'];

        // VARS
        const ATTR = dtoBase.getAttributes();

        // FUNCS
        /**
         * @param {Fl32_Dup_Shared_Event_Back_Msg_Read.Dto} [data]
         * @return {Fl32_Dup_Shared_Event_Back_Msg_Read.Dto}
         */
        function createData(data) {
            const res = new Dto();
            res.dateRead = castDate(data?.dateRead);
            res.messageUuid = castString(data?.messageUuid);
            return res;
        }

        // INSTANCE METHODS
        /**
         * @param {{data: Fl32_Dup_Shared_Event_Back_Msg_Read.Dto, meta: TeqFw_Web_Event_Shared_Dto_Event_Meta.Dto}} [data]
         * @return {{data: Fl32_Dup_Shared_Event_Back_Msg_Read.Dto, meta: TeqFw_Web_Event_Shared_Dto_Event_Meta.Dto}}
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
