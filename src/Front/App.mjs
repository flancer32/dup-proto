/**
 * Web application.
 *
 * Initialization:
 * - Load config and i18n from server (WAPI).
 * - Init UUID for front & back.
 * - Init processes and bind it to events.
 * - Open reverse events stream.
 * - Init Vue (add router, Quasar UI, i18next),
 *
 * Then create and mount root vue component to given DOM element.
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
        /** @type {TeqFw_Core_Shared_Logger} */
        const logger = spec['TeqFw_Core_Shared_Logger$'];
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
        /** @type {Fl32_Dup_Front_DSource_Hollow_IsFree} */
        const _dsHollowIsFree = spec['Fl32_Dup_Front_DSource_Hollow_IsFree$'];
        /** @type {TeqFw_Web_Front_App_UUID} */
        const _frontUUID = spec['TeqFw_Web_Front_App_UUID$'];
        /** @type {TeqFw_Web_Front_App_Back_UUID} */
        const _backUUID = spec['TeqFw_Web_Front_App_Back_UUID$'];
        /** @type {TeqFw_Web_Front_App_Connect_Event_Reverse} */
        const streamBf = spec['TeqFw_Web_Front_App_Connect_Event_Reverse$'];
        /** @type {TeqFw_Web_Front_App_Event_Bus} */
        const eventBus = spec['TeqFw_Web_Front_App_Event_Bus$'];
        /** @type {TeqFw_Web_Front_Event_Connect_Event_Reverse_Opened} */
        const efOpened = spec['TeqFw_Web_Front_Event_Connect_Event_Reverse_Opened$'];
        /** @type {Fl32_Dup_Front_DSource_User_Profile} */
        const dsProfile = spec['Fl32_Dup_Front_DSource_User_Profile$'];

        // DEFINE WORKING VARS / PROPS
        let _root; // root vue component for the application

        // DEFINE INSTANCE METHODS

        /**
         * Initialize application.
         *
         * @param {string} cssSelector DIV to trace initialization process
         * @return {Promise<void>}
         */
        this.init = async function (cssSelector) {
            // DEFINE INNER FUNCTIONS

            /**
             * Create printout function to log application startup events (to page or to console).
             * @param {string} css
             * @return {(function(string))|*}
             */
            function createPrintout(css) {
                const elDisplay = document.querySelector(cssSelector);
                return function (msg) {
                    if (elDisplay) elDisplay.innerText = msg;
                    else console.log(msg);
                }
            }

            /**
             * Create and initialize data sources.
             */
            async function initDataSources(container) {
                /** @type {TeqFw_User_Front_DSource_User} */
                const user = await container.get('TeqFw_User_Front_DSource_User$');
                await user.get();
                /** @type {Fl32_Dup_Front_DSource_Hollow_IsFree} */
                const dsHollowIsFree = await container.get('Fl32_Dup_Front_DSource_Hollow_IsFree$');
                await dsHollowIsFree.init();
            }

            /**
             * Create processes that start on events.
             * TODO: this should be done using 'teqfw.json' descriptor
             * @param {TeqFw_Di_Shared_Container} container
             */
            async function initEventProcessors(container) {
                // TODO: init from 'teqfw.json'
                // Some processes (authentication) should be subscribed to events before Reverse Stream can be opened.
                await container.get('Fl32_Dup_Front_Proc_Connect_Manager$');
                await container.get('Fl32_Dup_Front_Proc_User_Authentication$');
                await container.get('Fl32_Dup_Front_Proc_User_Contact_Add$');
            }

            /**
             * Wait until back-to-front events stream will be open before continue.
             * @param {TeqFw_Di_Shared_Container} container
             * @return {Promise<TeqFw_Web_Front_Event_Connect_Event_Reverse_Opened.Dto>}
             */
            async function initEventStream(container) {
                await container.get('TeqFw_User_Front_Proc_Authenticate$');
                await container.get('Fl32_Dup_Front_Proc_User_Authentication$');
                return new Promise((resolve) => {
                    streamBf.open();
                    const subscript = eventBus.subscribe(efOpened.getEventName(), (evt) => {
                        logger.info(`Back-to-front event stream is opened on the front.`);
                        eventBus.unsubscribe(subscript);
                        resolve(evt);
                    });
                    // TODO: add on error processing
                });
            }

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
                    component: () => container.get('Fl32_Dup_Front_Widget_Invite_Validate_Route$'),
                    props: true,
                    meta: {requiresAuth: false}
                });
                router.addRoute({
                    path: DEF.ROUTE_HOLLOW_OCCUPY,
                    component: () => container.get('Fl32_Dup_Front_Widget_Hollow_Occupy_Route$'),
                    meta: {requiresAuth: false}
                });

                app.use(router);
                return router;
            }

            // MAIN FUNCTIONALITY
            const print = createPrintout(cssSelector);
            print(`TeqFW App is initializing...`);

            // create root vue component
            _root = createApp({
                teq: {package: DEF.SHARED.NAME},
                name: NS,
                data() {
                    return {
                        canDisplay: false
                    };
                },
                template: '<router-view v-if="canDisplay"/><div class="launchpad" v-if="!canDisplay">App is starting...</div>',
                async mounted() {
                    await _dsHollowIsFree.init();
                    if (_dsHollowIsFree.get()) {
                        this.$router.push(DEF.ROUTE_HOLLOW_OCCUPY);
                    } else {
                        const profile = await dsProfile.get();
                        if (!profile?.username) {
                            if (
                                !document.location.href.includes(DEF.ROUTE_HOLLOW_OCCUPY) &&
                                !document.location.href.includes('/invite/validate/')
                            )
                                this.$router.push(DEF.ROUTE_HOLLOW_OCCUPY);
                        }
                    }
                    this.canDisplay = true;
                }
            });
            // ... and add global available components
            _root.component('LayoutBase', _layoutBase);
            _root.component('LayoutChat', _layoutChat);
            _root.component('LayoutEmpty', _layoutEmpty);

            // other initialization
            logger.pause(false);
            await _config.init({}); // this app has no separate 'doors' (entry points)
            print(`Application config is loaded.`);
            await initI18n(_root, I18nLib);
            print(`i18n resources are loaded.`);
            await _frontUUID.init();
            await _backUUID.init();
            print(`Front UUID: ${_frontUUID.get()}<br/>Back UUID: ${_backUUID.get()}.`);
            await initEventStream(container);
            print(`Backend events stream is opened.`);
            await initEventProcessors(container);
            print(`Frontend processes are created.`);
            initQuasarUi(_root, quasar);
            await initDataSources(container);
            print(`Data sources are initialized.`);
            initRouter(_root, DEF, container);
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
