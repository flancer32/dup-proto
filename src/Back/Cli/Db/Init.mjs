/**
 * (Re)create RDB structure and fill it with test data (on demand).
 *
 * @namespace Fl32_Dup_Back_Cli_Db_Init
 */
// MODULE'S IMPORT

// DEFINE WORKING VARS
const NS = 'Fl32_Dup_Back_Cli_Db_Init';
const OPT_TEST = 'test';

// DEFINE MODULE'S FUNCTIONS
/**
 * Factory to create CLI command.
 *
 * @param {TeqFw_Di_Shared_SpecProxy} spec
 * @returns {TeqFw_Core_Back_Api_Dto_Command}
 * @constructor
 * @memberOf Fl32_Dup_Back_Cli_Db_Init
 */
export default function Factory(spec) {
    // DEPS
    /** @type {Fl32_Dup_Back_Defaults} */
    const DEF = spec['Fl32_Dup_Back_Defaults$'];
    /** @type {TeqFw_Core_Shared_Api_ILogger} */
    const logger = spec['TeqFw_Core_Shared_Api_ILogger$'];
    /** @type {TeqFw_Db_Back_RDb_IConnect} */
    const conn = spec['TeqFw_Db_Back_RDb_IConnect$'];
    /** @type {TeqFw_Core_Back_Api_Dto_Command.Factory} */
    const fCommand = spec['TeqFw_Core_Back_Api_Dto_Command#Factory$'];
    /** @type {TeqFw_Core_Back_Api_Dto_Command_Option.Factory} */
    const fOpt = spec['TeqFw_Core_Back_Api_Dto_Command_Option#Factory$'];
    /** @type {Fl32_Dup_Back_Cli_Db_Z_Restruct.action|function} */
    const actRestruct = spec['Fl32_Dup_Back_Cli_Db_Z_Restruct$'];

    // ENCLOSED FUNCS
    /**
     * Command action.
     * @returns {Promise<void>}
     * @memberOf Fl32_Dup_Back_Cli_Db_Init
     */
    async function action(opts) {
        // ENCLOSED FUNCS

        // MAIN
        // logger.pause(false);
        const testData = opts[OPT_TEST];
        // const trx = await conn.startTransaction();
        // recreate DB structure
        await actRestruct();
        if (testData) {
            // TODO: add test data to DB here
        }
        await conn.disconnect();
    }

    Object.defineProperty(action, 'name', {value: `${NS}.action`});

    // COMPOSE RESULT
    const res = fCommand.create();
    res.realm = DEF.CLI_PREFIX;
    res.name = 'db-init';
    res.desc = '(Re)create RDB structure and fill it with test data (on demand).';
    res.action = action;
    // add option --test-data
    const optTest = fOpt.create();
    optTest.flags = `-t, --${OPT_TEST}`;
    optTest.description = `fill DB with test data (for development).`;
    res.opts.push(optTest);
    return res;
}
