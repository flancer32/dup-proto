/**
 * Handle events related to admin commands.
 */
export default class Fl32_Dup_Front_Hand_Admin_Command {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Web_Event_Front_Mod_Bus} */
        const eventsFront = spec['TeqFw_Web_Event_Front_Mod_Bus$'];
        /** @type {Fl32_Dup_Shared_Event_Back_Admin_Command_Log_State} */
        const esbLogState = spec['Fl32_Dup_Shared_Event_Back_Admin_Command_Log_State$'];
        /** @type {Fl32_Dup_Front_Widget_Admin_Route} */
        const wgAdmin = spec['Fl32_Dup_Front_Widget_Admin_Route$'];

        // MAIN
        eventsFront.subscribe(esbLogState.getEventName(), onLogState);

        // FUNCS
        /**
         * @param {Fl32_Dup_Shared_Event_Back_Admin_Command_Log_State.Dto} data
         * @param {TeqFw_Web_Event_Shared_Dto_Event_Meta.Dto} meta
         */
        async function onLogState({data, meta}) {
            wgAdmin.get()?.setLogsBackMonitorState(data.enabled);
        }

    }
}
