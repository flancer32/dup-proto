/**
 * Plugin initialization function.
 */
// MODULE'S VARS
const NS = 'Fl32_Dup_Back_Plugin_Init';

export default function Factory(spec) {
    // DEPS
    /** @type {Fl32_Dup_Back_Defaults} */
    const DEF = spec['Fl32_Dup_Back_Defaults$'];
    /** @type {TeqFw_Di_Shared_Container} */
    const container = spec['TeqFw_Di_Shared_Container$'];
    /** @type {TeqFw_Core_Back_Config} */
    const config = spec['TeqFw_Core_Back_Config$'];
    /** @type {TeqFw_Core_Shared_Api_ILogger} */
    const logger = spec['TeqFw_Core_Shared_Api_ILogger$$']; // instance
    /** @type {TeqFw_Db_Back_RDb_Connect} */ // use interface as implementation
    const conn = spec['TeqFw_Db_Back_RDb_IConnect$'];
    /** @type {TeqFw_Db_Back_Api_RDb_ICrudEngine} */
    const crud = spec['TeqFw_Db_Back_Api_RDb_ICrudEngine$'];
    /** @type {TeqFw_Web_Back_Store_RDb_Schema_Front} */
    const rdbFront = spec['TeqFw_Web_Back_Store_RDb_Schema_Front$'];
    /** @type {Fl32_Dup_Back_Proc_RDb_Init.process|function} */
    const procDbInit = spec['Fl32_Dup_Back_Proc_RDb_Init$'];

    // FUNCS
    async function init() {
        // FUNCS
        /**
         * Get local configuration and initialize DB connection.
         * Place connection object as 'TeqFw_Db_Back_RDb_IConnect' singleton to DI-container.
         *
         * @return {Promise<void>}
         */
        async function initDb() {
            // FUNCS
            async function schemaExists() {
                let res = false;
                const trx = await conn.startTransaction();
                try {
                    // read one record from 'front' table
                    await crud.readSet(trx, rdbFront, null, null, null, 1);
                    res = true; // if exception is not thrown
                    await trx.commit();
                } catch (error) {
                    await trx.rollback();
                }
                return res;
            }

            // MAIN
            /** @type {Fl32_Dup_Back_Dto_Config_Local} */
            const cfg = config.getLocal(DEF.SHARED.NAME);
            await conn.init(cfg.db);
            if (!await schemaExists()) {
                logger.info(`There is no tables in RDB. Creating new RDB schema.`);
                await procDbInit();
            }
        }

        // MAIN
        await initDb();
        // TODO: just create processes
        // run initialization synchronously to prevent doubling of singletons
        await container.get('Fl32_Dup_Back_Proc_Contact_Add_Bridge$');
        await container.get('Fl32_Dup_Back_Proc_Hollow_State$');
        await container.get('Fl32_Dup_Back_Proc_Msg_Read$');
        await container.get('Fl32_Dup_Back_Proc_Msg_Delivery$');
        await container.get('Fl32_Dup_Back_Proc_Msg_Post$');
        await container.get('Fl32_Dup_Back_Proc_WebPush_Enable$');
        await container.get('Fl32_Dup_Back_Proc_User_Invite_Create$');
        await container.get('Fl32_Dup_Back_Proc_User_Invite_Validate$');
        await container.get('Fl32_Dup_Back_Proc_User_SignUp$');
    }

    // MAIN
    logger.setNamespace(NS);
    Object.defineProperty(init, 'name', {value: `${NS}.${init.name}`});
    return init;
}

// finalize code components for this es6-module
Object.defineProperty(Factory, 'name', {value: `${NS}.${Factory.name}`});
