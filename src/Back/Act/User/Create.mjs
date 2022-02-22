/**
 * Register new 'user' in RDB.
 *
 * @namespace Fl32_Dup_Back_Act_User_Create
 */
// MODULE'S VARS
const NS = 'Fl32_Dup_Back_Act_User_Create';

// MODULE'S FUNCTIONS
export default function (spec) {
    // DEPS
    /** @type {TeqFw_Db_Back_Api_RDb_ICrudEngine} */
    const crud = spec['TeqFw_Db_Back_Api_RDb_ICrudEngine$'];
    /** @type {Fl32_Dup_Back_Store_RDb_Schema_User_Tree} */
    const idbTree = spec['Fl32_Dup_Back_Store_RDb_Schema_User_Tree$'];


    // FUNCS
    /**
     * @param {TeqFw_Db_Back_RDb_ITrans} trx
     * @param {number} frontId
     * @param {number|null} parentId
     * @return {Promise<{success:boolean}>}
     * @memberOf Fl32_Dup_Back_Act_User_Create
     */
    async function act({trx, frontId, parentId}) {
        // FUNCS

        /**
         * @param {TeqFw_Db_Back_RDb_ITrans} trx
         * @param {number} frontId
         * @param {number} parentId
         * @return {Promise<void>}
         */
        async function addUserTree(trx, frontId, parentId) {
            /** @type {Fl32_Dup_Back_Store_RDb_Schema_User_Tree.Dto} */
            const dto = idbTree.createDto();
            dto.front_ref = frontId;
            dto.parent_ref = parentId;
            await crud.create(trx, idbTree, dto);
        }

        // MAIN
        parentId = parentId ?? frontId;
        await addUserTree(trx, frontId, parentId);
        return {success: true};
    }

    // MAIN
    Object.defineProperty(act, 'namespace', {value: `${NS}.act`});
    return act;
}
