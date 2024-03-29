/**
 * 'Configuration' route.
 *
 * @namespace Fl32_Dup_Front_Ui_Cfg_Route
 */
// MODULE'S VARS
const NS = 'Fl32_Dup_Front_Ui_Admin_Route';

// MODULE'S FUNCTIONS
/**
 * Factory to create template for new Vue component instances.
 *
 * @returns {Fl32_Dup_Front_Ui_Cfg_Route.vueCompTmpl}
 */
export default function (spec) {
    /** @type {Fl32_Dup_Front_Defaults} */
    const DEF = spec['Fl32_Dup_Front_Defaults$'];
    /** @type {Fl32_Dup_Front_Ui_Cfg_App} */
    const uiApp = spec['Fl32_Dup_Front_Ui_Cfg_App$'];
    /** @type {Fl32_Dup_Front_Ui_Cfg_Info.vueCompTmpl} */
    const uiInfo = spec['Fl32_Dup_Front_Ui_Cfg_Info$'];
    /** @type {Fl32_Dup_Front_Ui_Cfg_Profile.vueCompTmpl} */
    const uiProfile = spec['Fl32_Dup_Front_Ui_Cfg_Profile$'];
    /** @type {Fl32_Dup_Front_Rx_Title} */
    const rxTitle = spec['Fl32_Dup_Front_Rx_Title$'];

    // DEFINE WORKING VARS
    const template = `
<layout-base>
    <ui-profile />
    <ui-app/>
    <ui-info />
</layout-base>
`;
    /**
     * Template to create new component instances using Vue.
     *
     * @const {Object} vueCompTmpl
     * @memberOf Fl32_Dup_Front_Ui_Cfg_Route
     */
    return {
        teq: {package: DEF.SHARED.NAME},
        name: NS,
        template,
        components: {uiApp, uiInfo, uiProfile},
        mounted() {
            rxTitle.set(this.$t('wg.cfg.title'));
        },
    };
}
