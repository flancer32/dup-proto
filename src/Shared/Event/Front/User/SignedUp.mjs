/**
 * New user is signed up on the front.
 */
// MODULE'S VARS
const NS = 'Fl32_Dup_Shared_Event_Front_User_SignedUp';

// MODULE'S CLASSES
/**
 * @memberOf Fl32_Dup_Shared_Event_Front_User_SignedUp
 */
class Dto {
    static namespace = NS;
    /** @type {string} */
    endpoint;
    /** @type {string} */
    frontUUID;
    /** @type {string} */
    invite;
    /** @type {string} */
    keyAuth;
    /** @type {string} */
    keyP256dh;
    /** @type {string} */
    keyPub;
    /** @type {string} */
    nick;
}

/**
 * @implements TeqFw_Core_Shared_Api_Factory_Dto_IEvent
 */
export default class Fl32_Dup_Shared_Event_Front_User_SignedUp {
    constructor(spec) {
        // EXTRACT DEPS
        /** @type {TeqFw_Web_Shared_App_Event_Trans_Message} */
        const dtoBase = spec['TeqFw_Web_Shared_App_Event_Trans_Message$'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castString|function} */
        const castString = spec['TeqFw_Core_Shared_Util_Cast.castString'];

        // ENCLOSED VARS
        const ATTR = dtoBase.getAttributes();

        // ENCLOSED FUNCTIONS
        /**
         * @param {Fl32_Dup_Shared_Event_Front_User_SignedUp.Dto} [data]
         * @return {Fl32_Dup_Shared_Event_Front_User_SignedUp.Dto}
         */
        function createData(data) {
            const res = new Dto();
            res.endpoint = castString(data?.endpoint);
            res.frontUUID = castString(data?.frontUUID);
            res.invite = castString(data?.invite);
            res.keyAuth = castString(data?.keyAuth);
            res.keyP256dh = castString(data?.keyP256dh);
            res.keyPub = castString(data?.keyPub);
            res.nick = castString(data?.nick);
            return res;
        }

        // INSTANCE METHODS
        /**
             * @param {{data: Fl32_Dup_Shared_Event_Front_User_SignedUp.Dto, meta: TeqFw_Web_Shared_App_Event_Trans_Message_Meta.Dto}} [data]
         * @return {{data: Fl32_Dup_Shared_Event_Front_User_SignedUp.Dto, meta: TeqFw_Web_Shared_App_Event_Trans_Message_Meta.Dto}}
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
