/**
 * Post new message.
 *
 * @namespace Fl32_Dup_Back_WAPI_Msg_Post
 */
// MODULE'S VARS
const NS = 'Fl32_Dup_Back_WAPI_Msg_Post';

/**
 * @implements TeqFw_Web_Back_Api_Service_IFactory
 */
export default class Fl32_Dup_Back_WAPI_Msg_Post {

    constructor(spec) {
        // EXTRACT DEPS
        /** @type {TeqFw_Db_Back_RDb_IConnect} */
        const conn = spec['TeqFw_Db_Back_RDb_IConnect$'];
        /** @type {Fl32_Dup_Shared_WAPI_Msg_Post.Factory} */
        const route = spec['Fl32_Dup_Shared_WAPI_Msg_Post#Factory$'];
        /** @type {Fl32_Dup_Back_Handler_SSE_Registry} */
        const registry = spec['Fl32_Dup_Back_Handler_SSE_Registry$'];
        /** @type {TeqFw_Db_Back_Api_RDb_ICrudEngine} */
        const crud = spec['TeqFw_Db_Back_Api_RDb_ICrudEngine$'];
        /** @type {Fl32_Dup_Back_Store_RDb_Schema_User} */
        const metaAppUser = spec['Fl32_Dup_Back_Store_RDb_Schema_User$'];
        /** @type {Fl32_Dup_Back_Act_Msg_Queue_User_Add.act|function} */
        const actQUserAdd = spec['Fl32_Dup_Back_Act_Msg_Queue_User_Add$'];

        // DEFINE WORKING VARS / PROPS


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
                async function getNameByUserId(trx, userId) {
                    /** @type {Fl32_Dup_Back_Store_RDb_Schema_User.Dto} */
                    const item = await crud.readOne(trx, metaAppUser, userId);
                    return item?.nick ?? '';
                }

                // MAIN FUNCTIONALITY
                /** @type {Fl32_Dup_Shared_WAPI_Msg_Post.Request} */
                const req = context.getInData();
                /** @type {Fl32_Dup_Shared_WAPI_Msg_Post.Response} */
                const res = context.getOutData();
                //
                const trx = await conn.startTransaction();
                try {
                    const senderId = req?.userId;
                    const recipientId = req?.recipientId;
                    const payload = req?.payload;
                    const {msgId} = await actQUserAdd({trx, senderId, recipientId, payload});
                    /** @type {Fl32_Dup_Back_Handler_SSE_DTO_Registry_Item.Dto} */
                    const itemTo = registry.getConnectionByUser(req?.recipientId);
                    if (itemTo) {
                        const userId = senderId;
                        const body = payload;
                        const author = await getNameByUserId(trx, userId);
                        const dto = {userId, body, author, msgId};
                        const event = 'chatPost';
                        itemTo.respond(dto, null, event);
                    }
                    await trx.commit();
                    res.messageId = msgId;
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
