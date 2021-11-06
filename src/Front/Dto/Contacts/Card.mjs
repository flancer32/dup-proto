/**
 * DTO for one contact card stored in IDB.
 */
// MODULE'S VARS
const NS = 'Fl32_Dup_Front_Dto_Contacts_Card';

/**
 * @memberOf Fl32_Dup_Front_Dto_Contacts_Card
 * @type {Object}
 */
const ATTR = {
    WAPI_CARD: 'wapiCard',
};

// MODULE'S CLASSES
/**
 * @memberOf Fl32_Dup_Front_Dto_Contacts_Card
 */
class Dto {
    static name = `${NS}.Dto`;
    /** @type {Fl32_Dup_Shared_Dto_Contacts_Card.Dto} */
    wapiCard;
}

/**
 * @implements TeqFw_Core_Shared_Api_Dto_IMeta
 */
export default class Fl32_Dup_Front_Dto_Contacts_Card {

    constructor(spec) {
        /** @type {Fl32_Dup_Shared_Dto_Contacts_Card} */
        const dtoCard = spec['Fl32_Dup_Shared_Dto_Contacts_Card$'];

        // DEFINE INSTANCE METHODS
        /**
         * @param {Fl32_Dup_Front_Dto_Contacts_Card.Dto} [data]
         * @return {Fl32_Dup_Front_Dto_Contacts_Card.Dto}
         */
        this.createDto = function (data) {
            const res = new Dto();
            res.wapiCard = dtoCard.createDto(data?.wapiCard);
            return res;
        }

        this.getAttributes = () => ATTR;

        this.getAttrNames = () => Object.values(ATTR);
    }

}

// finalize code components for this es6-module
Object.freeze(ATTR);
