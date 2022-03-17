/**
 * Clean up expired invites in RDB.
 *
 * @namespace Fl32_Dup_Back_Act_User_Invite_Clean
 */
// MODULE'S VARS
const NS = 'Fl32_Dup_Back_Act_User_Invite_Clean';

// MODULE'S FUNCTIONS
export default function (spec) {
    // DEPS
    /** @type {TeqFw_Db_Back_Api_RDb_ICrudEngine} */
    const crud = spec['TeqFw_Db_Back_Api_RDb_ICrudEngine$'];
    /** @type {Fl32_Dup_Back_Store_RDb_Schema_User_Invite} */
    const metaInvite = spec['Fl32_Dup_Back_Store_RDb_Schema_User_Invite$'];

    // DEFINE WORKING VARS / PROPS
    /** @type {typeof Fl32_Dup_Back_Store_RDb_Schema_User_Invite.ATTR} */
    const ATTR = metaInvite.getAttributes();

    // FUNCS
    /**
     * @param {TeqFw_Db_Back_RDb_ITrans} trx
     * @return {Promise<void>}
     * @memberOf Fl32_Dup_Back_Act_User_Invite_Clean
     */
    async function act({trx}) {
        const where = (build) => build.where(ATTR.DATE_EXPIRED, '<', new Date());
        await crud.deleteSet(trx, metaInvite, where);
    }

    // MAIN
    Object.defineProperty(act, 'namespace', {value: NS});
    return act;
}
