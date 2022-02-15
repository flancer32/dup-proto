/**
 * Action to re-create database structure (drop-create tables).
 *
 * @namespace Fl32_Dup_Back_Cli_Db_Z_Restruct
 */
// MODULE'S IMPORT

// DEFINE WORKING VARS
const NS = 'Fl32_Dup_Back_Cli_Db_Z_Restruct';

// DEFINE MODULE'S FUNCTIONS
/**
 * Factory to setup context and to create the action.
 *
 * @param {TeqFw_Di_Shared_SpecProxy} spec
 * @constructor
 * @memberOf Fl32_Dup_Back_Cli_Db_Z_Restruct
 */
export default function Factory(spec) {
    // PARSE INPUT & DEFINE WORKING VARS
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

    // MAIN
    logger.setNamespace(NS);

    // ENCLOSED FUNCS
    /**
     * Action to re-create database structure (drop-create tables).
     * @returns {Promise<void>}
     * @memberOf Fl32_Dup_Back_Cli_Db_Z_Restruct
     */
    async function action() {
        // load DEMs then drop/create all tables
        const path = config.getBoot().projectRoot;
        const {dem, cfg} = await demLoad.exec({path});
        await dbSchema.setDem({dem});
        await dbSchema.setCfg({cfg});
        await dbSchema.dropAllTables({conn});
        await dbSchema.createAllTables({conn});
        logger.info('Database structure is recreated.');
    }

    // COMPOSE RESULT
    Object.defineProperty(action, 'name', {value: `${NS}.action`});
    return action;
}


// finalize code components for this es6-module
Object.defineProperty(Factory, 'name', {value: `${NS}.Factory`});
