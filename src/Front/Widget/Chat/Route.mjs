/**
 * 'Chat' route.
 *
 * @namespace Fl32_Dup_Front_Widget_Chat_Route
 */
// MODULE'S VARS
const NS = 'Fl32_Dup_Front_Widget_Chat_Route';

// MODULE'S FUNCTIONS
/**
 * Factory to create template for new Vue component instances.
 *
 * @memberOf Fl32_Dup_Front_Widget_Chat_Route
 * @returns {Fl32_Dup_Front_Widget_Chat_Route.vueCompTmpl}
 */
export default function Factory(spec) {
    /** @type {Fl32_Dup_Front_Defaults} */
    const DEF = spec['Fl32_Dup_Front_Defaults$'];


    // DEFINE WORKING VARS
    const template = `
<layout-chat>
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
        methods: {},
        async mounted() { },
    };
}

// finalize code components for this es6-module
Object.defineProperty(Factory, 'name', {value: `${NS}.Factory`});
