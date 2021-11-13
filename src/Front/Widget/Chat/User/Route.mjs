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


    // DEFINE WORKING VARS
    const template = `
<layout-chat>
    Contact ID: {{id}}
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
        components: {},
        data() {
            return {};
        },
        props: {
            id: Number,
        },
        computed: {
            contactName() {

            }
        },
        methods: {},
        async mounted() { },
    };
}
