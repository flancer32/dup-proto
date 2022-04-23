/**
 * Handler for admin command (from the first only).
 *
 * @namespace Fl32_Dup_Back_Hand_Admin_Command
 */
export default class Fl32_Dup_Back_Hand_Admin_Command {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Core_Shared_Api_ILogger} */
        const logger = spec['TeqFw_Core_Shared_Api_ILogger$$']; // instance
        /** @type {TeqFw_Db_Back_RDb_IConnect} */
        const rdb = spec['TeqFw_Db_Back_RDb_IConnect$'];
        /** @type {TeqFw_Core_Back_Mod_Event_Bus} */
        const eventsBack = spec['TeqFw_Core_Back_Mod_Event_Bus$'];
        /** @type {TeqFw_Web_Event_Back_Mod_Server_Handler_Reverse_Portal} */
        const portalFront = spec['TeqFw_Web_Event_Back_Mod_Server_Handler_Reverse_Portal$'];
        /** @type {Fl32_Dup_Shared_Event_Front_Admin_Command} */
        const esfCmd = spec['Fl32_Dup_Shared_Event_Front_Admin_Command$'];
        /** @type {Fl32_Dup_Shared_Event_Back_Admin_Command_Log_State} */
        const esbCmdLogState = spec['Fl32_Dup_Shared_Event_Back_Admin_Command_Log_State$'];
        /** @type {TeqFw_Web_Back_Act_Front_GetIdByUuid.act|function} */
        const actGetId = spec['TeqFw_Web_Back_Act_Front_GetIdByUuid$'];
        /** @type {Fl32_Dup_Back_Mod_Logger_Transport} */
        const modLogTrn = spec['TeqFw_Core_Shared_Api_Logger_ITransport$']; // as interface
        /** @type {typeof Fl32_Dup_Shared_Event_Front_Admin_Command.COMMAND} */
        const COMMAND = spec['Fl32_Dup_Shared_Event_Front_Admin_Command.COMMAND$'];

        // MAIN
        logger.setNamespace(this.constructor.name);
        eventsBack.subscribe(esfCmd.getEventName(), onRequest)

        // FUNCS
        /**
         * @param {Fl32_Dup_Shared_Event_Front_Admin_Command.Dto} data
         * @param {TeqFw_Web_Event_Shared_Dto_Event_Meta.Dto} meta
         * @return {Promise<void>}
         */
        async function onRequest({data, meta}) {
            // FUNCS
            function cmdLogDisable(uuid) {
                modLogTrn.disableLogs();
                cmdLogState(uuid);
            }

            function cmdLogEnable(uuid) {
                modLogTrn.enableLogs();
                cmdLogState(uuid);
            }

            function cmdLogState(uuid) {
                const event = esbCmdLogState.createDto();
                event.meta.frontUUID = uuid;
                event.data.enabled = modLogTrn.isLogsMonitorOn();
                portalFront.publish(event);
            }

            // MAIN
            const trx = await rdb.startTransaction();
            try {
                const uuid = meta.frontUUID;
                const {id: frontId} = await actGetId({trx, uuid});
                if (frontId === 1) { // the first user only can send commands
                    const cmd = data.command;
                    logger.info(`Admin command ${cmd} is received.`, meta);
                    if (cmd === COMMAND.LOG_ENABLE) cmdLogEnable(uuid);
                    else if (cmd === COMMAND.LOG_DISABLE) cmdLogDisable(uuid);
                    else if (cmd === COMMAND.LOG_STATE) cmdLogState(uuid);
                    logger.info(`Admin command ${cmd} is processed.`, meta);
                } else logger.error(`The first user only can be an admin.`, meta);
                await trx.commit();
            } catch (error) {
                await trx.rollback();
                logger.error(error);
            }
        }
    }
}
