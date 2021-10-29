/**
 * Empty layout widget.
 *
 * @namespace Fl32_Dup_Front_Layout_Empty
 */
// MODULE'S VARS
const NS = 'Fl32_Dup_Front_Layout_Empty';

// MODULE'S FUNCTIONS
/**
 * Factory to create template for new Vue component instances.
 *
 * @memberOf Fl32_Dup_Front_Layout_Empty
 * @returns {Fl32_Dup_Front_Layout_Empty.vueCompTmpl}
 */
export default function Factory(spec) {
    // EXTRACT DEPS
    /** @type {Fl32_Dup_Front_Defaults} */
    const DEF = spec['Fl32_Dup_Front_Defaults$'];

    // DEFINE WORKING VARS & PROPS
    const template = `
  <q-layout view="hHh lpR fFf" class="launchpad">

    <q-page-container class="">
      <slot/>
    </q-page-container>

  </q-layout>
`;

    // COMPOSE RESULT
    /**
     * Template to create new component instances using Vue.
     *
     * @const {Object} vueCompTmpl
     * @memberOf Fl32_Dup_Front_Layout_Empty
     */
    return {
        teq: {package: DEF.SHARED.NAME},
        name: NS,
        template,
    };
}

// to get namespace on debug
Object.defineProperty(Factory, 'name', {value: `${NS}.Factory`});
