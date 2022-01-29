/**
 * Root route for user & room chats.
 *
 * @namespace Fl32_Dup_Front_Widget_Chat_Route
 */
// MODULE'S VARS
const NS = 'Fl32_Dup_Front_Widget_Chat_Route';

// MODULE'S FUNCTIONS
/**
 * Factory to create template for new Vue component instances.
 *
 * @returns {Fl32_Dup_Front_Widget_Chat_Route.vueCompTmpl}
 */
export default function (spec) {
    /** @type {Fl32_Dup_Front_Defaults} */
    const DEF = spec['Fl32_Dup_Front_Defaults$'];
    /** @type {Fl32_Dup_Front_Rx_Chat_Current} */
    const rxChat = spec['Fl32_Dup_Front_Rx_Chat_Current$'];
    /** @type {Fl32_Dup_Front_Mod_Chat_User} */
    const modUser = spec['Fl32_Dup_Front_Mod_Chat_User$'];

    // WORKING VARS
    const template = `
<layout-chat>
    <router-view></router-view>
</layout-chat>
`;
    /**
     * Template to create new component instances using Vue.
     *
     * @const {Object} vueCompTmpl
     * @memberOf Fl32_Dup_Front_Widget_Chat_Route
     */
    return {
        teq: {package: DEF.SHARED.NAME},
        name: NS,
        template,
        components: {},
        data() {
            return {};
        },
        props: {
            id: String, // deprecated
        },
        methods: {
            async switchCard() {
                // deprecated
                // const found = await modUser.getCard(this.id);
                // if (found) {
                //     rxChat.setTypeUser();
                //     rxChat.setBandId(found.id);
                //     rxChat.setTitle(found.nick);
                // }
            }
        },
        watch: {
            async id(current, old) {
                // deprecated
                // load card data on user changing
                // if (current !== old) {
                //     await this.switchCard();
                // }
            }
        },
        async mounted() {
            // TODO: what this widget does??? This is up level widget for route hierarchy
            // TODO: it should give integrated report for all bands
            // load card data on the first entry to the route
            // await this.switchCard();
        },
    };
}
