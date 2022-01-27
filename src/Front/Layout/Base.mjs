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
    const {ref} = spec['TeqFw_Vue_Front_Lib_Vue'];
    /** @type {Fl32_Dup_Front_Defaults} */
    const DEF = spec['Fl32_Dup_Front_Defaults$'];
    /** @type {Fl32_Dup_Front_Layout_Nav_Base.vueCompTmpl} */
    const navigator = spec['Fl32_Dup_Front_Layout_Nav_Base$'];
    /** @type {Fl32_Dup_Front_Layout_Leds.vueCompTmpl} */
    const leds = spec['Fl32_Dup_Front_Layout_Leds$'];

    // DEFINE WORKING VARS & PROPS
    const template = `
<q-layout view="lHr lpR lFr">

    <q-header reveal class="bg-primary text-white">
        <q-toolbar>
            <q-btn dense flat round icon="menu" @click="toggleLeftDrawer"/>
            <q-space></q-space>
            <q-toolbar-title></q-toolbar-title>
            <q-space></q-space>
            <leds/>
            <!--            <q-btn dense flat round icon="menu" @click="toggleRightDrawer"/>-->
        </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" side="left" overlay behavior="mobile" bordered>
        <navigator/>
    </q-drawer>

    <!--    <q-drawer v-model="rightDrawerOpen" side="right" overlay behavior="mobile" bordered>-->
    <!--        &lt;!&ndash; drawer content &ndash;&gt;-->
    <!--    </q-drawer>-->

    <q-page-container style="display: grid; height: 100vh; justify-items: center;">
        <slot/>
    </q-page-container>

    <q-footer class="bg-primary text-white">
        <q-toolbar>

        </q-toolbar>
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
        components: {navigator, leds},
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
            const leftDrawerOpen = ref(false)
            const rightDrawerOpen = ref(false)

            return {
                leftDrawerOpen,
                toggleLeftDrawer() {
                    leftDrawerOpen.value = !leftDrawerOpen.value
                },

                rightDrawerOpen,
                toggleRightDrawer() {
                    rightDrawerOpen.value = !rightDrawerOpen.value
                }
            }
        }
    };
}

// to get namespace on debug
Object.defineProperty(Factory, 'name', {value: `${NS}.Factory`});
