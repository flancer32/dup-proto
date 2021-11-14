/**
 * Route widget to chat with other user.
 *
 * @namespace Fl32_Dup_Front_Widget_Chat_User_Route
 */
// MODULE'S VARS
const NS = 'Fl32_Dup_Front_Widget_Chat_User_Route';

// MODULE'S FUNCTIONS
/**
 * TeqFW DI factory function to get dependencies for the object.
 *
 * @returns {Fl32_Dup_Front_Widget_Chat_User_Route.vueCompTmpl}
 */
export default function (spec) {
    /** @type {Fl32_Dup_Front_Defaults} */
    const DEF = spec['Fl32_Dup_Front_Defaults$'];
    /** @type {Fl32_Dup_Front_Widget_Chat_Msg_Band} */
    const msgBand = spec['Fl32_Dup_Front_Widget_Chat_Msg_Band$'];

    // DEFINE WORKING VARS
    const template = `
<layout-chat>
    <msg-band/>
</layout-chat>
`;
    /**
     * Template to create new component instances using Vue.
     *
     * @const {Object} vueCompTmpl
     * @memberOf Fl32_Dup_Front_Widget_Chat_User_Route
     */
    return {
        teq: {package: DEF.SHARED.NAME},
        name: NS,
        template,
        components: {msgBand},
        data() {
            return {};
        },
        props: {
            id: Number,
        },
        computed: {},
        methods: {},
        async mounted() { },
    };
}
