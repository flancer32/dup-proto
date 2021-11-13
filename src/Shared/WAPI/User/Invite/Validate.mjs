/**
 * Route data for service to check invite and return server keys if invite is valid.
 *
 * @namespace Fl32_Dup_Shared_WAPI_User_Invite_Validate
 */
// MODULE'S VARS
const NS = 'Fl32_Dup_Shared_WAPI_User_Invite_Validate';

// MODULE'S CLASSES
/**
 * @memberOf Fl32_Dup_Shared_WAPI_User_Invite_Validate
 */
class Request {
    /** @type {string} */
    code;
}

/**
 * @memberOf Fl32_Dup_Shared_WAPI_User_Invite_Validate
 */
class Response {
    /**
     * Public key of the server for asymmetric encryption.
     * @type {string}
     */
    serverPubKey;
    /**
     * VAPID public key for WebPush subscriptions.
     * @type {string}
     */
    webPushKey;
}

/**
 * Factory to create new DTOs and get route address.
 * @implements TeqFw_Web_Back_Api_Service_IRoute
 * @memberOf Fl32_Dup_Shared_WAPI_User_Invite_Validate
 */
class Factory {
    constructor(spec) {
        // EXTRACT DEPS
        /** @type {Fl32_Dup_Shared_Defaults} */
        const DEF = spec['Fl32_Dup_Shared_Defaults$'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castString|function} */
        const castString = spec['TeqFw_Core_Shared_Util_Cast.castString'];

        // DEFINE INSTANCE METHODS
        this.getRoute = () => `/${DEF.NAME}${DEF.WAPI_USER_INVITE_VALIDATE}`;

        /**
         * @param {Request|null} data
         * @return {Fl32_Dup_Shared_WAPI_User_Invite_Validate.Request}
         */
        this.createReq = function (data = null) {
            const res = new Request();
            res.code = castString(data?.code);
            return res;
        }

        /**
         * @param {Response|null} data
         * @return {Fl32_Dup_Shared_WAPI_User_Invite_Validate.Response}
         */
        this.createRes = function (data = null) {
            const res = new Response();
            res.serverPubKey = castString(data?.serverPubKey);
            res.webPushKey = castString(data?.webPushKey);
            return res;
        }
    }
}

// MODULE'S EXPORT
Object.defineProperty(Factory, 'name', {value: `${NS}.Factory`});
Object.defineProperty(Request, 'name', {value: `${NS}.Request`});
Object.defineProperty(Response, 'name', {value: `${NS}.Response`});
export {
    Factory,
    Request,
    Response,
};
