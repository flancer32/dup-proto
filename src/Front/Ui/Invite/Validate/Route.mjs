/**
 * Check invitation code, add sender's card to contacts, create new user data if required,
 * send own contact card back.
 *
 * @namespace Fl32_Dup_Front_Ui_Invite_Validate_Route
 */
// MODULE'S VARS
const NS = 'Fl32_Dup_Front_Ui_Invite_Validate_Route';

// MODULE'S FUNCTIONS
/**
 * Factory to create template for new Vue component instances.
 *
 * @returns {Fl32_Dup_Front_Ui_Invite_Validate_Route.vueCompTmpl}
 */
export default function (spec) {
    /** @type {Fl32_Dup_Front_Defaults} */
    const DEF = spec['Fl32_Dup_Front_Defaults$'];
    /** @type {TeqFw_Core_Shared_Api_ILogger} */
    const logger = spec['TeqFw_Core_Shared_Api_ILogger$$']; // instance
    /** @type {TeqFw_Web_Auth_Front_Mod_Identity} */
    const modIdentity = spec['TeqFw_Web_Auth_Front_Mod_Identity$'];
    /** @type {Fl32_Dup_Front_Mod_User_Profile} */
    const modProfile = spec['Fl32_Dup_Front_Mod_User_Profile$'];
    /** @type {TeqFw_Web_Event_Front_Mod_Bus} */
    const eventsFront = spec['TeqFw_Web_Event_Front_Mod_Bus$'];
    /** @type {TeqFw_Web_Event_Front_Mod_Connect_Direct_Portal} */
    const portalBack = spec['TeqFw_Web_Event_Front_Mod_Connect_Direct_Portal$'];
    /** @type {Fl32_Dup_Shared_Event_Front_User_Invite_Validate_Request} */
    const esfValidReq = spec['Fl32_Dup_Shared_Event_Front_User_Invite_Validate_Request$'];
    /** @type {Fl32_Dup_Shared_Event_Front_Contact_Card_Add_Request} */
    const esfContactAddReq = spec['Fl32_Dup_Shared_Event_Front_Contact_Card_Add_Request$'];
    /** @type {Fl32_Dup_Shared_Event_Back_User_Invite_Validate_Response} */
    const esbValidRes = spec['Fl32_Dup_Shared_Event_Back_User_Invite_Validate_Response$'];
    /** @type {Fl32_Dup_Front_Ui_Invite_Validate_Contact} */
    const wgContact = spec['Fl32_Dup_Front_Ui_Invite_Validate_Contact$'];
    /** @type {Fl32_Dup_Front_Ui_Invite_Validate_SignUp} */
    const wgSignUp = spec['Fl32_Dup_Front_Ui_Invite_Validate_SignUp$'];

    // VARS
    const template = `
<layout-empty>

    <contact v-if="displayContacts"
             :nick="senderNick"
             :publicKey="senderPubKey"
             :userId="senderUserId"
             @onDone="contactAccepted"
    />

    <sign-up v-if="displaySignUp"
             :inviteCode="code"
             @onDone="signUpDone"
    />

    <q-card class="bg-white" style="min-width:245px">
        <q-card-section v-if="displayValidation">
            <div class="text-subtitle2 text-center">{{ $t('wg.invite.validate.msg.checkCode') }}</div>
        </q-card-section>
        <q-card-section v-if="displayInvalid">
            <div class="text-subtitle2 text-center">{{ $t('wg.invite.validate.msg.wrongCode') }}</div>
        </q-card-section>
    </q-card>

</layout-empty>
`;

    // MAIN
    logger.setNamespace(NS);

    /**
     * Template to create new component instances using Vue.
     *
     * @const {Object} vueCompTmpl
     * @memberOf Fl32_Dup_Front_Ui_Invite_Validate_Route
     */
    return {
        teq: {package: DEF.SHARED.NAME},
        name: NS,
        template,
        components: {
            contact: wgContact,
            signUp: wgSignUp,
        },
        data() {
            return {
                displayContacts: false,
                displayInvalid: false,
                displaySignUp: false,
                displayValidation: true,
                senderUserId: null,
                senderNick: null,
                senderPubKey: null,
            };
        },
        props: {
            code: String,
        },
        methods: {
            /**
             * Contact is accepted and new contact card is added to IDB.
             * Create new user if required and send this user's contact back.
             * @return {Promise<void>}
             */
            async contactAccepted() {
                this.displayContacts = false;
                /** @type {Fl32_Dup_Front_Dto_User.Dto} */
                const profile = await modProfile.get();
                if (profile?.nick) {
                    // send this user contact back
                    const event = esfContactAddReq.createDto();
                    event.data.inviteCode = this.code;
                    event.data.nick = profile.nick;
                    event.data.publicKey = modIdentity.getPublicKey();
                    event.data.recipientId = this.senderUserId;
                    event.data.userId = modIdentity.getFrontBid();
                    portalBack.publish(event);
                    this.$router.push(DEF.ROUTE_HOME);
                } else {
                    // display widget to generate new user data (keys & subscription)
                    this.displaySignUp = true;
                }
            },

            async signUpDone() {
                this.$router.push(DEF.ROUTE_HOME);
            }
        },
        /**
         * Redirect to homepage is user is authenticated otherwise load server keys and add new user.
         * @return {Promise<void>}
         */
        async mounted() {
            // FUNCS
            /**
             * Send invitation code to server and get Web Push subscription data back.
             * @param {string} code
             * @return {Promise<Fl32_Dup_Shared_Event_Back_User_Invite_Validate_Response.Dto>}
             */
            async function validateInvite(code) {
                return new Promise((resolve) => {
                    // VARS
                    let idFail, subs;

                    // FUNCS
                    /**
                     * @param {Fl32_Dup_Shared_Event_Back_User_Invite_Validate_Response.Dto} data
                     * @param {TeqFw_Web_Event_Shared_Dto_Event_Meta.Dto} meta
                     */
                    function onResponse({data, meta}) {
                        clearTimeout(idFail);
                        resolve(data);
                        eventsFront.unsubscribe(subs);
                    }

                    // MAIN
                    subs = eventsFront.subscribe(esbValidRes.getEventName(), onResponse);
                    idFail = setTimeout(() => {
                        eventsFront.unsubscribe(subs);
                        resolve();
                    }, DEF.TIMEOUT_EVENT_RESPONSE); // return nothing after timeout
                    // request data from back

                    // publish event to back
                    const event = esfValidReq.createDto();
                    event.data.code = code;
                    portalBack.publish(event);
                });
            }

            // MAIN
            // get invite sender's data from server
            const res = await validateInvite(this.code);
            if (res.parentId) { // valid invite
                this.senderUserId = res.parentId;
                this.senderNick = res.parentNick;
                this.senderPubKey = res.parentPubKey;
                this.displayValidation = false;
                this.displayContacts = true;
            } else { // invalid invite
                this.displayValidation = false;
                this.displayInvalid = true;
                logger.error(`Invite validation response has no sender data.`);
            }
        },
    };
}
