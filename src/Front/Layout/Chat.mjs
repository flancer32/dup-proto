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
    // EXTRACT DEPS
    /** @type {Fl32_Dup_Front_Defaults} */
    const DEF = spec['Fl32_Dup_Front_Defaults$'];
    /** @type {TeqFw_Vue_Front_Lib} */
    const VueLib = spec['TeqFw_Vue_Front_Lib$'];
    /** @type {Fl32_Dup_Front_Layout_Nav_Chat.vueCompTmpl} */
    const navigator = spec['Fl32_Dup_Front_Layout_Nav_Chat$'];
    /** @type {Fl32_Dup_Front_Layout_Leds.vueCompTmpl} */
    const leds = spec['Fl32_Dup_Front_Layout_Leds$'];
    /** @type {Fl32_Dup_Front_Widget_Chat_Msg_Input.vueCompTmpl} */
    const messageInput = spec['Fl32_Dup_Front_Widget_Chat_Msg_Input$'];
    /** @type {Fl32_Dup_Front_Rx_Chat_Current} */
    const rxChat = spec['Fl32_Dup_Front_Rx_Chat_Current$'];

    // DEFINE WORKING VARS & PROPS
    const ref = VueLib.getVue().ref;
    const template = `
<q-layout view="lHr lpR lFr">

    <q-header reveal class="bg-primary text-white">
        <q-toolbar>
            <q-btn dense flat round icon="menu" @click="toggleLeftDrawer"/>
            <q-toolbar-title>
            {{title}}
            </q-toolbar-title>
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

    <q-page-container class="absolute-bottom">
        <slot/>
    </q-page-container>

    <q-footer class="bg-lightest q-pb-sm">
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
        components: {navigator, leds, messageInput},
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
            const leftDrawerOpen = ref(false)
            const rightDrawerOpen = ref(false)
            const title = rxChat.getTitle();

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
