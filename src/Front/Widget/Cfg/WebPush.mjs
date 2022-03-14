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
<q-card class="q-mt-xs" style="min-width: 300px" v-if="canSubscribe">
    <q-card-section class="q-gutter-sm">
        <q-toggle
            :disable="freezeToggle"
            :label="$t('wg.cfg.wp.title')"
            color="green"
            v-model="wpEnabled"
            v-on:click="processToggled"
        />
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
                freezeToggle: false,
                wpEnabled: false,
            };
        },
        methods: {
            async processToggled() {
                this.freezeToggle = true;
                const oldVal = !this.wpEnabled;
                if (oldVal) {
                    await modSubscript.unsubscribe();
                    this.wpEnabled = await modSubscript.hasSubscription();
                } else {
                    this.wpEnabled = await modSubscript.subscribe();
                }
                this.freezeToggle = false;
            },
        },
        async mounted() {
            this.canSubscribe = await modSubscript.canSubscribe();
            this.wpEnabled = await modSubscript.hasSubscription();
        }
    };
}
