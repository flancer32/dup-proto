/**
 * Route data for service to get list of the users from the server.
 *
 * @namespace Fl32_Dup_Shared_WAPI_User_List
 */
// MODULE'S VARS
const NS = 'Fl32_Dup_Shared_WAPI_User_List';

// MODULE'S CLASSES
/**
 * @memberOf Fl32_Dup_Shared_WAPI_User_List
 */
class Request {

}

/**
 * @memberOf Fl32_Dup_Shared_WAPI_User_List
 */
class Response {
    /** @type {Object<number, Fl32_Dup_Shared_Dto_Contacts_Card.Dto>} */
    cards;
}

/**
 * Factory to create new DTOs and get route address.
 * @implements TeqFw_Web_Back_Api_WAPI_IRoute
 * @memberOf Fl32_Dup_Shared_WAPI_User_List
 */
class Factory {
    constructor(spec) {
        // EXTRACT DEPS
        /** @type {Fl32_Dup_Shared_Defaults} */
        const DEF = spec['Fl32_Dup_Shared_Defaults$'];
        /** @type {Fl32_Dup_Shared_Dto_Contacts_Card} */
        const dtoCard = spec['Fl32_Dup_Shared_Dto_Contacts_Card$'];

        // DEFINE WORKING VARS / PROPS

        // DEFINE INSTANCE METHODS
        this.getRoute = () => `/${DEF.NAME}${DEF.WAPI_USER_LIST}`;

        /**
         * @param {Request|null} data
         * @return {Fl32_Dup_Shared_WAPI_User_List.Request}
         */
        this.createReq = function (data = null) {
            const res = new Request();
            return res;
        }

        /**
         * @param {Response|null} data
         * @return {Fl32_Dup_Shared_WAPI_User_List.Response}
         */
        this.createRes = function (data = null) {
            // DEFINE INNER FUNCTIONS
            /**
             * Create object node from ${data} using factory ${fnCreate} to create node entries.
             * Use ${key} attribute to save node key as 'name' attribute in created entry.
             *
             * @param {Fl32_Dup_Shared_Dto_Contacts_Card} metaDto
             * @param {Object} data
             * @return {Object<number, Fl32_Dup_Shared_Dto_Contacts_Card.Dto>}
             */
            function parse(metaDto, data) {
                const res = {};
                if (typeof data === 'object')
                    for (const key of Object.keys(data))
                        res[key] = metaDto.createDto(data[key]);
                return res;
            }

            // MAIN FUNCTIONALITY
            const res = new Response();
            res.cards = parse(dtoCard, data?.cards);
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
