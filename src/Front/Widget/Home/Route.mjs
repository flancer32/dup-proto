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
    /** @type {Fl32_Dup_Front_Mod_User_Profile} */
    const modProfile = spec['Fl32_Dup_Front_Mod_User_Profile$'];
    /** @type {Fl32_Dup_Front_Widget_Home_Conversation.vueCompTmpl} */
    const conversation = spec['Fl32_Dup_Front_Widget_Home_Conversation$'];
    /** @type {Fl32_Dup_Front_Mod_Home_Bands} */
    const modBands = spec['Fl32_Dup_Front_Mod_Home_Bands$'];
    /** @type {Fl32_Dup_Front_Rx_Title} */
    const rxTitle = spec['Fl32_Dup_Front_Rx_Title$'];

    // WORKING VARS
    const template = `
<layout-base>
    <q-scroll-area style="width:100%; height: calc(100vh - var(--dim-topBar-h)- var(--dim-bottomBar-h))"
    >
        <div class="column q-pa-xs q-gutter-xs">
            <conversation v-for="(one) in bands" :item="one"/>
        </div>

    </q-scroll-area>
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
        components: {conversation},
        data() {
            return {
                bands: [],
            };
        },
        async mounted() {
            const profile = await modProfile.get();
            rxTitle.set(profile?.nick);
            this.bands = await modBands.load();

        }
    };
}
