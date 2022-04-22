/**
 * Message with user's contact data to add to contact book of other user.
 */
// MODULE'S VARS
const NS = 'Fl32_Dup_Shared_Event_Back_User_Contact_Add';

// MODULE'S CLASSES
/**
 * @memberOf Fl32_Dup_Shared_Event_Back_User_Contact_Add
 */
class Dto {
    static namespace = NS;
    /** @type {number} */
    userId;
    /** @type {string} */
    userNick;
    /** @type {string} */
    userPubKey;
}

/**
 * @implements TeqFw_Core_Shared_Api_Factory_Dto_IEvent
 */
export default class Fl32_Dup_Shared_Event_Back_User_Contact_Add {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Web_Event_Shared_Dto_Event} */
        const dtoBase = spec['TeqFw_Web_Event_Shared_Dto_Event$'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castInt|function} */
        const castInt = spec['TeqFw_Core_Shared_Util_Cast.castInt'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castString|function} */
        const castString = spec['TeqFw_Core_Shared_Util_Cast.castString'];

        // VARS
        const ATTR = dtoBase.getAttributes();

        // FUNCS
        /**
         * @param {Fl32_Dup_Shared_Event_Back_User_Contact_Add.Dto} [data]
         * @return {Fl32_Dup_Shared_Event_Back_User_Contact_Add.Dto}
         */
        function createData(data) {
            const res = new Dto();
            res.userId = castInt(data?.userId);
            res.userNick = castString(data?.userNick);
            res.userPubKey = castString(data?.userPubKey);
            return res;
        }

        // INSTANCE METHODS
        /**
         * @param {{data: Fl32_Dup_Shared_Event_Back_User_Contact_Add.Dto, meta: TeqFw_Web_Event_Shared_Dto_Event_Meta.Dto}} [data]
         * @return {{data: Fl32_Dup_Shared_Event_Back_User_Contact_Add.Dto, meta: TeqFw_Web_Event_Shared_Dto_Event_Meta.Dto}}
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
