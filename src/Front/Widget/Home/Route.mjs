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

    // WORKING VARS
    const template = `
<layout-base>
<div class="fit column q-gutter-md q-pa-md" style="max-width: 480px">
  <conversation v-for="(one) in bands"  :item="one" />
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
        components: {conversation},
        data() {
            return {
                name: null,
                bands: [],
            };
        },
        async mounted() {
            const profile = await modProfile.get();
            this.name = profile?.nick;
            this.bands = await modBands.load();

        }
    };
}
