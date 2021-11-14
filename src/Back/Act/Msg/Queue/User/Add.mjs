/**
 * Add new user-to-user message to the queue.
 *
 * @namespace Fl32_Dup_Back_Act_Msg_Queue_User_Add
 */

// MODULE'S VARS
const NS = 'Fl32_Dup_Back_Act_Msg_Queue_User_Add';

// MODULE'S FUNCTIONS
export default function (spec) {
    // EXTRACT DEPS
    /** @type {TeqFw_Db_Back_Api_RDb_ICrudEngine} */
    const crud = spec['TeqFw_Db_Back_Api_RDb_ICrudEngine$'];
    /** @type {Fl32_Dup_Back_Store_RDb_Schema_Queue_Msg_User} */
    const metaQueue = spec['Fl32_Dup_Back_Store_RDb_Schema_Queue_Msg_User$'];

    // DEFINE WORKING VARS / PROPS
    /** @type {typeof Fl32_Dup_Back_Store_RDb_Schema_Queue_Msg_User.ATTR} */
    const ATTR = metaQueue.getAttributes();

    // DEFINE INNER FUNCTIONS
    /**
     * @param {TeqFw_Db_Back_RDb_ITrans} trx
     * @param {number} senderId
     * @param {number} recipientId
     * @param {string} payload
     * @return {Promise<{msgId:number}>}
     * @memberOf Fl32_Dup_Back_Act_Msg_Queue_User_Add
     */
    async function act({trx, senderId, recipientId, payload}) {
        // DEFINE INNER FUNCTIONS

        // MAIN FUNCTIONALITY
        /** @type {Fl32_Dup_Back_Store_RDb_Schema_Queue_Msg_User.Dto} */
        const dto = metaQueue.createDto();
        dto.sender_ref = senderId;
        dto.receiver_ref = recipientId;
        dto.date = new Date();
        dto.state = 'new';
        dto.payload = payload;
        const {[ATTR.ID]: msgId} = await crud.create(trx, metaQueue, dto);
        return {msgId};
    }

    // MAIN FUNCTIONALITY
    Object.defineProperty(act, 'name', {value: `${NS}.act`});
    return act;
}
