/**
 * Service worker configuration UI component.
 *
 * @namespace Fl32_Dup_Front_Ui_Cfg_SWorker
 */
// MODULE'S VARS
const NS = 'Fl32_Dup_Front_Ui_Cfg_SWorker';

// MODULE'S FUNCTIONS
/**
 * TeqFW DI factory function to get dependencies for the object.
 *
 * @returns {Fl32_Dup_Front_Ui_Cfg_SWorker.vueCompTmpl}
 */
export default function (spec) {
    /** @type {Fl32_Dup_Front_Defaults} */
    const DEF = spec['Fl32_Dup_Front_Defaults$'];
    /** @type {TeqFw_Web_Front_Mod_Sw_Control} */
    const swControl = spec['TeqFw_Web_Front_Mod_Sw_Control$'];

    // VARS
    const template = `
<q-card class="bg-white q-mt-xs" style="min-width: 300px">
    <q-card-section>
        <div class="text-subtitle2">{{$t('wg.cfg.sw.title')}}:</div> 
        <q-toggle
            :disable="freezeToggle"
            :label="$t('wg.cfg.sw.cache')"
            color="green"
            v-model="cacheEnabled"
            v-on:click="processToggled"
        />
        <div class="q-gutter-xs">
            <q-btn :label="$t('wg.cfg.sw.btn.clean')" color="primary" v-on:click="cacheClean"></q-btn>
            <q-btn :label="$t('wg.cfg.sw.btn.uninstall')" color="primary" v-on:click="uninstall"></q-btn>
        </div>
<!--<div class="q-gutter-xs">
    <q-btn :label="$t('btn.disable')" v-if="cacheEnabled" color="primary" v-on:click="cacheDisable"></q-btn>
    <q-btn :label="$t('btn.enable')" v-if="!cacheEnabled" color="primary" v-on:click="cacheEnable"></q-btn>
    <q-btn dense flat round icon="lens" size="8.5px" :color="color" />
</div>        -->
    </q-card-section>
</q-card>
`;
    /**
     * Template to create new component instances using Vue.
     *
     * @const {Object} vueCompTmpl
     * @memberOf Fl32_Dup_Front_Ui_Cfg_SWorker
     */
    return {
        teq: {package: DEF.SHARED.NAME},
        name: NS,
        template,
        data() {
            return {
                freezeToggle: false,
                cacheEnabled: null
            };
        },
        methods: {
            async cacheDisable() {
                await swControl.setCacheStatus(false);
                this.cacheEnabled = await swControl.getCacheStatus();
            },
            async cacheEnable() {
                await swControl.setCacheStatus(true);
                this.cacheEnabled = await swControl.getCacheStatus();
            },
            async cacheClean() {
                await swControl.cacheClean();
            },
            async processToggled() {
                this.freezeToggle = true;
                const oldVal = !this.cacheEnabled;
                if (oldVal) {
                    await swControl.setCacheStatus(false);
                } else {
                    await swControl.setCacheStatus(true);
                }
                this.cacheEnabled = await swControl.getCacheStatus();
                this.freezeToggle = false;
            },
            async uninstall() {
                const sw = await navigator.serviceWorker.ready;
                await sw.unregister();
                debugger
                location.reload();
            }
        },
        async mounted() {
            this.cacheEnabled = await swControl.getCacheStatus();
        },
    };
}
