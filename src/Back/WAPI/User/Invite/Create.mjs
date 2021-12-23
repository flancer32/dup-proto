/**
 * Create invitation (sign up code) on the server.
 *
 * @namespace Fl32_Dup_Back_WAPI_User_Invite_Create
 */
// MODULE'S VARS
const NS = 'Fl32_Dup_Back_WAPI_User_Invite_Create';

/**
 * @implements TeqFw_Web_Back_Api_WAPI_IFactory
 */
export default class Fl32_Dup_Back_WAPI_User_Invite_Create {

    constructor(spec) {
        // EXTRACT DEPS
        /** @type {TeqFw_Db_Back_RDb_IConnect} */
        const conn = spec['TeqFw_Db_Back_RDb_IConnect$'];
        /** @type {Fl32_Dup_Shared_WAPI_User_Invite_Create.Factory} */
        const route = spec['Fl32_Dup_Shared_WAPI_User_Invite_Create#Factory$'];
        /** @type {Fl32_Dup_Back_Act_User_Invite_Create.act|function} */
        const actCreate = spec['Fl32_Dup_Back_Act_User_Invite_Create$'];

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
                // DEFINE INNER FUNCTIONS

                // MAIN FUNCTIONALITY
                /** @type {Fl32_Dup_Shared_WAPI_User_Invite_Create.Request} */
                const req = context.getInData();
                /** @type {Fl32_Dup_Shared_WAPI_User_Invite_Create.Response} */
                const res = context.getOutData();
                //
                const trx = await conn.startTransaction();
                try {
                    const userId = req.userId;
                    const onetime = req.onetime;
                    const dateExpired = req.dateExpired;
                    const {code} = await actCreate({trx, userId, onetime, dateExpired});
                    res.code = code;
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
