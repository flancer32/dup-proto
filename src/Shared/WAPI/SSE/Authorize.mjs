/**
 * Route data for service to authorize SSE connection.
 *
 * @namespace Fl32_Dup_Shared_WAPI_SSE_Authorize
 */
// MODULE'S VARS
const NS = 'Fl32_Dup_Shared_WAPI_SSE_Authorize';

// MODULE'S CLASSES
/**
 * @memberOf Fl32_Dup_Shared_WAPI_SSE_Authorize
 */
class Request {
    /** @type {string} */
    token;
    /** @type {number} */
    userId;
}

/**
 * @memberOf Fl32_Dup_Shared_WAPI_SSE_Authorize
 */
class Response {
    /** @type {boolean} */
    success;
}

/**
 * Factory to create new DTOs and get route address.
 * @implements TeqFw_Web_Back_Api_Service_IRoute
 * @memberOf Fl32_Dup_Shared_WAPI_SSE_Authorize
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
        /** @type {TeqFw_Core_Shared_Util_Cast.castBoolean|function} */
        const castBool = spec['TeqFw_Core_Shared_Util_Cast.castBoolean'];

        // DEFINE INSTANCE METHODS
        this.getRoute = () => `/${DEF.NAME}${DEF.WAPI_SSE_AUTHORIZE}`;

        /**
         * @param {Request|null} data
         * @return {Fl32_Dup_Shared_WAPI_SSE_Authorize.Request}
         */
        this.createReq = function (data = null) {
            const res = new Request();
            res.token = castString(data?.token);
            res.userId = castInt(data?.userId);
            return res;
        }

        /**
         * @param {Response|null} data
         * @return {Fl32_Dup_Shared_WAPI_SSE_Authorize.Response}
         */
        this.createRes = function (data = null) {
            const res = new Response();
            res.success = castBool(data?.success);
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
