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
    // DEPS
    /** @type {Fl32_Dup_Front_Defaults} */
    const DEF = spec['Fl32_Dup_Front_Defaults$'];
    /** @type {Fl32_Dup_Front_Layout_Z_Leds.vueCompTmpl} */
    const leds = spec['Fl32_Dup_Front_Layout_Z_Leds$'];
    /** @type {Fl32_Dup_Front_Layout_Base_BottomBar.vueCompTmpl} */
    const bottomBar = spec['Fl32_Dup_Front_Layout_Base_BottomBar$'];
    /** @type {Fl32_Dup_Front_Rx_Title} */
    const rxTitle = spec['Fl32_Dup_Front_Rx_Title$'];

    // DEFINE WORKING VARS & PROPS
    const template = `
<q-layout view="lHr lpR lFr">

    <q-header reveal>
        <q-toolbar>
            <q-btn dense flat round icon="menu" to="${DEF.ROUTE_HOME}"/>
            <q-toolbar-title>{{ title }}</q-toolbar-title>
            <q-space></q-space>
            <leds/>
        </q-toolbar>
    </q-header>
    <q-page-container style="height: 100%">
        <div style="display: grid; height: 100%; align-items: center; justify-items: center;">
            <slot/>
        </div>
    </q-page-container>

    <q-footer class="bg-primary text-white">
        <bottom-bar/>
    </q-footer>

</q-layout>
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
        components: {bottomBar, leds},
        data() {
            return {
                title: rxTitle.getRef(),
            };
        },
    };
}

// to get namespace on debug
Object.defineProperty(Factory, 'namespace', {value: NS});
