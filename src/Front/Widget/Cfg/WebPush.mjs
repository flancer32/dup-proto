/**
 * Configure subscription to Web Push notification.
 *
 * @namespace Fl32_Dup_Front_Widget_Cfg_WebPush
 */
// MODULE'S VARS
const NS = 'Fl32_Dup_Front_Widget_Cfg_WebPush';

// MODULE'S FUNCTIONS
/**
 * TeqFW DI factory function to get dependencies for the object.
 *
 * @returns {Fl32_Dup_Front_Widget_Cfg_WebPush.vueCompTmpl}
 */
export default function (spec) {
    /** @type {Fl32_Dup_Front_Defaults} */
    const DEF = spec['Fl32_Dup_Front_Defaults$'];
    /** @type {TeqFw_Web_Push_Front_Mod_Subscription} */
    const modSubscript = spec['TeqFw_Web_Push_Front_Mod_Subscription$'];

    // VARS
    const template = `
<q-card class="q-mt-xs" v-if="canSubscribe">
    <q-card-section class="q-gutter-sm">
        <div class="text-subtitle2">{{ $t('wg.cfg.wp.title') }}:</div>
        <q-btn :label="$t('btn.disable')" v-if="wpEnabled" color="primary" v-on:click="wpDisable"></q-btn>
        <q-btn :label="$t('btn.enable')" v-if="!wpEnabled" color="primary" v-on:click="wpEnable"></q-btn>
        <q-btn dense flat round icon="lens" size="8.5px" :color="color"/>
    </q-card-section>
</q-card>
`;
    /**
     * Template to create new component instances using Vue.
     *
     * @const {Object} vueCompTmpl
     * @memberOf Fl32_Dup_Front_Widget_Cfg_WebPush
     */
    return {
        teq: {package: DEF.SHARED.NAME},
        name: NS,
        template,
        data() {
            return {
                canSubscribe: false,
                freezeSubscribe: false,
                wpEnabled: false,
            };
        },
        computed: {
            color() {
                return (this.wpEnabled) ? 'green' : 'grey';
            }
        },
        methods: {
            async wpDisable() {
                this.freezeSubscribe = true;
                await modSubscript.unsubscribe();
                this.wpEnabled = await modSubscript.hasSubscription();
                this.freezeSubscribe = false;
            },
            async wpEnable() {
                this.freezeSubscribe = true;
                this.wpEnabled = await modSubscript.subscribe();
                this.freezeSubscribe = false;
            },
        },
        async mounted() {
            this.canSubscribe = await modSubscript.canSubscribe();
            this.wpEnabled = await modSubscript.hasSubscription();
        }
    };
}
