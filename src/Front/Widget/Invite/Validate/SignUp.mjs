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
    /** @type {TeqFw_Web_Front_Mod_App_Front_Identity} */
    const frontIdentity = spec['TeqFw_Web_Front_Mod_App_Front_Identity$'];
    /** @type {Fl32_Dup_Front_Mod_User_Profile} */
    const modProfile = spec['Fl32_Dup_Front_Mod_User_Profile$'];
    /** @type {TeqFw_Web_Push_Front_Mod_Subscription} */
    const modSubscript = spec['TeqFw_Web_Push_Front_Mod_Subscription$'];
    /** @type {Fl32_Dup_Front_Dto_User} */
    const dtoProfile = spec['Fl32_Dup_Front_Dto_User$'];
    /** @type {Fl32_Dup_Front_Proc_User_Register.process|function} */
    const procReg = spec['Fl32_Dup_Front_Proc_User_Register$'];

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
        props: {
            inviteCode: String,
        },
        methods: {
            async create() {
                // start process to register user on backend
                const {success} = await procReg({
                    nick: this.fldNick,
                    invite: this.inviteCode,
                    pubKey: frontIdentity.getPublicKey(),
                });

                // save user id into IDB
                if (success) {
                    // save profile in IDB
                    const profile = dtoProfile.createDto()
                    profile.nick = this.fldNick;
                    await modProfile.set(profile);
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
                const isSubscribed = await modSubscript.subscribe();
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
            const canSubscribe = await modSubscript.canSubscribe();
            const hasSubscription = await modSubscript.hasSubscription();
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
