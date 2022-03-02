/**
 * Chat layout widget.
 *
 * @namespace Fl32_Dup_Front_Layout_Chat
 */
// MODULE'S VARS
const NS = 'Fl32_Dup_Front_Layout_Chat';

// MODULE'S FUNCTIONS
/**
 * Factory to create template for new Vue component instances.
 *
 * @memberOf Fl32_Dup_Front_Layout_Chat
 * @returns {Fl32_Dup_Front_Layout_Chat.vueCompTmpl}
 */
export default function Factory(spec) {
    // DEPS
    const {ref} = spec['TeqFw_Vue_Front_Lib_Vue'];
    /** @type {Fl32_Dup_Front_Defaults} */
    const DEF = spec['Fl32_Dup_Front_Defaults$'];
    /** @type {Fl32_Dup_Front_Layout_Z_Leds.vueCompTmpl} */
    const leds = spec['Fl32_Dup_Front_Layout_Z_Leds$'];
    /** @type {Fl32_Dup_Front_Widget_Chat_Msg_Input.vueCompTmpl} */
    const messageInput = spec['Fl32_Dup_Front_Widget_Chat_Msg_Input$'];
    /** @type {Fl32_Dup_Front_Rx_Title} */
    const rxTitle = spec['Fl32_Dup_Front_Rx_Title$'];

    // DEFINE WORKING VARS & PROPS
    const template = `
<q-layout view="lHr lpR lFr">

    <q-header reveal class="bg-primary text-white">
        <q-toolbar>
            <q-btn dense flat round icon="menu" to="${DEF.ROUTE_HOME}"/>
            <q-toolbar-title>{{title}}</q-toolbar-title>
            <q-space></q-space>
            <leds/>
        </q-toolbar>
    </q-header>

    <q-page-container class="absolute-bottom">
        <slot/>
    </q-page-container>

    <q-footer class="bg-lightest q-pa-sm">
        <q-toolbar>
            <message-input/>
        </q-toolbar>
    </q-footer>

</q-layout>
`;

    // COMPOSE RESULT
    /**
     * Template to create new component instances using Vue.
     *
     * @const {Object} vueCompTmpl
     * @memberOf Fl32_Dup_Front_Layout_Chat
     */
    return {
        teq: {package: DEF.SHARED.NAME},
        name: NS,
        template,
        components: {leds, messageInput},
        data() {
            return {
                menuOpen: false,
            };
        },
        methods: {
            toggleMenu() {
                this.menuOpen = !this.menuOpen;
            }
        },
        setup() {
            // TODO: clean up or move menuOpenHere
            const leftDrawerOpen = ref(false)
            const rightDrawerOpen = ref(false)
            const title = rxTitle.getRef();

            return {
                title,
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
