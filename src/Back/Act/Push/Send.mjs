/**
 * Send notification to user with WebPush API.
 *
 * @namespace Fl32_Dup_Back_Act_Push_Send
 * @deprecated use TeqFw_Web_Push_Back_Act_Subscript_SendMsg
 */
// MODULE'S VARS
const NS = 'Fl32_Dup_Back_Act_Push_Send';

// MODULE'S FUNCTIONS
export default function (spec) {
    // DEPS
    /** @type {TeqFw_Core_Shared_Api_ILogger} */
    const logger = spec['TeqFw_Core_Shared_Api_ILogger$$']; // instance
    /** @type {TeqFw_Db_Back_Api_RDb_ICrudEngine} */
    const crud = spec['TeqFw_Db_Back_Api_RDb_ICrudEngine$'];
    /** @type {TeqFw_Web_Push_Back_Act_Subscript_SendMsg.act|function} */
    const actPushSend = spec['TeqFw_Web_Push_Back_Act_Subscript_SendMsg$'];
    /** @type {TeqFw_Web_Push_Back_Store_RDb_Schema_Subscript} */
    const rdbSubscription = spec['TeqFw_Web_Push_Back_Store_RDb_Schema_Subscript$'];

    // VARS
    /** @type {typeof TeqFw_Web_Push_Back_Store_RDb_Schema_Subscript.ATTR} */
    const A_SUB = rdbSubscription.getAttributes();

    // MAIN
    logger.setNamespace(NS);

    // FUNCS
    /**
     * @param {TeqFw_Db_Back_RDb_ITrans} trx
     * @param {number} userId
     * @param {string} body
     * @return {Promise<{success: boolean}>}
     * @memberOf Fl32_Dup_Back_Act_Push_Send
     */
    async function act({trx, userId, body}) {
        // FUNCS

        // MAIN
        /** @type {TeqFw_Web_Push_Back_Store_RDb_Schema_Subscript.Dto[]} */
        const all = await crud.readSet(trx, rdbSubscription, {[A_SUB.FRONT_REF]: userId});
        for (const one of all) {
            const title = 'Dup chat is calling for you!';
            const res = await actPushSend({
                title,
                body,
                endpoint: one.endpoint,
                auth: one.key_auth,
                p256dh: one.key_p256dh,
            });
            logger.info(`Web Push result: ${JSON.stringify(res)}`);
        }
        return {success: true};
    }

    // MAIN
    Object.defineProperty(act, 'name', {value: `${NS}.act`});
    return act;
}
