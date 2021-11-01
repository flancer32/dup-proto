/**
 * Register new user in DB.
 *
 * @namespace Fl32_Dup_Back_Act_User_Create
 */

// MODULE'S VARS
const NS = 'Fl32_Dup_Back_Act_User_Create';

// MODULE'S FUNCTIONS
export default function (spec) {
    // EXTRACT DEPS
    /** @type {TeqFw_Db_Back_Api_RDb_ICrudEngine} */
    const crud = spec['TeqFw_Db_Back_Api_RDb_ICrudEngine$'];
    /** @type {TeqFw_User_Back_Store_RDb_Schema_User} */
    const metaUser = spec['TeqFw_User_Back_Store_RDb_Schema_User$'];
    /** @type {Fl32_Dup_Back_Store_RDb_Schema_User} */
    const metaAppUser = spec['Fl32_Dup_Back_Store_RDb_Schema_User$'];
    /** @type {TeqFw_Web_Push_Back_Act_Subscript_Add.act|function} */
    const actSubAdd = spec['TeqFw_Web_Push_Back_Act_Subscript_Add$'];
    /** @type {typeof TeqFw_Web_Push_Back_Act_Subscript_Add.RESULT} */
    const SUB_ADD_CODE = spec['TeqFw_Web_Push_Back_Act_Subscript_Add.RESULT'];

    // DEFINE INNER FUNCTIONS
    /**
     * @param {TeqFw_Db_Back_RDb_ITrans} trx
     * @param {string} nick
     * @param {string} keyPub
     * @param {string} endpoint
     * @param {string} keyAuth
     * @param {string} keyP256dh
     * @return {Promise<{userId:number}>}
     * @memberOf Fl32_Dup_Back_Act_User_Create
     */
    async function act({trx, nick, keyPub, endpoint, keyAuth, keyP256dh}) {
        // DEFINE INNER FUNCTIONS
        /**
         * @param {TeqFw_Db_Back_RDb_ITrans} trx
         * @return {Promise<number>}
         */
        async function addUser(trx) {
            /** @type {typeof TeqFw_User_Back_Store_RDb_Schema_User.ATTR} */
            const ATTR = metaUser.getAttributes();
            const pk = await crud.create(trx, metaUser);
            return pk[ATTR.ID];
        }

        async function addAppData(trx, userId, nick, keyPub) {
            /** @type {typeof Fl32_Dup_Back_Store_RDb_Schema_User.ATTR} */
            const ATTR = metaAppUser.getAttributes();
            await crud.create(trx, metaAppUser, {
                [ATTR.USER_REF]: userId,
                [ATTR.NICK]: nick,
                [ATTR.KEY_PUB]: keyPub,
            });
        }

        // MAIN FUNCTIONALITY
        const userId = await addUser(trx);
        // add Web Push subscription
        const {code} = await actSubAdd({trx, userId, endpoint, auth: keyAuth, p256dh: keyP256dh});
        if (
            (code !== SUB_ADD_CODE.SUCCESS) &&
            (code !== SUB_ADD_CODE.DUPLICATE)
        ) throw new Error('Cannot add web push subscription for new user.')
        // add app related data
        await addAppData(trx, userId, nick, keyPub);
        return {userId};
    }

    // MAIN FUNCTIONALITY
    Object.defineProperty(act, 'name', {value: `${NS}.act`});
    return act;
}
