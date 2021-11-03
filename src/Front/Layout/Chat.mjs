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
    /** @type {Fl32_Dup_Front_Widget_Chat_Msg_Input.vueCompTmpl} */
    const messageInput = spec['Fl32_Dup_Front_Widget_Chat_Msg_Input$'];

    // DEFINE WORKING VARS & PROPS
    const ref = VueLib.getVue().ref;
    const template = `
<q-layout view="lHr lpR lFr">

    <q-header reveal class="bg-primary text-white">
        <q-toolbar>
            <q-btn dense flat round icon="menu" @click="toggleLeftDrawer"/>

            <q-toolbar-title>

            </q-toolbar-title>

            <!--            <q-btn dense flat round icon="menu" @click="toggleRightDrawer"/>-->
        </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" side="left" overlay behavior="mobile" bordered>
        <q-list bordered padding class="rounded-borders text-primary">

            <q-item to="/"
                    active-class="bg-primary text-white"
                    clickable
                    v-ripple
            >
                <q-item-section avatar>
                    <q-icon name="home"/>
                </q-item-section>
                <q-item-section>{{$t('navig.home')}}</q-item-section>
            </q-item>

            <q-item to="/chat"
                    active-class="bg-primary text-white"
                    clickable
                    v-ripple
            >
                <q-item-section avatar>
                    <q-icon name="chat"/>
                </q-item-section>
                <q-item-section>{{$t('navig.chat')}}</q-item-section>
            </q-item>

        </q-list>
    </q-drawer>

    <!--    <q-drawer v-model="rightDrawerOpen" side="right" overlay behavior="mobile" bordered>-->
    <!--        &lt;!&ndash; drawer content &ndash;&gt;-->
    <!--    </q-drawer>-->

    <q-page-container>
        <slot/>
    </q-page-container>

    <q-footer class="t-bg-lightest q-pb-sm">
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
        components: {messageInput},
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
