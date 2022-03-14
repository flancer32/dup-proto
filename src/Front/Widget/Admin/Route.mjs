import {COMMAND} from "../../../Shared/Event/Front/Admin/Command.mjs";

/**
 * 'Administrative' route.
 * TODO: should be standalone 'door' for this functionality
 *
 * @namespace Fl32_Dup_Front_Widget_Admin_Route
 */
// MODULE'S VARS
const NS = 'Fl32_Dup_Front_Widget_Admin_Route';

// MODULE'S INTERFACES
/**
 * @interface
 * @memberOf Fl32_Dup_Front_Widget_Admin_Route
 */
class IUiComp {
    /**
     * Reflect state of logs monitoring on backend.
     * @param {boolean} enabled
     */
    setLogsBackMonitorState(enabled) {}
}

// MODULE'S FUNCTIONS
/**
 * Factory to create template for new Vue component instances.
 *
 * @returns {Fl32_Dup_Front_Widget_Admin_Route.vueCompTmpl}
 */
export default function (spec) {
    /** @type {Fl32_Dup_Front_Defaults} */
    const DEF = spec['Fl32_Dup_Front_Defaults$'];
    /** @type {Fl32_Dup_Front_Rx_Title} */
    const rxTitle = spec['Fl32_Dup_Front_Rx_Title$'];
    /** @type {TeqFw_Web_Front_App_Connect_Event_Direct_Portal} */
    const portalBack = spec['TeqFw_Web_Front_App_Connect_Event_Direct_Portal$'];
    /** @type {Fl32_Dup_Shared_Event_Front_Admin_Command} */
    const esfCmd = spec['Fl32_Dup_Shared_Event_Front_Admin_Command$'];
    /** @type {typeof Fl32_Dup_Shared_Event_Front_Admin_Command.COMMAND} */
    const COMMAND = spec['Fl32_Dup_Shared_Event_Front_Admin_Command.COMMAND$'];
    /** @type {Fl32_Dup_Front_Ui_Admin_Route} */
    const wgAdmin = spec['Fl32_Dup_Front_Ui_Admin_Route$'];

    // DEFINE WORKING VARS
    const template = `
<layout-base>
    <q-card class="q-mt-xs">
        <q-card-section class="q-gutter-sm">
            <q-toggle
                :disable="freezeToggle"
                :label="$t('wg.admin.log.title')"
                color="green"
                v-model="logsBackMonitorEnabled"
                v-on:click="processToggled"
            />
            
        </q-card-section>
    </q-card>
</layout-base>
`;
    /**
     * Template to create new component instances using Vue.
     *
     * @const {Object} vueCompTmpl
     * @memberOf Fl32_Dup_Front_Widget_Admin_Route
     */
    return {
        teq: {package: DEF.SHARED.NAME},
        name: NS,
        template,
        components: {},
        data() {
            return {
                freezeToggle: false,
                logsBackMonitorEnabled: null,
            };
        },
        methods: {
            async processToggled() {
                this.freezeToggle = true;
                const oldVal = !this.logsBackMonitorEnabled;
                const event = esfCmd.createDto();
                if (oldVal) {
                    event.data.command = COMMAND.LOG_DISABLE;
                } else {
                    event.data.command = COMMAND.LOG_ENABLE;
                }
                await portalBack.publish(event);
                this.freezeToggle = false;
            },

            setLogsBackMonitorState(enabled) {
                this.logsBackMonitorEnabled = !!enabled;
            }
        },
        mounted() {
            wgAdmin.set(this);
            rxTitle.set(this.$t('wg.admin.title'));
            // get current log state
            const event = esfCmd.createDto();
            event.data.command = COMMAND.LOG_STATE;
            // noinspection JSIgnoredPromiseFromCall
            portalBack.publish(event);
        },
    };
}
