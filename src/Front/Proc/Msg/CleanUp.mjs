/**
 * Process to clean up messages in IDB. Each band should contain X messages only.
 * @see Fl32_Dup_Front_Dto_User.Dto
 * @namespace Fl32_Dup_Front_Proc_Msg_CleanUp
 */
// MODULE'S VARS
const NS = 'Fl32_Dup_Front_Proc_Msg_CleanUp';

// MODULE'S FUNCTIONS
export default function (spec) {
    // DEPS
    /** @type {TeqFw_Core_Shared_Api_ILogger} */
    const logger = spec['TeqFw_Core_Shared_Api_ILogger$$']; // instance
    /** @type {TeqFw_Web_Front_App_Store_IDB} */
    const idb = spec['Fl32_Dup_Front_Store_Db$'];
    /** @type {Fl32_Dup_Front_Store_Entity_Msg} */
    const idbMsg = spec['Fl32_Dup_Front_Store_Entity_Msg$'];
    /** @type {Fl32_Dup_Front_Mod_User_Profile} */
    const modProfile = spec['Fl32_Dup_Front_Mod_User_Profile$'];

    // VARS
    const I_MSG = idbMsg.getIndexes();

    // FUNCS

    /**
     * Clean up old messages in the given band.
     * @param {number} bandId
     * @return {Promise<void>}
     *
     * @memberOf Fl32_Dup_Front_Proc_Msg_CleanUp
     */
    async function process({bandId}) {
        // FUNCS
        async function getCount(trx, bandId) {
            const storeName = idbMsg.getEntityName();
            const store = trx.objectStore(storeName);
            const source = store.index(I_MSG.BY_BAND);
            const query = IDBKeyRange.bound([bandId, new Date(0)], [bandId, new Date()]);
            return await new Promise((resolve) => {
                const req = source.count(query);
                req.onsuccess = () => resolve(req.result);
            });
        }

        async function removeMessages(trx, count, threshold) {
            const toDelete = count - threshold;
            if (toDelete > 0) {
                const storeName = idbMsg.getEntityName();
                const store = trx.objectStore(storeName);
                const source = store.index(I_MSG.BY_BAND);
                const query = IDBKeyRange.bound([bandId, new Date(0)], [bandId, new Date()]);
                await new Promise((resolve) => {
                    const req = source.getAllKeys(query, toDelete);
                    req.onsuccess = async () => {
                        const keys = req.result;
                        for (const key of keys)
                            await idb.deleteOne(trx, idbMsg, key);
                        logger.info(`Total ${toDelete} messages were deleted for band #${bandId}.`);
                        resolve();
                    };

                })
            }
        }

        // MAIN
        const trx = await idb.startTransaction(idbMsg);
        let count = await getCount(trx, bandId);
        logger.info(`Total messaged for band #${bandId}: ${count}.`);
        const profile = await modProfile.get();
        await removeMessages(trx, count, profile.msgCleanupThreshold);
        await trx.commit();
    }

    // MAIN
    Object.defineProperty(process, 'namespace', {value: `${NS}.process`});
    logger.setNamespace(NS);
    return process;
}
