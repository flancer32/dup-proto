/**
 * Plugin initialization function.
 */
// MODULE'S VARS
const NS = 'Fl32_Dup_Back_Plugin_Init';

export default function Factory(spec) {
    // EXTRACT DEPS
    /** @type {Fl32_Dup_Back_Defaults} */
    const DEF = spec['Fl32_Dup_Back_Defaults$'];
    /** @type {TeqFw_Di_Shared_Container} */
    const container = spec['TeqFw_Di_Shared_Container$'];
    /** @type {TeqFw_Core_Back_Config} */
    const config = spec['TeqFw_Core_Back_Config$'];
    /** @type {TeqFw_Db_Back_RDb_Connect} */ // use interface as implementation
    const conn = spec['TeqFw_Db_Back_RDb_IConnect$'];

    // ENCLOSED FUNCTIONS
    async function init() {
        // ENCLOSED FUNCTIONS
        /**
         * Get local configuration and initialize DB connection.
         * Place connection object as 'TeqFw_Db_Back_RDb_IConnect' singleton to DI-container.
         *
         * @return {Promise<void>}
         */
        async function initDb() {
            /** @type {Fl32_Dup_Back_Dto_Config_Local} */
            const cfg = config.getLocal(DEF.SHARED.NAME);
            await conn.init(cfg.db);
        }

        // MAIN
        await initDb();
        // TODO: just create processes
        // run initialization synchronously to prevent doubling of singletons
        await container.get('Fl32_Dup_Back_Proc_Hollow_State_Request$');
        await container.get('Fl32_Dup_Back_Proc_Msg_Queue$');
        await container.get('Fl32_Dup_Back_Proc_User_Invite_Create$');
        await container.get('Fl32_Dup_Back_Proc_User_Invite_Validate$');
        await container.get('Fl32_Dup_Back_Proc_User_SignUp$');
    }

    // MAIN
    Object.defineProperty(init, 'name', {value: `${NS}.${init.name}`});
    return init;
}

// finalize code components for this es6-module
Object.defineProperty(Factory, 'name', {value: `${NS}.${Factory.name}`});
