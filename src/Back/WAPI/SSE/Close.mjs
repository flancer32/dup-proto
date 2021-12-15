/**
 * Close SSE connection on demand from front.
 *
 * @namespace Fl32_Dup_Back_WAPI_SSE_Close
 */
// MODULE'S IMPORT

// MODULE'S VARS
const NS = 'Fl32_Dup_Back_WAPI_SSE_Close';

/**
 * @implements TeqFw_Web_Back_Api_WAPI_IFactory
 */
export default class Fl32_Dup_Back_WAPI_SSE_Close {

    constructor(spec) {
        // EXTRACT DEPS
        /** @type {Fl32_Dup_Back_Defaults} */
        const DEF = spec['Fl32_Dup_Back_Defaults$'];
        /** @type {TeqFw_Core_Shared_Logger} */
        const logger = spec['TeqFw_Core_Shared_Logger$'];
        /** @type {TeqFw_Db_Back_RDb_IConnect} */
        const conn = spec['TeqFw_Db_Back_RDb_IConnect$'];
        /** @type {Fl32_Dup_Shared_WAPI_SSE_Close.Factory} */
        const route = spec['Fl32_Dup_Shared_WAPI_SSE_Close#Factory$'];
        /** @type {Fl32_Dup_Back_Handler_SSE_Registry} */
        const registry = spec['Fl32_Dup_Back_Handler_SSE_Registry$'];

        // WORKING VARS / PROPS


        // INSTANCE METHODS
        this.getRouteFactory = () => route;

        this.getService = function () {
            // INNER FUNCTIONS
            /**
             * @param {TeqFw_Web_Back_Api_WAPI_Context} context
             * @return Promise<void>
             */
            async function service(context) {
                // INNER FUNCTIONS

                // MAIN FUNCTIONALITY
                /** @type {Fl32_Dup_Shared_WAPI_SSE_Close.Request} */
                const req = context.getInData();
                /** @type {Fl32_Dup_Shared_WAPI_SSE_Close.Response} */
                const res = context.getOutData();
                //
                const trx = await conn.startTransaction();
                try {
                    const userId = req.userId;
                    const conn = registry.getConnectionByUser(userId);
                    if (conn) {
                        conn.close(`SSE connection #${conn.connectionId} is closed on demand from front.`);
                        res.success = true;
                    } else {
                        res.userNotFound = true;
                    }
                    await trx.commit();
                } catch (error) {
                    await trx.rollback();
                    throw error;
                }
            }

            // MAIN FUNCTIONALITY
            Object.defineProperty(service, 'name', {value: `${NS}.service`});
            return service;
        }

    }
}
