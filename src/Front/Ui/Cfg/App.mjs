/**
 * Front application configuration UI component.
 *
 * @namespace Fl32_Dup_Front_Ui_Cfg_App
 */
// MODULE'S VARS
const NS = 'Fl32_Dup_Front_Ui_Cfg_App';

// MODULE'S FUNCTIONS
/**
 * TeqFW DI factory function to get dependencies for the object.
 *
 * @returns {Fl32_Dup_Front_Ui_Cfg_App.vueCompTmpl}
 */
export default function (spec) {
    /** @type {Fl32_Dup_Front_Defaults} */
    const DEF = spec['Fl32_Dup_Front_Defaults$'];
    /** @type {TeqFw_Web_Front_Mod_Sw_Control} */
    const modSwControl = spec['TeqFw_Web_Front_Mod_Sw_Control$'];
    /** @type {TeqFw_Web_Push_Front_Mod_Subscription} */
    const modSubscript = spec['TeqFw_Web_Push_Front_Mod_Subscription$'];
    /** @type {Fl32_Dup_Front_Mod_Log_Monitor} */
    const modLogMonitor = spec['Fl32_Dup_Front_Mod_Log_Monitor$'];
    /** @type {TeqFw_Web_Front_Mod_Logger_Transport} */
    const modLogTrn = spec['TeqFw_Core_Shared_Api_Logger_ITransport$']; // as interface

    // VARS
    const template = `
<q-card class="bg-white q-mt-xs" style="min-width: 300px">
    <q-card-section>
        <div class="text-subtitle2">{{$t('wg.cfg.app.title')}}:</div>
        <div>
            <q-toggle
                    :disable="freezeToggleLog"
                    :label="$t('wg.cfg.app.log')"
                    color="green"
                    v-model="enabledLog"
                    v-on:click="processToggledLog"
            />
        </div>
        <div>
            <q-toggle
                    :disable="freezeToggleWp"
                    :label="$t('wg.cfg.app.wp')"
                    color="green"
                    v-model="enabledWp"
                    v-on:click="processToggledWp"
            />
        </div>
        <div>
            <q-toggle
                    :disable="freezeToggleSw"
                    :label="$t('wg.cfg.app.swCache')"
                    color="green"
                    v-model="enabledCache"
                    v-on:click="processToggledSw"
            />
        </div>
        <div class="q-gutter-xs">
            <q-btn :label="$t('wg.cfg.app.btn.clean')" color="primary" v-on:click="cacheClean"></q-btn>
            <q-btn :label="$t('wg.cfg.app.btn.uninstall')" color="primary" v-on:click="uninstall"></q-btn>
        </div>
    </q-card-section>
</q-card>
`;
    /**
     * Template to create new component instances using Vue.
     *
     * @const {Object} vueCompTmpl
     * @memberOf Fl32_Dup_Front_Ui_Cfg_App
     */
    return {
        teq: {package: DEF.SHARED.NAME},
        name: NS,
        template,
        data() {
            return {
                canSubscribe: null,
                enabledCache: null,
                enabledLog: null,
                enabledWp: null,
                freezeToggleSw: false,
                freezeToggleWp: false,
            };
        },
        methods: {
            async cacheClean() {
                await modSwControl.cacheClean();
            },
            async processToggledLog() {
                await modLogMonitor.set(this.enabledLog);
                if (this.enabledLog) modLogTrn.enableLogs();
                else modLogTrn.disableLogs();
            },
            async processToggledSw() {
                this.freezeToggleSw = true;
                const oldVal = !this.enabledCache;
                if (oldVal) {
                    await modSwControl.setCacheStatus(false);
                } else {
                    await modSwControl.setCacheStatus(true);
                }
                this.enabledCache = await modSwControl.getCacheStatus();
                this.freezeToggleSw = false;
            },
            async processToggledWp() {
                this.freezeToggle = true;
                const oldVal = !this.enabledWp;
                if (oldVal) {
                    await modSubscript.unsubscribe();
                    this.enabledWp = await modSubscript.hasSubscription();
                } else {
                    this.enabledWp = await modSubscript.subscribe();
                }
                this.freezeToggle = false;
            },
            async uninstall() {
                const sw = await navigator.serviceWorker.ready;
                await sw.unregister();
                location.reload();
            }
        },
        async mounted() {
            this.canSubscribe = await modSubscript.canSubscribe();
            this.enabledCache = await modSwControl.getCacheStatus();
            this.enabledWp = await modSubscript.hasSubscription();
            this.enabledLog = await modLogMonitor.get();
        },
    };
}
