/**
 * Request new user invite creation form the front.
 */
// MODULE'S VARS
const NS = 'Fl32_Dup_Shared_Event_Front_User_Invite_Create_Request';

// MODULE'S CLASSES
/**
 * @memberOf Fl32_Dup_Shared_Event_Front_User_Invite_Create_Request
 */
class Dto {
    static namespace = NS;
    /** @type {Date} */
    dateExpired;
    /** @type {boolean} */
    onetime;
    /** @type {number} */
    userId;
    /** @type {string} */
    userNick;
}

/**
 * @implements TeqFw_Core_Shared_Api_Factory_Dto_IEvent
 */
export default class Fl32_Dup_Shared_Event_Front_User_Invite_Create_Request {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Web_Event_Shared_Dto_Event} */
        const dtoBase = spec['TeqFw_Web_Event_Shared_Dto_Event$'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castBoolean|function} */
        const castBoolean = spec['TeqFw_Core_Shared_Util_Cast.castBoolean'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castDate|function} */
        const castDate = spec['TeqFw_Core_Shared_Util_Cast.castDate'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castInt|function} */
        const castInt = spec['TeqFw_Core_Shared_Util_Cast.castInt'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castString|function} */
        const castString = spec['TeqFw_Core_Shared_Util_Cast.castString'];

        // VARS
        const ATTR = dtoBase.getAttributes();

        // FUNCS
        /**
         * @param {Fl32_Dup_Shared_Event_Front_User_Invite_Create_Request.Dto} [data]
         * @return {Fl32_Dup_Shared_Event_Front_User_Invite_Create_Request.Dto}
         */
        function createData(data) {
            const res = new Dto();
            res.dateExpired = castDate(data?.dateExpired);
            res.onetime = castBoolean(data?.onetime);
            res.userId = castInt(data?.userId);
            res.userNick = castString(data?.userNick);
            return res;
        }

        // INSTANCE METHODS
        /**
         * @param {{data: Fl32_Dup_Shared_Event_Front_User_Invite_Create_Request.Dto, meta: TeqFw_Web_Event_Shared_Dto_Event_Meta.Dto}} [data]
         * @return {{data: Fl32_Dup_Shared_Event_Front_User_Invite_Create_Request.Dto, meta: TeqFw_Web_Event_Shared_Dto_Event_Meta.Dto}}
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
