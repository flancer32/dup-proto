/**
 * Report delivery for the message.
 *
 * @namespace Fl32_Dup_Back_WAPI_Msg_Confirm_Delivery
 */
// MODULE'S VARS
const NS = 'Fl32_Dup_Back_WAPI_Msg_Confirm_Delivery';

/**
 * @implements TeqFw_Web_Back_Api_WAPI_IFactory
 */
export default class Fl32_Dup_Back_WAPI_Msg_Confirm_Delivery {

    constructor(spec) {
        // EXTRACT DEPS
        /** @type {TeqFw_Db_Back_RDb_IConnect} */
        const conn = spec['TeqFw_Db_Back_RDb_IConnect$'];
        /** @type {TeqFw_Core_Shared_Logger} */
        const logger = spec['TeqFw_Core_Shared_Logger$'];
        /** @type {Fl32_Dup_Shared_WAPI_Msg_Confirm_Delivery.Factory} */
        const route = spec['Fl32_Dup_Shared_WAPI_Msg_Confirm_Delivery#Factory$'];
        /** @type {Fl32_Dup_Back_Act_Msg_Queue_User_Remove.act|function} */
        const actQUserRemove = spec['Fl32_Dup_Back_Act_Msg_Queue_User_Remove$'];

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
                /** @type {Fl32_Dup_Shared_WAPI_Msg_Confirm_Delivery.Request} */
                const req = context.getInData();
                // /** @type {Fl32_Dup_Shared_WAPI_Msg_Confirm_Delivery.Response} */
                // const res = context.getOutData();
                //
                const trx = await conn.startTransaction();
                try {
                    const messageId = req.messageId;
                    const recipientId = req.userId;
                    const {success} = await actQUserRemove({trx, messageId, recipientId});
                    await trx.commit();
                    if (success) {
                        logger.info(`User message #${messageId} is delivered.`);
                    } else {
                        logger.info(`Cannot remove delivered message #${messageId} from users messages queue.`);
                    }
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
