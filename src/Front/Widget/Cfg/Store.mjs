/**
 * Store configuration widget.
 *
 * @namespace Fl32_Dup_Front_Widget_Cfg_Store
 */
// MODULE'S VARS
const NS = 'Fl32_Dup_Front_Widget_Cfg_Store';

// MODULE'S FUNCTIONS
/**
 * TeqFW DI factory function to get dependencies for the object.
 *
 * @returns {Fl32_Dup_Front_Widget_Cfg_Store.vueCompTmpl}
 */
export default function (spec) {
    /** @type {Fl32_Dup_Front_Defaults} */
    const DEF = spec['Fl32_Dup_Front_Defaults$'];
    /** @type {Fl32_Dup_Front_Mod_User_Profile} */
    const modProfile = spec['Fl32_Dup_Front_Mod_User_Profile$'];

    // VARS
    const template = `
<q-card class="">
    <q-card-section class="q-gutter-sm">
        <div class="text-subtitle2">{{ $t('wg.cfg.profile.title') }}:</div>
        <q-input :label="$t('wg.cfg.profile.nick')"
                 outlined
                 v-model="fldNick"
        />
        <q-input :label="$t('wg.cfg.profile.threshold')"
                 outlined
                 v-model="fldMsgCleanupThreshold"
        />
        <q-btn :label="$t('btn.save')" color="primary" :disable="disabled" v-on:click="save"></q-btn>
    </q-card-section>
</q-card>
`;
    /**
     * Template to create new component instances using Vue.
     *
     * @const {Object} vueCompTmpl
     * @memberOf Fl32_Dup_Front_Widget_Cfg_Store
     */
    return {
        teq: {package: DEF.SHARED.NAME},
        name: NS,
        template,
        data() {
            return {
                disabled: false,
                fldNick: null,
                fldMsgCleanupThreshold: null,
            };
        },
        methods: {
            async save() {
                this.disabled = true;
                const profile = await modProfile.get();
                profile.nick = this.fldNick;
                profile.msgCleanupThreshold = Number.parseInt(this.fldMsgCleanupThreshold);
                await modProfile.set(profile);
                this.disabled = false;
            }
        },
        async mounted() {
            const profile = await modProfile.get();
            this.fldNick = profile.nick;
            this.fldMsgCleanupThreshold = profile.msgCleanupThreshold || 32;
        }
    };
}
