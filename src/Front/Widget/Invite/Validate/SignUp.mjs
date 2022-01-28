/**
 * Process invite as new user.
 *
 * @namespace Fl32_Dup_Front_Widget_Invite_Validate_SignUp
 */
// MODULE'S VARS
const NS = 'Fl32_Dup_Front_Widget_Invite_Validate_SignUp';
const EVT_DONE = 'onDone';

// MODULE'S FUNCTIONS
/**
 * TeqFW DI factory function to get dependencies for the object.
 *
 * @returns {Fl32_Dup_Front_Widget_Invite_Validate_SignUp.vueCompTmpl}
 */
export default function (spec) {
    /** @type {Fl32_Dup_Front_Defaults} */
    const DEF = spec['Fl32_Dup_Front_Defaults$'];
    /** @type {TeqFw_Web_Front_App_Logger} */
    const logger = spec['TeqFw_Web_Front_App_Logger$'];
    /** @type {Fl32_Dup_Front_Dto_User} */
    const dtoProfile = spec['Fl32_Dup_Front_Dto_User$'];
    /** @type {Fl32_Dup_Front_DSource_User_Profile} */
    const dsProfile = spec['Fl32_Dup_Front_DSource_User_Profile$'];
    /** @type {TeqFw_Web_Push_Front_DSource_Subscription} */
    const dsSubscript = spec['TeqFw_Web_Push_Front_DSource_Subscription$'];
    /** @type {TeqFw_User_Front_DSource_User} */
    const dsUser = spec['TeqFw_User_Front_DSource_User$'];
    /** @type {Fl32_Dup_Front_Model_WebPush_Subscription} */
    const modSubscribe = spec['Fl32_Dup_Front_Model_WebPush_Subscription$'];
    /** @type {Fl32_Dup_Front_Proc_User_Register} */
    const procSignUp = spec['Fl32_Dup_Front_Proc_User_Register$'];

    // ENCLOSED VARS
    const template = `
<q-card class="bg-white" style="min-width:245px">
        <q-card-section v-if="displaySubscribe">
            <div class="text-subtitle2">{{$t('wg.invite.verify.msg.subscribe')}}</div>
            <q-card-actions align="center">
                <q-btn :label="$t('btn.subscribe')" padding="xs lg" v-on:click="subscribe"></q-btn>
            </q-card-actions>
        </q-card-section>     
        <q-card-section v-if="displayRegister">
            <div class="text-subtitle2">{{$t('wg.hollow.occupy.msg.nick')}}</div>
            <q-input
                    :label="$t('wg.hollow.occupy.nick.label')"
                    outlined
                    v-model="fldNick"
            ></q-input>
            <q-card-actions align="center">
                <q-btn :label="$t('btn.ok')" padding="xs lg" v-on:click="create"></q-btn>
            </q-card-actions>
        </q-card-section>
        <q-card-section v-if="displaySuccess">
            <div class="text-subtitle2 text-center">{{$t('wg.invite.verify.msg.success')}}</div>
        </q-card-section> 
        <q-card-section v-if="displayError">
            <div class="text-subtitle2 text-center">{{fldError}}</div>
        </q-card-section>           
    </q-card>
`;

    // MAIN
    /**
     * Template to create new component instances using Vue.
     *
     * @const {Object} vueCompTmpl
     * @memberOf Fl32_Dup_Front_Widget_Invite_Validate_SignUp
     */
    return {
        teq: {package: DEF.SHARED.NAME},
        name: NS,
        template,
        components: {},
        data() {
            return {
                displayError: false,
                displayRegister: false,
                displaySubscribe: false,
                displaySuccess: false,
                fldError: null,
                fldNick: null,
            };
        },
        methods: {
            async create() {
                const user = await dsUser.get();
                const sub = await dsSubscript.get();
                // start process to register user on backend
                /** @type {Fl32_Dup_Shared_Event_Back_User_SignUp_Registered.Dto|null} */
                const res = await procSignUp.run({
                    nick: this.fldNick,
                    invite: this.code,
                    pubKey: user.keys.public,
                    subscription: sub
                });
                // save user id into IDB
                if (res?.userId) {
                    // save/update data in IDB
                    user.id = res.userId;
                    await dsUser.set(user);
                    const profile = dtoProfile.createDto()
                    profile.username = this.fldNick;
                    await dsProfile.set(profile);
                    this.displayRegister = false;
                    this.displaySuccess = true;
                    // redirect user to homepage
                    setTimeout(() => {
                        this.$emit(EVT_DONE);
                    }, DEF.TIMEOUT_UI_DELAY);
                } else {
                    this.displayRegister = false;
                    this.displayError = true;
                    this.fldError = `Some error is occurred on the server, cannot get ID for the new user.`;
                    logger.error(this.fldError);
                }
            },

            /**
             * Subscribe new user to Web Push API.
             * @return {Promise<void>}
             */
            async subscribe() {
                const isSubscribed = await modSubscribe.subscribe();
                // switch UI
                if (isSubscribed) {
                    this.displaySubscribe = false;
                    this.displayRegister = true;
                } else {
                    this.displayError = true;
                    const msg = `Cannot subscribe new user to Web Push API.`;
                    this.fldError = msg;
                    logger.error(msg);
                }
            }
        },
        emits: [EVT_DONE],
        async mounted() {
            // check can we subscribe new user to Web Push API?
            const canSubscribe = await modSubscribe.canSubscribe();
            const hasSubscription = await modSubscribe.hasSubscription();
            this.displaySubscribe = canSubscribe && !hasSubscription;
            if (this.displaySubscribe) {
                logger.info(`Invited user should subscribe to Web Push API.`);
            } else {
                logger.info(`Invited user cannot subscribe to Web Push API (Apple?).`);
                this.displayRegister = true;
            }
        },
    };
}
