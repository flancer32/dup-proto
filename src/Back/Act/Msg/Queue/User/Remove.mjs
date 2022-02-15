/**
 * Remove delivered user-to-user message from the queue.
 *
 * @namespace Fl32_Dup_Back_Act_Msg_Queue_User_Remove
 */

// MODULE'S VARS
const NS = 'Fl32_Dup_Back_Act_Msg_Queue_User_Remove';

// MODULE'S FUNCTIONS
export default function (spec) {
    // DEPS
    /** @type {TeqFw_Db_Back_Api_RDb_ICrudEngine} */
    const crud = spec['TeqFw_Db_Back_Api_RDb_ICrudEngine$'];
    /** @type {Fl32_Dup_Back_Store_RDb_Schema_Queue_Msg_User} */
    const metaQueue = spec['Fl32_Dup_Back_Store_RDb_Schema_Queue_Msg_User$'];

    // DEFINE WORKING VARS / PROPS
    /** @type {typeof Fl32_Dup_Back_Store_RDb_Schema_Queue_Msg_User.ATTR} */
    const ATTR = metaQueue.getAttributes();

    // ENCLOSED FUNCS
    /**
     * @param {TeqFw_Db_Back_RDb_ITrans} trx
     * @param {number} messageId
     * @param {number} recipientId
     * @return {Promise<{success:boolean}>}
     * @memberOf Fl32_Dup_Back_Act_Msg_Queue_User_Remove
     */
    async function act({trx, messageId, recipientId}) {
        const where = (build) => build
            .where(ATTR.ID, parseInt(messageId))
            .where(ATTR.RECEIVER_REF, parseInt(recipientId));
        const res = await crud.deleteSet(trx, metaQueue, where);
        return {success: (res === 1)};
    }

    // MAIN
    Object.defineProperty(act, 'name', {value: `${NS}.act`});
    return act;
}
