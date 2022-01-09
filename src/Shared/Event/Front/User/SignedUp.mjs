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
    static namespace = `${NS}.Dto`;
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
 * @implements TeqFw_Core_Shared_Api_IEvent
 */
export default class Fl32_Dup_Shared_Event_Front_User_SignedUp {
    constructor(spec) {
        // EXTRACT DEPS
        /** @type {TeqFw_Core_Shared_Util_Cast.castString|function} */
        const castString = spec['TeqFw_Core_Shared_Util_Cast.castString'];

        // DEFINE INSTANCE METHODS

        /**
         * @param {Fl32_Dup_Shared_Event_Front_User_SignedUp.Dto} [data]
         * @return {Fl32_Dup_Shared_Event_Front_User_SignedUp.Dto}
         */
        this.createDto = function (data) {
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

        this.getName = () => NS;
    }
}
