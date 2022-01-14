/**
 * Add new contact route.
 *
 * @namespace Fl32_Dup_Front_Widget_Contacts_Add_Route
 */
// MODULE'S VARS
const NS = 'Fl32_Dup_Front_Widget_Contacts_Add_Route';
const LIFE_COUNT = {ONE: 1, MANY: 2}
const LIFE_TIME = {MIN5: 1, HOUR: 2, DAY: 3}

// MODULE'S FUNCTIONS
/**
 * Factory to create template for new Vue component instances.
 *
 * @returns {Fl32_Dup_Front_Widget_Contacts_Add_Route.vueCompTmpl}
 */
export default function (spec) {
    /** @type {Fl32_Dup_Front_Defaults} */
    const DEF = spec['Fl32_Dup_Front_Defaults$'];
    /** @type {TeqFw_User_Front_DSource_User} */
    const dsUser = spec['TeqFw_User_Front_DSource_User$'];
    /** @type {TeqFw_Web_Front_Api_Dto_Config} */
    const config = spec['TeqFw_Web_Front_Api_Dto_Config$'];
    /** @type {TeqFw_Web_Front_App_Connect_WAPI} */
    const gate = spec['TeqFw_Web_Front_App_Connect_WAPI$'];
    /** @type {Fl32_Dup_Shared_WAPI_User_Invite_Create.Factory} */
    const wapiInvite = spec['Fl32_Dup_Shared_WAPI_User_Invite_Create.Factory$'];

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
                lifeCount: LIFE_COUNT.ONE,
                lifeTime: LIFE_TIME.MIN5,
                loading: false,
                message: null,
            };
        },
        computed: {
            lifeCountOpts() {
                return [
                    {label: this.$t('wg.contact.add.count.one'), value: LIFE_COUNT.ONE},
                    {label: this.$t('wg.contact.add.count.many'), value: LIFE_COUNT.MANY},
                ];
            },
            lifeTimeOpts() {
                return [
                    {label: this.$t('wg.contact.add.time.min5'), value: LIFE_TIME.MIN5},
                    {label: this.$t('wg.contact.add.time.hour1'), value: LIFE_TIME.HOUR},
                    {label: this.$t('wg.contact.add.time.day1'), value: LIFE_TIME.DAY},
                ];
            }
        },
        methods: {
            async onSubmit() {
                const userCurrent = await dsUser.get();
                const userId = userCurrent.id;
                const date = new Date();
                if (this.lifeTime === LIFE_TIME.HOUR) {
                    date.setHours(date.getHours() + 1);
                } else if (this.lifeTime === LIFE_TIME.DAY) {
                    date.setDate(date.getDate() + 1);
                } else {
                    date.setMinutes(date.getMinutes() + 5); // 5 min by default
                }
                /** @type {Fl32_Dup_Shared_WAPI_User_Invite_Create.Request} */
                const req = wapiInvite.createReq();
                req.onetime = (this.lifeCount === LIFE_COUNT.ONE);
                req.dateExpired = date;
                req.userId = userId;
                /** @type {Fl32_Dup_Shared_WAPI_User_Invite_Create.Response} */
                const res = await gate.send(req, wapiInvite);
                if (res?.code) {
                    const code = res.code;
                    // compose URL to add new friend
                    const host = `https://${config.urlBase}`;
                    const route = DEF.ROUTE_INVITE_VALIDATE.replace(':code', code);
                    const url = `${host}/#${route}`;
                    // open sharing options or print out sign up link to console
                    if (self.navigator.share) {
                        // smartphone mode
                        const data = {
                            title: 'D.U.P.L.O.',
                            text: this.$t('wg.contact.add.phoneMsg'),
                            url,
                        };
                        await self.navigator.share(data);
                    } else {
                        // browser mode
                        console.log(`invitation url: ${url}`);
                    }
                }
            }
        },
    };
}
