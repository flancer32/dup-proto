/**
 * 'Configuration' route.
 *
 * @namespace Fl32_Dup_Front_Widget_Cfg_Route
 */
// MODULE'S VARS
const NS = 'Fl32_Dup_Front_Widget_Cfg_Route';

// MODULE'S FUNCTIONS
/**
 * Factory to create template for new Vue component instances.
 *
 * @returns {Fl32_Dup_Front_Widget_Cfg_Route.vueCompTmpl}
 */
export default function (spec) {
    /** @type {Fl32_Dup_Front_Defaults} */
    const DEF = spec['Fl32_Dup_Front_Defaults$'];
    /** @type {Fl32_Dup_Front_Widget_Cfg_SWorker.vueCompTmpl} */
    const sworker = spec['Fl32_Dup_Front_Widget_Cfg_SWorker$'];
    /** @type {Fl32_Dup_Front_Widget_Cfg_Store.vueCompTmpl} */
    const store = spec['Fl32_Dup_Front_Widget_Cfg_Store$'];
    /** @type {Fl32_Dup_Front_Widget_Cfg_SSE.vueCompTmpl} */
    const sse = spec['Fl32_Dup_Front_Widget_Cfg_SSE$'];

    // DEFINE WORKING VARS
    const template = `
<layout-base>
    <sse/>
    <sworker/>
    <store/>
</layout-base>
`;
    /**
     * Template to create new component instances using Vue.
     *
     * @const {Object} vueCompTmpl
     * @memberOf Fl32_Dup_Front_Widget_Cfg_Route
     */
    return {
        teq: {package: DEF.SHARED.NAME},
        name: NS,
        template,
        components: {store, sse, sworker},
        data() {
            return {};
        },
        methods: {},
        async mounted() { },
    };
}
