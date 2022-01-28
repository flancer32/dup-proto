/**
 * New contact card is added to frontend store.
 */
// MODULE'S VARS
const NS = 'Fl32_Dup_Front_Event_Contact_Card_Added';

// MODULE'S CLASSES
/**
 * @memberOf Fl32_Dup_Front_Event_Contact_Card_Added
 */
class Dto {
    static namespace = NS;
}

/**
 * @implements TeqFw_Core_Shared_Api_Factory_Dto_IEvent
 */
export default class Fl32_Dup_Front_Event_Contact_Card_Added {
    constructor(spec) {
        // EXTRACT DEPS
        /** @type {TeqFw_Core_Shared_App_Event_Message} */
        const dtoBase = spec['TeqFw_Core_Shared_App_Event_Message$'];

        // ENCLOSED VARS
        const ATTR = dtoBase.getAttributes();

        // ENCLOSED FUNCTIONS
        /**
         * @param {Fl32_Dup_Front_Event_Contact_Card_Added.Dto} [data]
         * @return {Fl32_Dup_Front_Event_Contact_Card_Added.Dto}
         */
        function createData(data) {
            const res = new Dto();
            return res;
        }

        // INSTANCE METHODS
        /**
         * @param {{[data]: Fl32_Dup_Front_Event_Contact_Card_Added.Dto, [meta]: TeqFw_Core_Shared_App_Event_Message_Meta.Dto}} [data]
         * @return {{data: Fl32_Dup_Front_Event_Contact_Card_Added.Dto, meta: TeqFw_Core_Shared_App_Event_Message_Meta.Dto}}
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
