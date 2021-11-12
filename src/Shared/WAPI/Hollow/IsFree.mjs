/**
 * Route data for service to get info about hollow state (free or not).
 *
 * @namespace Fl32_Dup_Shared_WAPI_Hollow_IsFree
 */
// MODULE'S VARS
const NS = 'Fl32_Dup_Shared_WAPI_Hollow_IsFree';

// MODULE'S CLASSES
/**
 * @memberOf Fl32_Dup_Shared_WAPI_Hollow_IsFree
 */
class Request {}

/**
 * @memberOf Fl32_Dup_Shared_WAPI_Hollow_IsFree
 */
class Response {
    /** @type {boolean} */
    isFree;
}

/**
 * Factory to create new DTOs and get route address.
 * @implements TeqFw_Web_Back_Api_Service_IRoute
 * @memberOf Fl32_Dup_Shared_WAPI_Hollow_IsFree
 */
class Factory {
    constructor(spec) {
        // EXTRACT DEPS
        /** @type {Fl32_Dup_Shared_Defaults} */
        const DEF = spec['Fl32_Dup_Shared_Defaults$'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castBoolean|function} */
        const castBool = spec['TeqFw_Core_Shared_Util_Cast.castBoolean'];

        // DEFINE INSTANCE METHODS
        this.getRoute = () => `/${DEF.NAME}${DEF.WAPI_HOLLOW_IS_FREE}`;

        /**
         * @param {Request|null} data
         * @return {Fl32_Dup_Shared_WAPI_Hollow_IsFree.Request}
         */
        this.createReq = function (data = null) {
            return new Request();
        }

        /**
         * @param {Response|null} data
         * @return {Fl32_Dup_Shared_WAPI_Hollow_IsFree.Response}
         */
        this.createRes = function (data = null) {
            const res = new Response();
            res.isFree = castBool(data?.isFree);
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
