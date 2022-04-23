/**
 * Device info UI component.
 *
 * @namespace Fl32_Dup_Front_Ui_Cfg_Info
 */
// MODULE'S VARS
const NS = 'Fl32_Dup_Front_Ui_Cfg_Info';

// MODULE'S FUNCTIONS
/**
 * TeqFW DI factory function to get dependencies for the object.
 *
 * @returns {Fl32_Dup_Front_Ui_Cfg_Info.vueCompTmpl}
 */
export default function (spec) {
    /** @type {Fl32_Dup_Front_Defaults} */
    const DEF = spec['Fl32_Dup_Front_Defaults$'];
    /** @type {TeqFw_Web_Auth_Front_Mod_Identity_Front} */
    const frontIdentity = spec['TeqFw_Web_Auth_Front_Mod_Identity_Front$'];

    // VARS
    const template = `
<q-card class="q-mt-xs" style="min-width: 300px">
    <q-card-section class="q-gutter-sm">
        <div class="text-subtitle2">{{ $t('wg.cfg.info.title') }}:</div>
        <q-separator inset />
        <div class="text-caption">{{ $t('wg.cfg.info.frontUuid') }}</div>
        <div class="text-body2">{{ frontUuid }}</div>
    </q-card-section>
</q-card>
`;
    /**
     * Template to create new component instances using Vue.
     *
     * @const {Object} vueCompTmpl
     * @memberOf Fl32_Dup_Front_Ui_Cfg_Info
     */
    return {
        teq: {package: DEF.SHARED.NAME},
        name: NS,
        template,
        data() {
            return {
                frontUuid: null,
            };
        },
        methods: {},
        async mounted() {
            this.frontUuid = frontIdentity.getUuid();
        }
    };
}
