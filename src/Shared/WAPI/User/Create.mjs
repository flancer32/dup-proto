/**
 * Route data for service to create new user.
 *
 * @namespace Fl32_Dup_Shared_WAPI_User_Create
 */
// MODULE'S VARS
const NS = 'Fl32_Dup_Shared_WAPI_User_Create';

// MODULE'S CLASSES
/**
 * @memberOf Fl32_Dup_Shared_WAPI_User_Create
 */
class Request {
    /** @type {string} */
    endpoint;
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
 * @memberOf Fl32_Dup_Shared_WAPI_User_Create
 */
class Response {
    /** @type {number} */
    userId;
}

/**
 * Factory to create new DTOs and get route address.
 * @implements TeqFw_Web_Back_Api_Service_IRoute
 * @memberOf Fl32_Dup_Shared_WAPI_User_Create
 */
class Factory {
    constructor(spec) {
        // EXTRACT DEPS
        /** @type {Fl32_Dup_Shared_Defaults} */
        const DEF = spec['Fl32_Dup_Shared_Defaults$'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castInt|function} */
        const castInt = spec['TeqFw_Core_Shared_Util_Cast.castInt'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castString|function} */
        const castString = spec['TeqFw_Core_Shared_Util_Cast.castString'];

        // DEFINE INSTANCE METHODS
        this.getRoute = () => `/${DEF.NAME}${DEF.WAPI_USER_CREATE}`;

        /**
         * @param {Request|null} data
         * @return {Fl32_Dup_Shared_WAPI_User_Create.Request}
         */
        this.createReq = function (data = null) {
            const res = new Request();
            res.endpoint = castString(data?.endpoint);
            res.keyAuth = castString(data?.keyAuth);
            res.keyP256dh = castString(data?.keyP256dh);
            res.keyPub = castString(data?.keyPub);
            res.nick = castString(data?.nick);
            return res;
        }

        /**
         * @param {Response|null} data
         * @return {Fl32_Dup_Shared_WAPI_User_Create.Response}
         */
        this.createRes = function (data = null) {
            const res = new Response();
            res.userId = castInt(data?.userId);
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
