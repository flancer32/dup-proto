/**
 * Get info about hollow state (free or not).
 *
 * @namespace Fl32_Dup_Back_WAPI_Hollow_IsFree
 */
// MODULE'S VARS
const NS = 'Fl32_Dup_Back_WAPI_Hollow_IsFree';

/**
 * @implements TeqFw_Web_Back_Api_WAPI_IFactory
 */
export default class Fl32_Dup_Back_WAPI_Hollow_IsFree {

    constructor(spec) {
        // EXTRACT DEPS
        /** @type {TeqFw_Db_Back_RDb_IConnect} */
        const conn = spec['TeqFw_Db_Back_RDb_IConnect$'];
        /** @type {Fl32_Dup_Shared_WAPI_Hollow_IsFree.Factory} */
        const route = spec['Fl32_Dup_Shared_WAPI_Hollow_IsFree#Factory$'];
        /** @type {TeqFw_Db_Back_Api_RDb_ICrudEngine} */
        const crud = spec['TeqFw_Db_Back_Api_RDb_ICrudEngine$'];
        /** @type {Fl32_Dup_Back_Store_RDb_Schema_User} */
        const metaAppUser = spec['Fl32_Dup_Back_Store_RDb_Schema_User$'];

        // DEFINE WORKING VARS / PROPS


        // DEFINE INSTANCE METHODS
        this.getRouteFactory = () => route;

        this.getService = function () {
            // DEFINE INNER FUNCTIONS

            /**
             * @param {TeqFw_Web_Back_Handler_WAPI_Context} context
             * @return Promise<void>
             */
            async function service(context) {
                /** @type {Fl32_Dup_Shared_WAPI_Hollow_IsFree.Request} */
                // const req = context.getInData();
                /** @type {Fl32_Dup_Shared_WAPI_Hollow_IsFree.Response} */
                const res = context.getOutData();
                //
                const trx = await conn.startTransaction();
                try {
                    const items = await crud.readSet(trx, metaAppUser, null, null, null, 1);
                    if (items.length === 0)
                        res.isFree = true;
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
