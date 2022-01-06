/**
 * DTO to send authorization request to client on SSE connection opening.
 */
// MODULE'S VARS
const NS = 'Fl32_Dup_Shared_SSE_ChatPost';
// TODO: add event name here (separate interface for SSE)
/**
 * @memberOf Fl32_Dup_Shared_SSE_ChatPost
 * @type {Object}
 */
const ATTR = {
    CONNECTION_ID: 'connectionId',
    PAYLOAD: 'payload',
};

// MODULE'S CLASSES
/**
 * @memberOf Fl32_Dup_Shared_SSE_ChatPost
 */
class Dto {
    static namespace = `${NS}.Dto`;
    /** @type {number} */
    connectionId;
    /** @type {string} */
    payload;
}

/**
 * @implements TeqFw_Core_Shared_Api_Dto_IMeta
 */
export default class Fl32_Dup_Shared_SSE_ChatPost {

    constructor(spec) {
        /** @type {TeqFw_Core_Shared_Util_Cast.castString|function} */
        const castString = spec['TeqFw_Core_Shared_Util_Cast.castString'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castInt|function} */
        const castInt = spec['TeqFw_Core_Shared_Util_Cast.castInt'];

        // DEFINE INSTANCE METHODS
        /**
         * @param {Fl32_Dup_Shared_SSE_ChatPost.Dto} [data]
         * @return {Fl32_Dup_Shared_SSE_ChatPost.Dto}
         */
        this.createDto = function (data) {
            const res = new Dto();
            res.connectionId = castInt(data?.connectionId);
            res.payload = castString(data?.payload);
            return res;
        }

        this.getAttributes = () => ATTR;

        this.getAttrNames = () => Object.values(ATTR);
    }

}

// finalize code components for this es6-module
Object.freeze(ATTR);
