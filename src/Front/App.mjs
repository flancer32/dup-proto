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
/**
 * @implements TeqFw_Web_Front_Api_IApp
 */
export default class Fl32_Dup_Front_App {
    constructor(spec) {
        // DEPS
        const {createApp} = spec['TeqFw_Vue_Front_Lib_Vue'];
        const {createRouter, createWebHashHistory} = spec['TeqFw_Vue_Front_Lib_Router'];
        /** @type {Fl32_Dup_Front_Defaults} */
        const DEF = spec['Fl32_Dup_Front_Defaults$'];
        /** @type {TeqFw_Di_Shared_Container} */
        const container = spec['TeqFw_Di_Shared_Container$'];
        /** @type {TeqFw_Core_Shared_Api_ILogger} */
        const logger = spec['TeqFw_Core_Shared_Api_ILogger$$']; // instance
        /** @type {TeqFw_Web_Front_Mod_Logger_Transport} */
        const modLogTrn = spec['TeqFw_Core_Shared_Api_Logger_ITransport$']; // as interface
        /** @type {TeqFw_I18n_Front_Mod_I18n} */
        const modI18n = spec['TeqFw_I18n_Front_Mod_I18n$'];
        /** @type {TeqFw_Ui_Quasar_Front_Lib} */
        const quasar = spec['TeqFw_Ui_Quasar_Front_Lib'];
        /** @type {Fl32_Dup_Front_Layout_Base} */
        const layoutBase = spec['Fl32_Dup_Front_Layout_Base$'];
        /** @type {Fl32_Dup_Front_Layout_Chat} */
        const layoutChat = spec['Fl32_Dup_Front_Layout_Chat$'];
        /** @type {Fl32_Dup_Front_Layout_Empty} */
        const layoutEmpty = spec['Fl32_Dup_Front_Layout_Empty$'];
        /** @type {TeqFw_Web_Front_Mod_Config} */
        const modCfg = spec['TeqFw_Web_Front_Mod_Config$'];
        /** @type {Fl32_Dup_Front_Mod_Hollow_IsFree} */
        const modHollowIsFree = spec['Fl32_Dup_Front_Mod_Hollow_IsFree$'];
        /** @type {TeqFw_Web_Auth_Front_Mod_Identity} */
        const modIdentity = spec['TeqFw_Web_Auth_Front_Mod_Identity$'];
        /** @type {TeqFw_Web_Event_Front_Mod_Connect_Reverse} */
        const streamBf = spec['TeqFw_Web_Event_Front_Mod_Connect_Reverse$'];
        /** @type {TeqFw_Web_Event_Front_Mod_Bus} */
        const eventBus = spec['TeqFw_Web_Event_Front_Mod_Bus$'];
        /** @type {TeqFw_Web_Event_Shared_Event_Back_Stream_Reverse_Authenticated} */
        const esbAuthenticated = spec['TeqFw_Web_Event_Shared_Event_Back_Stream_Reverse_Authenticated$'];
        /** @type {TeqFw_Web_Event_Shared_Event_Back_Stream_Reverse_Failed} */
        const esbFailed = spec['TeqFw_Web_Event_Shared_Event_Back_Stream_Reverse_Failed$'];
        /** @type {Fl32_Dup_Front_Mod_User_Profile} */
        const modProfile = spec['Fl32_Dup_Front_Mod_User_Profile$'];
        /** @type {Fl32_Dup_Front_Mod_Log_Monitor} */
        const modLogMonitor = spec['Fl32_Dup_Front_Mod_Log_Monitor$'];
        /** @type {Fl32_Dup_Front_Widget_App} */
        const uiApp = spec['Fl32_Dup_Front_Widget_App$'];


        // VARS
        let _isInitialized = false; // application is initialized and can be mounted
        let _root; // root vue component for the application

        // MAIN
        logger.setNamespace(this.constructor.namespace);

        // INSTANCE METHODS

        this.init = async function (fnPrintout) {
            // FUNCS

            /**
             * Create printout function to log application startup events (to page or to console).
             * @param {function(string)} fn
             * @return {function(string)}
             */
            function createPrintout(fn) {
                return (typeof fn === 'function') ? fn : (msg) => console.log(msg);
            }

            /**
             * Create processes that start on events.
             * TODO: this should be done using 'teqfw.json' descriptor
             * @param {TeqFw_Di_Shared_Container} container
             */
            async function initEventProcessors(container) {
                // TODO: init from 'teqfw.json'
                // Some processes (authentication) should be subscribed to events before Reverse Stream can be opened.
                await container.get('Fl32_Dup_Front_Hand_Admin_Command$');
                await container.get('Fl32_Dup_Front_Hand_Connect_Manager$');
                await container.get('Fl32_Dup_Front_Hand_Msg_Receive$');
                await container.get('Fl32_Dup_Front_Hand_Msg_Report_Delivery$');
                await container.get('Fl32_Dup_Front_Hand_Msg_Report_Read$');
                await container.get('Fl32_Dup_Front_Hand_Msg_Report_Sending$');
                await container.get('Fl32_Dup_Front_Hand_User_Contact_Add$');
            }

            /**
             * Wait until back-to-front events stream will be opened and authenticated before continue.
             * @param {TeqFw_Di_Shared_Container} container
             * @return {Promise<TeqFw_Web_Event_Front_Event_Connect_Reverse_Opened.Dto>}
             * @memberOf Fl32_Dup_Front_App.init
             */
            async function initEventStream(container) {
                return new Promise((resolve, reject) => {
                    if (navigator.onLine) {
                        streamBf.open();
                        const subsSuccess = eventBus.subscribe(esbAuthenticated.getEventName(), (evt) => {
                            eventBus.unsubscribe(subsSuccess);
                            logger.info(`Events reverse stream is opened on the front and authenticated by back.`);
                            resolve(evt);
                        });
                        const subsFailed = eventBus.subscribe(esbFailed.getEventName(), (evt) => {
                            // TODO: this event is not published by back yet
                            eventBus.unsubscribe(subsFailed);
                            debugger
                            reject(new Error(evt?.data?.reason));
                        });
                    } else resolve();
                });
            }

            /**
             * Setup working languages and fallback language and add translation function to the Vue.
             *
             * @param {Object} app
             * @return {Promise<void>}
             * @memberOf Fl32_Dup_Front_App.init
             */
            async function initI18n(app) {
                await modI18n.init(['en'], 'en');
                const i18n = modI18n.getI18n();
                // add translation function to Vue
                const appProps = app.config.globalProperties;
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
                    path: DEF.ROUTE_ADMIN,
                    component: () => container.get('Fl32_Dup_Front_Ui_Admin_Route$')
                });
                router.addRoute({
                    path: DEF.ROUTE_CFG,
                    component: () => container.get('Fl32_Dup_Front_Ui_Cfg_Route$')
                });
                router.addRoute({
                    path: DEF.ROUTE_CHAT,
                    component: () => container.get('Fl32_Dup_Front_Ui_Chat_Route$'),
                    children: [
                        {
                            path: DEF.ROUTE_CHAT_BAND,
                            component: () => container.get('Fl32_Dup_Front_Ui_Chat_Band_Route$'),
                            props: true
                        }
                    ]
                });
                router.addRoute({
                    path: DEF.ROUTE_CONTACTS_ADD,
                    component: () => container.get('Fl32_Dup_Front_Ui_Contacts_Add_Route$')
                });
                router.addRoute({
                    path: DEF.ROUTE_CONTACTS_CARD,
                    props: true,
                    component: () => container.get('Fl32_Dup_Front_Ui_Contacts_Card_Route$')
                });
                router.addRoute({
                    path: DEF.ROUTE_HOME,
                    component: () => container.get('Fl32_Dup_Front_Ui_Home_Route$'),
                });
                router.addRoute({
                    path: DEF.ROUTE_INVITE_VALIDATE,
                    component: () => container.get('Fl32_Dup_Front_Ui_Invite_Validate_Route$'),
                    props: true,
                    meta: {requiresAuth: false}
                });
                router.addRoute({
                    path: DEF.ROUTE_HOLLOW_OCCUPY,
                    component: () => container.get('Fl32_Dup_Front_Ui_Hollow_Occupy_Route$'),
                    meta: {requiresAuth: false}
                });

                app.use(router);
                uiApp.setRouter(router);
                return router;
            }

