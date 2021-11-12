/**
 * Route data for service to create invitation (sign up code) on the server.
 *
 * @namespace Fl32_Dup_Shared_WAPI_User_Invite_Create
 */
// MODULE'S VARS
const NS = 'Fl32_Dup_Shared_WAPI_User_Invite_Create';

// MODULE'S CLASSES
/**
 * @memberOf Fl32_Dup_Shared_WAPI_User_Invite_Create
 */
class Request {
    /** @type {Date} */
    dateExpired;
    /** @type {boolean} */
    onetime;
    /** @type {number} */
    userId;
}

/**
 * @memberOf Fl32_Dup_Shared_WAPI_User_Invite_Create
 */
class Response {
    /**
     * Code to compose sign-up URL.
     * @type {string}
     */
    code;
}

/**
 * Factory to create new DTOs and get route address.
 * @implements TeqFw_Web_Back_Api_Service_IRoute
 * @memberOf Fl32_Dup_Shared_WAPI_User_Invite_Create
 */
class Factory {
    constructor(spec) {
        // EXTRACT DEPS
        /** @type {Fl32_Dup_Shared_Defaults} */
        const DEF = spec['Fl32_Dup_Shared_Defaults$'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castBoolean|function} */
        const castBool = spec['TeqFw_Core_Shared_Util_Cast.castBoolean'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castDate|function} */
        const castDate = spec['TeqFw_Core_Shared_Util_Cast.castDate'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castString|function} */
        const castString = spec['TeqFw_Core_Shared_Util_Cast.castString'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castInt|function} */
        const castInt = spec['TeqFw_Core_Shared_Util_Cast.castInt'];

        // DEFINE INSTANCE METHODS
        this.getRoute = () => `/${DEF.NAME}${DEF.WAPI_USER_INVITE_CREATE}`;

        /**
         * @param {Request|null} data
         * @return {Fl32_Dup_Shared_WAPI_User_Invite_Create.Request}
         */
        this.createReq = function (data = null) {
            const res = new Request();
            res.dateExpired = castDate(data?.dateExpired);
            res.onetime = castBool(data?.onetime);
            res.userId = castInt(data?.userId);
            return res;
        }

        /**
         * @param {Response|null} data
         * @return {Fl32_Dup_Shared_WAPI_User_Invite_Create.Response}
         */
        this.createRes = function (data = null) {
            const res = new Response();
            res.code = castString(data?.code);
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
