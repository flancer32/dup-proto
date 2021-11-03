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

    // DEFINE WORKING VARS
    const template = `
<layout-base>
<sworker/>
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
        components: {sworker},
        data() {
            return {};
        },
        methods: {},
        async mounted() { },
    };
}
