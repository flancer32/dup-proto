/**
 *  Configuration widgets for Server Side Events connector.
 *
 * @namespace Fl32_Dup_Front_Widget_Cfg_SSE
 */
// MODULE'S VARS
const NS = 'Fl32_Dup_Front_Widget_Cfg_SSE';

// MODULE'S FUNCTIONS
/**
 * TeqFW DI factory function to get dependencies for the object.
 *
 * @returns {Fl32_Dup_Front_Widget_Cfg_SSE.vueCompTmpl}
 */
export default function (spec) {
    /** @type {Fl32_Dup_Front_Defaults} */
    const DEF = spec['Fl32_Dup_Front_Defaults$'];
    /** @type {Fl32_Dup_Front_Model_SSE_Connect_Manager} */
    const mgrSse = spec['Fl32_Dup_Front_Model_SSE_Connect_Manager$'];
    /** @type {Fl32_Dup_Front_Model_UI_Led} */
    const modLed = spec['Fl32_Dup_Front_Model_UI_Led$'];

    // DEFINE WORKING VARS
    const STATE = modLed.getStates();
    const template = `
<q-card class="bg-white q-mt-xs">
    <q-card-section>
        <div class="text-subtitle2">{{$t('wg.cfg.sse.title')}}:</div> 
         <div class="q-gutter-xs">
            <q-btn :label="$t('wg.cfg.sse.open')" color="primary" :disable="openDisabled" v-on:click="open"></q-btn>
            <q-btn :label="$t('wg.cfg.sse.close')" color="primary" :disable="closeDisabled" v-on:click="close"></q-btn>
        </div>
    </q-card-section>
</q-card>
`;
    /**
     * Template to create new component instances using Vue.
     *
     * @const {Object} vueCompTmpl
     * @memberOf Fl32_Dup_Front_Widget_Cfg_SSE
     */
    return {
        teq: {package: DEF.SHARED.NAME},
        name: NS,
        template,
        components: {},
        data() {
            return {};
        },
        computed: {
            closeDisabled() {
                const state = modLed.getRef().value;
                return (state !== STATE.SERVER_OK);
            },
            openDisabled() {
                const state = modLed.getRef().value;
                return (state === STATE.SERVER_OK);
            }
        },
        methods: {
            async close() {
                await mgrSse.close();
            },
            async open() {
                await mgrSse.open();
            }
        },
        async mounted() {

        },
    };
}
