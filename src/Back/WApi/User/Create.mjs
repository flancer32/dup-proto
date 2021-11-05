/**
 * Create new user on the server.
 *
 * @namespace Fl32_Dup_Back_WApi_User_Create
 */
// MODULE'S VARS
const NS = 'Fl32_Dup_Back_WApi_User_Create';

/**
 * @implements TeqFw_Web_Back_Api_Service_IFactory
 */
export default class Fl32_Dup_Back_WApi_User_Create {

    constructor(spec) {
        // EXTRACT DEPS
        /** @type {TeqFw_Db_Back_RDb_IConnect} */
        const conn = spec['TeqFw_Db_Back_RDb_IConnect$'];
        /** @type {Fl32_Dup_Shared_WApi_User_Create.Factory} */
        const route = spec['Fl32_Dup_Shared_WApi_User_Create#Factory$'];
        /** @type {Fl32_Dup_Back_Act_User_Create.act|function} */
        const actCreate = spec['Fl32_Dup_Back_Act_User_Create$'];

        // DEFINE INSTANCE METHODS
        this.getRouteFactory = () => route;

        this.getService = function () {
            // DEFINE INNER FUNCTIONS
            /**
             * @param {TeqFw_Web_Back_Api_Service_Context} context
             * @return Promise<void>
             */
            async function service(context) {
                // DEFINE INNER FUNCTIONS

                // MAIN FUNCTIONALITY
                /** @type {Fl32_Dup_Shared_WApi_User_Create.Request} */
                const req = context.getInData();
                /** @type {Fl32_Dup_Shared_WApi_User_Create.Response} */
                const res = context.getOutData();
                //
                const trx = await conn.startTransaction();
                try {
                    const {userId} = await actCreate({
                        trx,
                        nick: req.nick,
                        keyPub: req.keyPub,
                        endpoint: req.endpoint,
                        keyAuth: req.keyAuth,
                        keyP256dh: req.keyP256dh,
                    });
                    res.userId = userId;
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
