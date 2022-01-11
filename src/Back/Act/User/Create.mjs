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
    /** @type {Fl32_Dup_Back_Store_RDb_Schema_User_Tree} */
    const metaUserTree = spec['Fl32_Dup_Back_Store_RDb_Schema_User_Tree$'];
    /** @type {TeqFw_Web_Push_Back_Act_Subscript_Add.act|function} */
    const actSubscriptAdd = spec['TeqFw_Web_Push_Back_Act_Subscript_Add$'];
    /** @type {typeof TeqFw_Web_Push_Back_Act_Subscript_Add.RESULT} */
    const SUB_ADD_CODE = spec['TeqFw_Web_Push_Back_Act_Subscript_Add.RESULT'];

    // DEFINE INNER FUNCTIONS
    /**
     * @param {TeqFw_Db_Back_RDb_ITrans} trx
     * @param {number|null} parentId
     * @param {string} nick
     * @param {string} keyPub
     * @param {string} endpoint
     * @param {string} keyAuth
     * @param {string} keyP256dh
     * @return {Promise<{userId:number}>}
     * @memberOf Fl32_Dup_Back_Act_User_Create
     */
    async function act({trx, parentId, nick, keyPub, endpoint, keyAuth, keyP256dh}) {
        // DEFINE INNER FUNCTIONS

        /**
         * Register user and get userId.
         * @param {TeqFw_Db_Back_RDb_ITrans} trx
         * @param {string} username
         * @param {string} publicKey
         * @return {Promise<number>}
         */
        async function addUser(trx, username, publicKey) {
            /** @type {typeof TeqFw_User_Back_Store_RDb_Schema_User.ATTR} */
            const ATTR = metaUser.getAttributes();
            const data = metaUser.createDto();
            data.username = username.trim().toLowerCase();
            data.key_pub = publicKey;
            const pk = await crud.create(trx, metaUser, data);
            return pk[ATTR.ID];
        }

        /**
         * @param {TeqFw_Db_Back_RDb_ITrans} trx
         * @param {number} userId
         * @param {number} parentId
         * @return {Promise<void>}
         */
        async function addUserTree(trx, userId, parentId) {
            /** @type {Fl32_Dup_Back_Store_RDb_Schema_User_Tree.Dto} */
            const dto = metaUserTree.createDto();
            dto.user_ref = userId;
            dto.parent_ref = parentId ?? userId;
            await crud.create(trx, metaUserTree, dto);
        }

        // MAIN FUNCTIONALITY
        const userId = await addUser(trx, nick, keyPub);
        // add Web Push subscription
        const {code} = await actSubscriptAdd({trx, userId, endpoint, auth: keyAuth, p256dh: keyP256dh});
        if (
            (code !== SUB_ADD_CODE.SUCCESS) &&
            (code !== SUB_ADD_CODE.DUPLICATE)
        ) throw new Error('Cannot add web push subscription for new user.')
        // add app related data
        const parentIdChecked = parentId ?? userId;
        await addUserTree(trx, userId, parentIdChecked);
        return {userId};
    }

    // MAIN FUNCTIONALITY
    Object.defineProperty(act, 'name', {value: `${NS}.act`});
    return act;
}
