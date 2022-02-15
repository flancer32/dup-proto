/**
 * Front request to add this user contact card to remote user's contacts list.
 */
// MODULE'S VARS
const NS = 'Fl32_Dup_Shared_Event_Front_Contact_Card_Add_Request';

// MODULE'S CLASSES
/**
 * @memberOf Fl32_Dup_Shared_Event_Front_Contact_Card_Add_Request
 */
class Dto {
    static namespace = NS;
    /**
     * Invitation code to remove one-time invites after usage.
     * @type {string}
     */
    inviteCode;
    /**
     * User's own nickname for contact.
     * @type {string}
     */
    nick;
    /**
     * Public key for asymmetric encryption.
     * @type {string}
     */
    publicKey;
    /**
     * Backend ID for target user.
     * @type {number}
     */
    recipientId;
    /**
     * Backend ID for current user.
     * @type {number}
     */
    userId;
}

/**
 * @implements TeqFw_Core_Shared_Api_Factory_Dto_IEvent
 */
export default class Fl32_Dup_Shared_Event_Front_Contact_Card_Add_Request {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Web_Shared_App_Event_Trans_Message} */
        const dtoBase = spec['TeqFw_Web_Shared_App_Event_Trans_Message$'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castInt|function} */
        const castInt = spec['TeqFw_Core_Shared_Util_Cast.castInt'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castString|function} */
        const castString = spec['TeqFw_Core_Shared_Util_Cast.castString'];

        // ENCLOSED VARS
        const ATTR = dtoBase.getAttributes();

        // ENCLOSED FUNCTIONS
        /**
         * @param {Fl32_Dup_Shared_Event_Front_Contact_Card_Add_Request.Dto} [data]
         * @return {Fl32_Dup_Shared_Event_Front_Contact_Card_Add_Request.Dto}
         */
        function createData(data) {
            const res = new Dto();
            res.inviteCode = castString(data?.inviteCode);
            res.nick = castString(data?.nick);
            res.publicKey = castString(data?.publicKey);
            res.recipientId = castInt(data?.recipientId);
            res.userId = castInt(data?.userId);
            return res;
        }

        // INSTANCE METHODS
        /**
         * @param {{data: Fl32_Dup_Shared_Event_Front_Contact_Card_Add_Request.Dto, meta: TeqFw_Web_Shared_App_Event_Trans_Message_Meta.Dto}} [data]
         * @return {{data: Fl32_Dup_Shared_Event_Front_Contact_Card_Add_Request.Dto, meta: TeqFw_Web_Shared_App_Event_Trans_Message_Meta.Dto}}
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
