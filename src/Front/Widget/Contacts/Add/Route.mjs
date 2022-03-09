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
    /** @type {TeqFw_Core_Shared_Api_ILogger} */
    const logger = spec['TeqFw_Core_Shared_Api_ILogger$$']; // instance
    /** @type {TeqFw_Web_Front_Mod_App_Front_Identity} */
    const frontIdentity = spec['TeqFw_Web_Front_Mod_App_Front_Identity$'];
    /** @type {Fl32_Dup_Front_Mod_User_Profile} */
    const modProfile = spec['Fl32_Dup_Front_Mod_User_Profile$'];
    /** @type {TeqFw_Web_Front_Api_Dto_Config} */
    const config = spec['TeqFw_Web_Front_Api_Dto_Config$'];
    /** @type {TeqFw_Web_Front_App_Event_Bus} */
    const eventsFront = spec['TeqFw_Web_Front_App_Event_Bus$'];
    /** @type {TeqFw_Web_Front_App_Connect_Event_Direct_Portal} */
    const portalBack = spec['TeqFw_Web_Front_App_Connect_Event_Direct_Portal$'];
    /** @type {Fl32_Dup_Shared_Event_Front_User_Invite_Create_Request} */
    const esfCreateReq = spec['Fl32_Dup_Shared_Event_Front_User_Invite_Create_Request$'];
    /** @type {Fl32_Dup_Shared_Event_Back_User_Invite_Create_Response} */
    const esbCreateRes = spec['Fl32_Dup_Shared_Event_Back_User_Invite_Create_Response$'];
    /** @type {Fl32_Dup_Front_Widget_Contacts_Add_DialogLink.vueCompTmpl} */
    const dialogLink = spec['Fl32_Dup_Front_Widget_Contacts_Add_DialogLink$'];
    /** @type {Fl32_Dup_Front_Ui_Contacts_Add_DialogLink} */
    const uiDialogLink = spec['Fl32_Dup_Front_Ui_Contacts_Add_DialogLink$'];

    // VARS
    const template = `
<layout-base>
    <div class="q-pt-xs q-gutter-xs">
        <div class="text-subtitle1 text-center">{{ $t('wg.contact.add.title') }}:</div>
        <q-card>
            <q-card-section>
                <div class="text-subtitle2">{{ $t('wg.contact.add.time.title') }}:</div>
                <q-option-group
                        :options="lifeTimeOpts"
                        inline
                        v-model="lifeTime"
                ></q-option-group>
            </q-card-section>

            <q-separator></q-separator>

            <q-card-section>
                <div class="text-subtitle2">{{ $t('wg.contact.add.count.title') }}:</div>
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
                >{{ $t('btn.ok') }}
                </q-btn>
            </q-card-actions>
            {{ message }}
        </q-card>
        <dialog-link
                :display="displayLink"
                @onHide="displayLink=false"
        />
    </div>
</layout-base>
`;

    // MAIN
    logger.setNamespace(NS);

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
        components: {dialogLink},
        data() {
            return {
                displayLink: false,
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
                // FUNCS
                /**
                 * Request back to create invite code.
                 * @param userId
                 * @param date
                 * @param onetime
                 * @return {Promise<unknown>}
                 */
                async function createInvite(userId, date, onetime) {
                    const profile = await modProfile.get();
                    return new Promise((resolve) => {
                        // VARS
                        let idFail, subs;

                        // FUNCS
                        /**
                         * @param {Fl32_Dup_Shared_Event_Back_User_Invite_Create_Response.Dto} data
                         * @param {TeqFw_Web_Shared_App_Event_Trans_Message_Meta.Dto} meta
                         */
                        function onResponse({data, meta}) {
                            clearTimeout(idFail);
                            resolve(data.code);
                            eventsFront.unsubscribe(subs);
                        }

                        // MAIN
                        subs = eventsFront.subscribe(esbCreateRes.getEventName(), onResponse);
                        idFail = setTimeout(() => {
                            eventsFront.unsubscribe(subs);
                            resolve();
                        }, DEF.TIMEOUT_EVENT_RESPONSE); // return nothing after timeout
                        // send invite data to back
                        const message = esfCreateReq.createDto();
                        message.data.dateExpired = date;
                        message.data.onetime = onetime;
                        message.data.userId = userId;
                        message.data.userNick = profile.nick;
                        portalBack.publish(message);
                    });
                }

                /**
                 * Compose URL for invitation link.
                 * @param {string} code invitation code from server
                 * @return {string}
                 */
                function composeUrl(code) {
                    const protocol = location.protocol; // 'https:'
                    let port = location.port; // empty string for default ports (80 & 443)
                    if (port !== '') port = `:${port}`
                    const host = `${protocol}//${config.urlBase}${port}`;
                    const route = DEF.ROUTE_INVITE_VALIDATE.replace(':code', code);
                    return `${host}/#${route}`;
                }

                // MAIN
                const userId = frontIdentity.getFrontId();
                const date = new Date();
                if (this.lifeTime === LIFE_TIME.HOUR) {
                    date.setHours(date.getHours() + 1);
                } else if (this.lifeTime === LIFE_TIME.DAY) {
                    date.setDate(date.getDate() + 1);
                } else {
                    date.setMinutes(date.getMinutes() + 5); // 5 min by default
                }
                const onetime = (this.lifeCount === LIFE_COUNT.ONE);
                const code = await createInvite(userId, date, onetime);
                if (code) {
                    // compose URL to add new friend
                    const url = composeUrl(code);
                    // open sharing options or print out sign up link to console
                    if (self.navigator.share) {
                        // smartphone mode
                        const data = {
                            title: 'Dup Chat',
                            text: this.$t('wg.contact.add.phoneMsg'),
                            url,
                        };
                        await self.navigator.share(data);
                    } else {
                        // desktop mode
                        logger.info(`invitation url: ${url}`);
                        this.displayLink = true;
                        const ui = uiDialogLink.get();
                        ui.displayLink(url);
                    }
                } else {
                    logger.error(`Cannot create invite code on backend.`);
                }
            }
        },
    };
}
