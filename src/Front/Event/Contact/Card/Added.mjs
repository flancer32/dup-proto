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
 * @implements TeqFw_Core_Shared_Api_IEvent
 */
export default class Fl32_Dup_Front_Event_Contact_Card_Added {
    constructor() {
        /**
         * @param [data]
         * @return {Fl32_Dup_Front_Event_Contact_Card_Added.Dto}
         */
        this.createDto = (data) => new Dto();

        this.getName = () => NS;
    }
}
