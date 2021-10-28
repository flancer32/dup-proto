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
        /** @type {Fl32_Dup_Front_Defaults} */
        const DEF = spec['Fl32_Dup_Front_Defaults$'];
        /** @type {TeqFw_Di_Shared_Container} */
        const container = spec['TeqFw_Di_Shared_Container$'];
        /** @type {TeqFw_I18n_Front_Lib} */
        const I18nLib = spec['TeqFw_I18n_Front_Lib$'];
        /** @type {TeqFw_Ui_Quasar_Front_Lib} */
        const QuasarLib = spec['TeqFw_Ui_Quasar_Front_Lib$'];
        /** @type {TeqFw_Vue_Front_Lib} */
        const VueLib = spec['TeqFw_Vue_Front_Lib$'];
        /** @type {Fl32_Dup_Front_Layout_Base} */
        const _layoutBase = spec['Fl32_Dup_Front_Layout_Base$'];
        /** @type {TeqFw_Web_Front_Model_Config} */
        const _config = spec['TeqFw_Web_Front_Model_Config$'];

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

            function initQuasarUi(app, QuasarLib) {
                const quasar = QuasarLib.getQuasar()
                app.use(quasar, {config: {}});
                // noinspection JSUnresolvedVariable
                quasar.iconSet.set(quasar.iconSet.svgMaterialIcons);
            }

            function initRouter(app, VueLib, DEF, container) {
                /** @type {{createRouter, createWebHashHistory}} */
                const Router = VueLib.getRouter();
                /** @type {{addRoute}} */
                const router = Router.createRouter({
                    history: Router.createWebHashHistory(),
                    routes: [],
                });
                // setup application routes (load es6-module on demand with DI-container)
                // router.addRoute({
                //     path: DEF.ROUTE_HOME,
                //     component: () => container.get('Fl32_Dup_Front_Route_Home$')
                // });
                //
                app.use(router);
            }

            // MAIN FUNCTIONALITY

            // create root vue component
            /** @type {{createApp}} */
            const Vue = VueLib.getVue();
            _root = Vue.createApp({
                teq: {package: DEF.SHARED.NAME},
                name: NS,
                template: '<router-view/>',
            });
            // ... and add global available components
            _root.component('LayoutBase', _layoutBase);

            // other initialization
            await _config.init({}); // this app has no separate 'doors' (entry points)
            await initI18n(_root, I18nLib);
            initQuasarUi(_root, QuasarLib);
            initRouter(_root, VueLib, DEF, container);
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