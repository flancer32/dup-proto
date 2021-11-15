/**
 * Store configuration widget.
 *
 * @namespace Fl32_Dup_Front_Widget_Cfg_Store
 */
// MODULE'S VARS
const NS = 'Fl32_Dup_Front_Widget_Cfg_Store';

// MODULE'S FUNCTIONS
/**
 * TeqFW DI factory function to get dependencies for the object.
 *
 * @returns {Fl32_Dup_Front_Widget_Cfg_Store.vueCompTmpl}
 */
export default function (spec) {
    /** @type {Fl32_Dup_Front_Defaults} */
    const DEF = spec['Fl32_Dup_Front_Defaults$'];
    /** @type {TeqFw_Web_Front_Store_IDB} */
    const idb = spec['Fl32_Dup_Front_Store_Db$'];

    // DEFINE WORKING VARS
    const template = `
<q-card class="bg-white q-mt-xs">
    <q-card-section>
        <div class="text-subtitle2">{{$t('wg.cfg.store.title')}}:</div> 
        <q-btn :label="$t('wg.cfg.store.init')" color="primary" :disable="disabled" v-on:click="init"></q-btn>
    </q-card-section>
</q-card>
`;
    /**
     * Template to create new component instances using Vue.
     *
     * @const {Object} vueCompTmpl
     * @memberOf Fl32_Dup_Front_Widget_Cfg_Store
     */
    return {
        teq: {package: DEF.SHARED.NAME},
        name: NS,
        template,
        data() {
            return {
                disabled: false,
            };
        },
        methods: {
            async init() {
                this.disabled = true;
                await idb.dropDb();
                await idb.open();
                this.disabled = false;
            }
        },
    };
}
