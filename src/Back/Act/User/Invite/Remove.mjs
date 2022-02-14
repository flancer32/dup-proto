/**
 * Remove invite when used.
 *
 * @namespace Fl32_Dup_Back_Act_User_Invite_Remove
 */
// MODULE'S VARS
const NS = 'Fl32_Dup_Back_Act_User_Invite_Remove';

// MODULE'S FUNCTIONS
export default function (spec) {
    // EXTRACT DEPS
    /** @type {TeqFw_Core_Shared_Api_ILogger} */
    const logger = spec['TeqFw_Core_Shared_Api_ILogger$'];
    /** @type {TeqFw_Db_Back_Api_RDb_ICrudEngine} */
    const crud = spec['TeqFw_Db_Back_Api_RDb_ICrudEngine$'];
    /** @type {Fl32_Dup_Back_Store_RDb_Schema_User_Invite} */
    const metaInvite = spec['Fl32_Dup_Back_Store_RDb_Schema_User_Invite$'];


    // DEFINE WORKING VARS / PROPS
    /** @type {typeof Fl32_Dup_Back_Store_RDb_Schema_User_Invite.ATTR} */
    const ATTR = metaInvite.getAttributes();

    // DEFINE INNER FUNCTIONS
    /**
     * @param {TeqFw_Db_Back_RDb_ITrans} trx
     * @param {string} code invite code
     * @return {Promise<void>}
     * @memberOf Fl32_Dup_Back_Act_User_Invite_Remove
     */
    async function act({trx, code}) {
        const norm = code.trim().toLowerCase();
        /** @type {Fl32_Dup_Back_Store_RDb_Schema_User_Invite.Dto} */
        const invite = await crud.readOne(trx, metaInvite, {[ATTR.CODE]: norm});
        if (invite?.onetime) {
            const res = await crud.deleteOne(trx, metaInvite, {[ATTR.CODE]: norm});
            if (res === 1)
                logger.info(`One-time invite '${code}' is removed.`);
        }
    }

    // MAIN FUNCTIONALITY
    Object.defineProperty(act, 'name', {value: `${NS}.act`});
    return act;
}
