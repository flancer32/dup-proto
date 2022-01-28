/**
 * New Web Push notification is requested on the backend.
 */
// MODULE'S VARS
const NS = 'Fl32_Dup_Back_Event_User_Notify_WebPush';

// MODULE'S CLASSES
/**
 * @memberOf Fl32_Dup_Back_Event_User_Notify_WebPush
 */
class Dto {
    static namespace = NS;
    /**
     * Backend ID for notification's recipient.
     * @type {number}
     */
    userId;
}

/**
 * @implements TeqFw_Core_Shared_Api_Factory_Dto_IEvent
 */
export default class Fl32_Dup_Back_Event_User_Notify_WebPush {
    constructor(spec) {
        // EXTRACT DEPS
        /** @type {TeqFw_Core_Shared_App_Event_Message} */
        const dtoBase = spec['TeqFw_Core_Shared_App_Event_Message$'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castInt|function} */
        const castInt = spec['TeqFw_Core_Shared_Util_Cast.castInt'];

        // ENCLOSED VARS
        const ATTR = dtoBase.getAttributes();

        // ENCLOSED FUNCTIONS
        /**
         * @param {Fl32_Dup_Back_Event_User_Notify_WebPush.Dto} [data]
         * @return {Fl32_Dup_Back_Event_User_Notify_WebPush.Dto}
         */
        function createData(data) {
            const res = new Dto();
            res.userId = castInt(data?.userId);
            return res;
        }

        // INSTANCE METHODS
        /**
         * @param {{[data]: Fl32_Dup_Back_Event_User_Notify_WebPush.Dto, [meta]: TeqFw_Core_Shared_App_Event_Message_Meta.Dto}} [data]
         * @return {{data: Fl32_Dup_Back_Event_User_Notify_WebPush.Dto, meta: TeqFw_Core_Shared_App_Event_Message_Meta.Dto}}
         */
        this.createDto = (data) => {
            const res = dtoBase.createDto({[ATTR.META]: data?.[ATTR.META]});
            res.meta.name = NS;
            res.data = createData(data?.[ATTR.DATA]);
            // noinspection JSValidateTypes
            return res;
        }

        this.getEventName = () => NS;
    }
}
