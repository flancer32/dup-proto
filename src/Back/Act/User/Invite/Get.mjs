/**
 * Get invite by code. Clean up expired invites before lookup.
 *
 * @namespace Fl32_Dup_Back_Act_User_Invite_Get
 */
// MODULE'S VARS
const NS = 'Fl32_Dup_Back_Act_User_Invite_Get';

// MODULE'S FUNCTIONS
export default function (spec) {
    // DEPS
    /** @type {TeqFw_Db_Back_Api_RDb_ICrudEngine} */
    const crud = spec['TeqFw_Db_Back_Api_RDb_ICrudEngine$'];
    /** @type {Fl32_Dup_Back_Store_RDb_Schema_User_Invite} */
    const metaInvite = spec['Fl32_Dup_Back_Store_RDb_Schema_User_Invite$'];
    /** @type {Fl32_Dup_Back_Act_User_Invite_Clean.act|function} */
    const actClean = spec['Fl32_Dup_Back_Act_User_Invite_Clean$'];

    // DEFINE WORKING VARS / PROPS
    /** @type {typeof Fl32_Dup_Back_Store_RDb_Schema_User_Invite.ATTR} */
    const ATTR = metaInvite.getAttributes();

    // FUNCS
    /**
     * @param {TeqFw_Db_Back_RDb_ITrans} trx
     * @param {string} code invite code
     * @return {Promise<Fl32_Dup_Back_Store_RDb_Schema_User_Invite.Dto|null>}
     * @memberOf Fl32_Dup_Back_Act_User_Invite_Get
     */
    async function act({trx, code}) {
        await actClean({trx});
        const norm = code.trim().toLowerCase();
        return await crud.readOne(trx, metaInvite, {[ATTR.CODE]: norm});
    }

    // MAIN
    Object.defineProperty(act, 'namespace', {value: NS});
    return act;
}
