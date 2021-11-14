/**
 * Route data for service to post new message.
 *
 * @namespace Fl32_Dup_Shared_WAPI_Msg_Post
 */
// MODULE'S VARS
const NS = 'Fl32_Dup_Shared_WAPI_Msg_Post';

// MODULE'S CLASSES
/**
 * @memberOf Fl32_Dup_Shared_WAPI_Msg_Post
 */
class Request {
    /**
     * Message body, encrypted and base64 encoded.
     * @type {string}
     */
    payload;
    /** @type {number} */
    recipientId;
    /** @type {number} */
    userId;
}

/**
 * @memberOf Fl32_Dup_Shared_WAPI_Msg_Post
 */
class Response {
    /** @type {number} */
    messageId;
}

/**
 * Factory to create new DTOs and get route address.
 * @implements TeqFw_Web_Back_Api_Service_IRoute
 * @memberOf Fl32_Dup_Shared_WAPI_Msg_Post
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
        this.getRoute = () => `/${DEF.NAME}${DEF.WAPI_MSG_POST}`;

        /**
         * @param {Request|null} data
         * @return {Fl32_Dup_Shared_WAPI_Msg_Post.Request}
         */
        this.createReq = function (data = null) {
            const res = new Request();
            res.payload = castString(data?.payload);
            res.recipientId = castInt(data?.recipientId);
            res.userId = castInt(data?.userId);
            return res;
        }

        /**
         * @param {Response|null} data
         * @return {Fl32_Dup_Shared_WAPI_Msg_Post.Response}
         */
        this.createRes = function (data = null) {
            const res = new Response();
            res.messageId = castInt(data?.messageId);
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
