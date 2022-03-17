/**
 * Enable/disable logs transmitting to log monitoring server.
 *
 * @namespace Fl32_Dup_Back_Cli_Log_Monitor
 */
// MODULE'S IMPORT

// DEFINE WORKING VARS
const NS = 'Fl32_Dup_Back_Cli_Log_Monitor';
const OPT_DISABLE = 'disable';

// DEFINE MODULE'S FUNCTIONS
/**
 * Factory to create CLI command.
 *
 * @param {TeqFw_Di_Shared_SpecProxy} spec
 * @returns {TeqFw_Core_Back_Api_Dto_Command}
 * @constructor
 * @memberOf Fl32_Dup_Back_Cli_Log_Monitor
 */
export default function Factory(spec) {
    // DEPS
    /** @type {Fl32_Dup_Back_Defaults} */
    const DEF = spec['Fl32_Dup_Back_Defaults$'];
    /** @type {TeqFw_Core_Shared_Api_ILogger} */
    const logger = spec['TeqFw_Core_Shared_Api_ILogger$$']; // instance
    /** @type {TeqFw_Db_Back_RDb_IConnect} */
    const conn = spec['TeqFw_Db_Back_RDb_IConnect$'];
    /** @type {TeqFw_Core_Back_Api_Dto_Command.Factory} */
    const fCommand = spec['TeqFw_Core_Back_Api_Dto_Command#Factory$'];
    /** @type {TeqFw_Core_Back_Api_Dto_Command_Option.Factory} */
    const fOpt = spec['TeqFw_Core_Back_Api_Dto_Command_Option#Factory$'];
    /** @type {Fl32_Dup_Back_Proc_RDb_Init.process|function} */
    const procDbInit = spec['Fl32_Dup_Back_Proc_RDb_Init$'];

    // MAIN
    logger.setNamespace(NS);

    // FUNCS
    /**
     * Command action.
     * @returns {Promise<void>}
     * @memberOf Fl32_Dup_Back_Cli_Log_Monitor
     */
    async function action(opts) {
        const testData = opts[OPT_DISABLE];
        // recreate DB structure
        await procDbInit();
        if (testData) {
            // TODO: add test data to DB here
        }
        await conn.disconnect();
    }

    Object.defineProperty(action, 'namespace', {value: NS});

    // COMPOSE RESULT
    const res = fCommand.create();
    res.realm = DEF.CLI_PREFIX;
    res.name = 'log-monitor';
    res.desc = 'enable/disable logs transmitting to log monitoring server.';
    res.action = action;
    // add option --test-data
    const optTest = fOpt.create();
    optTest.flags = `-d, --${OPT_DISABLE}`;
    optTest.description = `fill DB with test data (for development).`;
    res.opts.push(optTest);
    return res;
}
