/**
 * Add new contact route.
 *
 * @namespace Fl32_Dup_Front_Widget_Contacts_Add_Route
 */
// MODULE'S VARS
const NS = 'Fl32_Dup_Front_Widget_Contacts_Add_Route';
const LifeCountValues = {ONE: 1, MANY: 2}
const LifeTimeValues = {MIN5: 1, HOUR: 2, DAY: 3}

// MODULE'S FUNCTIONS
/**
 * Factory to create template for new Vue component instances.
 *
 * @returns {Fl32_Dup_Front_Widget_Contacts_Add_Route.vueCompTmpl}
 */
export default function (spec) {
    /** @type {Fl32_Dup_Front_Defaults} */
    const DEF = spec['Fl32_Dup_Front_Defaults$'];
    /** @type {TeqFw_User_Front_Api_ISession} */
    const _session = spec['TeqFw_User_Front_Api_ISession$'];

    // DEFINE WORKING VARS
    const template = `
<layout-base>
    <div class="q-pt-xs q-gutter-xs">
        <div class="text-subtitle1 text-center">{{$t('wg.contact.add.title')}}:</div>
        <q-card>
            <q-card-section>
                <div class="text-subtitle2">{{$t('wg.contact.add.time.title')}}:</div>
                <q-option-group
                        :options="lifeTimeOpts"
                        inline
                        v-model="lifeTime"
                ></q-option-group>
            </q-card-section>
            
            <q-separator></q-separator>
            
            <q-card-section>
                <div class="text-subtitle2">{{$t('wg.contact.add.count.title')}}:</div>
                <q-option-group
                        :options="lifeCountOpts"
                        inline
                        v-model="lifeCount"
                ></q-option-group>
            </q-card-section>

            <q-separator></q-separator>

            <q-card-actions align="center">
                <q-btn
                        :disabled="loading"
                        color="primary"
                        padding="xs lg"
                        v-on:click="onSubmit"
                >{{$t('btn.ok')}}
                </q-btn>
            </q-card-actions>
            {{message}}
        </q-card>
    </div>
</layout-base>
`;
    /**
     * Template to create new component instances using Vue.
     *
     * @const {Object} vueCompTmpl
     * @memberOf Fl32_Dup_Front_Widget_Contacts_Add_Route
     */
    return {
        teq: {package: DEF.SHARED.NAME},
        name: NS,
        template,
        components: {},
        data() {
            return {
                lifeCount: LifeCountValues.ONE,
                lifeTime: LifeTimeValues.MIN5,
                loading: false,
                message: null,
            };
        },
        computed: {
            lifeCountOpts() {
                return [
                    {label: this.$t('wg.contact.add.count.one'), value: LifeCountValues.ONE},
                    {label: this.$t('wg.contact.add.count.many'), value: LifeCountValues.MANY},
                ];
            },
            lifeTimeOpts() {
                return [
                    {label: this.$t('wg.contact.add.time.min5'), value: LifeTimeValues.MIN5},
                    {label: this.$t('wg.contact.add.time.hour1'), value: LifeTimeValues.HOUR},
                    {label: this.$t('wg.contact.add.time.day1'), value: LifeTimeValues.DAY},
                ];
            }
        },
        methods: {
            async onSubmit() {

            }
        },
        async mounted() {
            await _session.checkUserAuthenticated();

        },
    };
}
