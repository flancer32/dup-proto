/**
 * Base layout widget.
 *
 * @namespace Fl32_Dup_Front_Layout_Base
 */
// MODULE'S VARS
const NS = 'Fl32_Dup_Front_Layout_Base';

// MODULE'S FUNCTIONS
/**
 * Factory to create template for new Vue component instances.
 *
 * @memberOf Fl32_Dup_Front_Layout_Base
 * @returns {Fl32_Dup_Front_Layout_Base.vueCompTmpl}
 */
export default function Factory(spec) {
    // EXTRACT DEPS
    /** @type {Fl32_Dup_Front_Defaults} */
    const DEF = spec['Fl32_Dup_Front_Defaults$'];

    // DEFINE WORKING VARS
    const template = `
OP! Layout
`;

    // COMPOSE RESULT
    /**
     * Template to create new component instances using Vue.
     *
     * @const {Object} vueCompTmpl
     * @memberOf Fl32_Dup_Front_Layout_Base
     */
    return {
        teq: {package: DEF.SHARED.NAME},
        name: NS,
        template,
        components: {},
        data() {
            return {
                menuOpen: false
            };
        },
        methods: {
            toggleMenu() {
                this.menuOpen = !this.menuOpen;
            }
        },
        setup() {
        }
    };
}

// to get namespace on debug
Object.defineProperty(Factory, 'name', {value: `${NS}.Factory`});
