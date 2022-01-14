/**
 * 'Home' route.
 *
 * @namespace Fl32_Dup_Front_Widget_Home_Route
 */
// MODULE'S VARS
const NS = 'Fl32_Dup_Front_Widget_Home_Route';

// MODULE'S FUNCTIONS
/**
 * Factory to create template for new Vue component instances.
 *
 * @returns {Fl32_Dup_Front_Widget_Home_Route.vueCompTmpl}
 */
export default function (spec) {
    /** @type {Fl32_Dup_Front_Defaults} */
    const DEF = spec['Fl32_Dup_Front_Defaults$'];
    /** @type {Fl32_Dup_Front_DSource_User_Profile} */
    const dsProfile = spec['Fl32_Dup_Front_DSource_User_Profile$'];
    /** @type {Fl32_Dup_Front_Rx_Led} */
    const _led = spec['Fl32_Dup_Front_Rx_Led$'];
    /** @type {TeqFw_Web_Front_App_Connect_Event_Reverse} */
    const eventStreamReverse = spec['TeqFw_Web_Front_App_Connect_Event_Reverse$'];

    // WORKING VARS
    /** @type {typeof Fl32_Dup_Front_Rx_Led.STATE} */
    const STATES = _led.getStates();
    const template = `
<layout-base>
    <div class="row justify-center items-center" style="height: calc(100vh - 100px)">

        <q-card class="bg-white q-mt-xs col text-center" style="max-width:300px">
            <q-card-section class="text-subtitle1">
                <div>DUPLO is a secured messenger.</div>
                <div>Welcome to the hollow, {{name}}!</div>
            </q-card-section>
            <q-card-actions align="center" v-if="enableConnect">
                <q-btn :label="$t('btn.connect')" padding="xs lg" v-on:click="connect"></q-btn>
            </q-card-actions>
        </q-card>

    </div>
</layout-base>
`;
    /**
     * Template to create new component instances using Vue.
     *
     * @const {Object} vueCompTmpl
     * @memberOf Fl32_Dup_Front_Widget_Home_Route
     */
    return {
        teq: {package: DEF.SHARED.NAME},
        name: NS,
        template,
        components: {},
        data() {
            return {
                name: null
            };
        },
        computed: {
            enableConnect: () => _led.getRef().value === STATES.NET_OK,
        },
        methods: {
            connect() {
                eventStreamReverse.open();
            }
        },
        async mounted() {
            const user = await dsProfile.get();
            this.name = user?.username;
        }
    };
}
