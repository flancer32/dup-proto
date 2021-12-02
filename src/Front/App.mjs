/**
 * Web application.
 *
 * Load config and i18n dictionary from server, initialize Vue (add router, Quasar UI, i18next),
 * create and mount root vue component.
 */
// MODULE'S VARS
const NS = 'Fl32_Dup_Front_App';

// MODULE'S CLASSES
export default class Fl32_Dup_Front_App {
    constructor(spec) {
        // EXTRACT DEPS
        const {createApp} = spec['TeqFw_Vue_Front_Lib_Vue'];
        const {createRouter, createWebHashHistory} = spec['TeqFw_Vue_Front_Lib_Router'];
        /** @type {Fl32_Dup_Front_Defaults} */
        const DEF = spec['Fl32_Dup_Front_Defaults$'];
        /** @type {TeqFw_Di_Shared_Container} */
        const container = spec['TeqFw_Di_Shared_Container$'];
        /** @type {TeqFw_I18n_Front_Lib} */
        const I18nLib = spec['TeqFw_I18n_Front_Lib$'];
        /** @type {TeqFw_Ui_Quasar_Front_Lib} */
        const quasar = spec['TeqFw_Ui_Quasar_Front_Lib'];
        /** @type {Fl32_Dup_Front_Layout_Base} */
        const _layoutBase = spec['Fl32_Dup_Front_Layout_Base$'];
        /** @type {Fl32_Dup_Front_Layout_Chat} */
        const _layoutChat = spec['Fl32_Dup_Front_Layout_Chat$'];
        /** @type {Fl32_Dup_Front_Layout_Empty} */
        const _layoutEmpty = spec['Fl32_Dup_Front_Layout_Empty$'];
        /** @type {TeqFw_Web_Front_Model_Config} */
        const _config = spec['TeqFw_Web_Front_Model_Config$'];
        /** @type {TeqFw_User_Front_Api_ISession} */
        const _session = spec['TeqFw_User_Front_Api_ISession$'];
        /** @type {Fl32_Dup_Front_Rx_Led} */
        const _led = spec['Fl32_Dup_Front_Rx_Led$'];
        /** @type {Fl32_Dup_Front_Model_SSE_Connect_Manager} */
        const mgrSSE = spec['Fl32_Dup_Front_Model_SSE_Connect_Manager$'];

        // DEFINE WORKING VARS / PROPS
        let _root; // root vue component for the application

        // DEFINE INNER FUNCTIONS

        /**
         * Initialize application.
         *
         * @return {Promise<void>}
         */
        this.init = async function () {
            // DEFINE INNER FUNCTIONS


            /**
             * Setup working languages and fallback language and add translation function to the Vue.
             *
             * @param {Object} app
             * @param {TeqFw_I18n_Front_Lib} I18nLib
             * @return {Promise<void>}
             * @memberOf Fl32_Dup_Front_App.init
             */
            async function initI18n(app, I18nLib) {
                await I18nLib.init(['en', 'ru'], 'en');
                const appProps = app.config.globalProperties;
                const i18n = I18nLib.getI18n();
                // add translation function to Vue
                // noinspection JSPrimitiveTypeWrapperUsage
                appProps.$t = function (key, options) {
                    // add package name if namespace is omitted in the key
                    // noinspection JSUnresolvedVariable
                    const ns = this.$options.teq?.package;
                    if (ns && key.indexOf(':') <= 0) key = `${ns}:${key}`;
                    return i18n.t(key, options);
                }
            }

            function initQuasarUi(app, quasar) {
                app.use(quasar, {config: {}});
                // noinspection JSUnresolvedVariable
                quasar.iconSet.set(quasar.iconSet.svgMaterialIcons);
            }

            function initRouter(app, DEF, container) {
                /** @type {{addRoute}} */
                const router = createRouter({
                    history: createWebHashHistory(),
                    routes: [],
                });
                // setup application routes (load es6-module on demand with DI-container)
                router.addRoute({
                    path: DEF.ROUTE_CFG,
                    component: () => container.get('Fl32_Dup_Front_Widget_Cfg_Route$')
                });
                router.addRoute({
                    path: DEF.ROUTE_CHAT,
                    component: () => container.get('Fl32_Dup_Front_Widget_Chat_Route$'),
                    props: true,
                    children: [{
                        path: DEF.ROUTE_CHAT_USER,
                        component: () => container.get('Fl32_Dup_Front_Widget_Chat_User_Route$'),
                        props: true
                    }, {
                        path: DEF.ROUTE_CHAT_ROOM,
                        component: () => container.get('Fl32_Dup_Front_Widget_Chat_Room_Route$'),
                        props: true
                    }]
                });
                router.addRoute({
                    path: DEF.ROUTE_CONTACTS_ADD,
                    component: () => container.get('Fl32_Dup_Front_Widget_Contacts_Add_Route$')
                });
                router.addRoute({
                    path: DEF.ROUTE_CONTACTS_LIST,
                    component: () => container.get('Fl32_Dup_Front_Widget_Contacts_List_Route$')
                });
                router.addRoute({
                    path: DEF.ROUTE_HOME,
                    component: () => container.get('Fl32_Dup_Front_Widget_Home_Route$'),
                });
                router.addRoute({
                    path: DEF.ROUTE_INVITE_VALIDATE,
                    component: () => container.get('Fl32_Dup_Front_Widget_Invite_Check_Route$'),
                    props: true,
                    meta: {requiresAuth: false}
                });
                router.addRoute({
                    path: DEF.ROUTE_HOLLOW_OCCUPY,
                    component: () => container.get('Fl32_Dup_Front_Widget_Hollow_Occupy_Route$')
                });

                app.use(router);
                return router;
            }

            // MAIN FUNCTIONALITY

            // create root vue component
            _root = createApp({
                teq: {package: DEF.SHARED.NAME},
                name: NS,
                template: '<router-view/>',
                async mounted() {
                    await _session.open();
                    // if (await _session.checkUserAuthenticated())
                    //     await mgrSSE.open(); // open SSE connection
                }
            });
            // ... and add global available components
            _root.component('LayoutBase', _layoutBase);
            _root.component('LayoutChat', _layoutChat);
            _root.component('LayoutEmpty', _layoutEmpty);

            // other initialization
            await _config.init({}); // this app has no separate 'doors' (entry points)
            await initI18n(_root, I18nLib);
            initQuasarUi(_root, quasar);
            const router = initRouter(_root, DEF, container);
            _session.setRouter(router);
            _session.setRouteToSignIn(DEF.ROUTE_HOLLOW_OCCUPY);
            // add sound on WebPush event
            const bCast = new BroadcastChannel('teqfw-sw');
            bCast.addEventListener('message', (e) => {
                const data = e.data;
                if (data?.name === 'playPushSound') {
                    const playSound = new Audio(
                        './sound/push.mp3'
                    );
                    playSound.play();
                }
            });
            // add online/offline events
            window.addEventListener('online', () => {
                _led.setOnline();
                mgrSSE.open();
            });
            window.addEventListener('offline', () => {
                _led.setOffline();
            });
        }

        /**
         * Mount root vue component of the application to DOM element.
         *
         * @see https://v3.vuejs.org/api/application-api.html#mount
         *
         * @param {Element|string} elRoot
         * @return {Object} the root component instance
         */
        this.mount = function (elRoot) {
            return _root.mount(elRoot);
        }
    }
}
