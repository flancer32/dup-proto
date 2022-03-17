/**
 * On-demand process to create tables in RDB.
 *
 * @namespace Fl32_Dup_Back_Proc_RDb_Init
 */
// MODULE'S VARS
const NS = 'Fl32_Dup_Back_Proc_RDb_Init';

// MODULE'S FUNCTIONS
export default function (spec) {
    // DEPS
    /** @type {TeqFw_Db_Back_RDb_IConnect} */
    const conn = spec['TeqFw_Db_Back_RDb_IConnect$'];
    /** @type {TeqFw_Core_Shared_Api_ILogger} */
    const logger = spec['TeqFw_Core_Shared_Api_ILogger$$']; // instance
    /** @type {TeqFw_Core_Back_Config} */
    const config = spec['TeqFw_Core_Back_Config$'];
    /** @type {TeqFw_Db_Back_Api_RDb_ISchema} */
    const dbSchema = spec['TeqFw_Db_Back_Api_RDb_ISchema$'];
    /** @type {TeqFw_Db_Back_Dem_Load} */
    const demLoad = spec['TeqFw_Db_Back_Dem_Load$'];

    // FUNCS
    /**
     * @return {Promise<void>}
     * @memberOf Fl32_Dup_Back_Proc_RDb_Init
     */
    async function process() {
        // load DEMs then drop/create all tables
        const path = config.getBoot().projectRoot;
        const {dem, cfg} = await demLoad.exec({path});
        await dbSchema.setDem({dem});
        await dbSchema.setCfg({cfg});
        await dbSchema.dropAllTables({conn});
        await dbSchema.createAllTables({conn});
        logger.info('Database structure is recreated.');
    }

    // MAIN
    logger.setNamespace(NS);
    Object.defineProperty(process, 'namespace', {value: NS});
    return process;
}
