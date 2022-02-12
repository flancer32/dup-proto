/**
 * Message input widget.
 *
 * @namespace Fl32_Dup_Front_Layout_Base_BottomBar
 */
// MODULE'S VARS
const NS = 'Fl32_Dup_Front_Layout_Base_BottomBar';

// MODULE'S FUNCTIONS
/**
 * Bottom bar for base layout.
 *
 * @returns {Fl32_Dup_Front_Layout_Base_BottomBar.vueCompTmpl}
 */
export default function (spec) {
    /** @type {Fl32_Dup_Front_Defaults} */
    const DEF = spec['Fl32_Dup_Front_Defaults$'];


    // DEFINE WORKING VARS
    const template = `
<q-toolbar>
    <div class="fit row justify-center">
        <div class="col-6 text-center">
            <q-avatar color="primary" size="50px" text-color="white" icon="settings" v-on:click="toConfig"/>
        </div>
        <div class="col-6 text-center">
            <q-avatar color="primary" size="50px" text-color="white" icon="person_add_alt_1" v-on:click="toAdd"/>
        </div>
</q-toolbar>
`;
    /**
     * Template to create new component instances using Vue.
     *
     * @const {Object} vueCompTmpl
     * @memberOf Fl32_Dup_Front_Layout_Base_BottomBar
     */
    return {
        teq: {package: DEF.SHARED.NAME},
        name: NS,
        template,
        components: {},
        data() {
            return {};
        },
        methods: {
            toAdd() {
                this.$router.push(DEF.ROUTE_CONTACTS_ADD);
            },
            toConfig() {
                this.$router.push(DEF.ROUTE_CFG);
            }
        },
        async mounted() { },
    };
}