            // MAIN
            const print = createPrintout(fnPrintout);
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
                    logger.info(`Started with route: '${JSON.stringify(this.$router.currentRoute.value)}'`);
                    if (await modHollowIsFree.get()) {
                        logger.info(`Hollow is not occupied. Goto occupy route.`);
                        this.$router.push(DEF.ROUTE_HOLLOW_OCCUPY);
                    } else {
                        const profile = await modProfile.get();
                        if (!profile?.nick) {
                            if (
                                !document.location.href.includes(DEF.ROUTE_HOLLOW_OCCUPY) &&
                                !document.location.href.includes('/invite/validate/')
                            ) {
                                logger.info(`Hollow is occupied but current location is not reg mode location. Goto occupy route.`);
                                this.$router.push(DEF.ROUTE_HOLLOW_OCCUPY);
                            }
                        }
                    }
                    this.canDisplay = true;
                }
            });
            uiApp.set(_root);

            // ... and add global available components
            _root.component('LayoutBase', layoutBase);
            _root.component('LayoutChat', layoutChat);
            _root.component('LayoutEmpty', layoutEmpty);

            // other initialization
            // logger.pause(false);
            // if (await modAlive.check()) {
            await modCfg.init({}); // this app has no separate 'doors' (entry points)
            print(`Application config is loaded.`);
            await initI18n(_root);
            print(`i18n resources are loaded.`);
            await modIdentity.init();
            print(`Front UUID: ${modIdentity.getFrontUuid()}.`);
            try {
                await initEventProcessors(container);
                print(`Frontend processes are created.`);
                await initEventStream(container);
                print(`Backend events stream is opened.`);
                initQuasarUi(_root, quasar);
                print(`Data sources are initialized.`);
                initRouter(_root, DEF, container);
                print(`Vue app is created and initialized.`);
                if (await modLogMonitor.get()) {
                    modLogTrn.enableLogs();
                    print(`Logs monitoring is enabled.`);
                }
                _isInitialized = true;
            } catch (e) {
                // TODO: place IDB cleanup here for re-installs
                print(e.message);
            }
        }

        /**
         * Mount root vue component of the application to DOM element.
         *
         * @see https://v3.vuejs.org/api/application-api.html#mount
         *
         * @param {Element|string} elRoot
         */
        this.mount = function (elRoot) {
            if (_isInitialized) _root.mount(elRoot);
        }
    }
}
