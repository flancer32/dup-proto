/**
 * Check invitation code, add sender's card to contacts, create new user data if required,
 * send own contact card back.
 *
 * @namespace Fl32_Dup_Front_Widget_Invite_Validate_Route
 */
// MODULE'S VARS
const NS = 'Fl32_Dup_Front_Widget_Invite_Validate_Route';

// MODULE'S FUNCTIONS
/**
 * Factory to create template for new Vue component instances.
 *
 * @returns {Fl32_Dup_Front_Widget_Invite_Validate_Route.vueCompTmpl}
 */
export default function (spec) {
    /** @type {Fl32_Dup_Front_Defaults} */
    const DEF = spec['Fl32_Dup_Front_Defaults$'];
    /** @type {TeqFw_Web_Front_App_Logger} */
    const logger = spec['TeqFw_Web_Front_App_Logger$'];
    /** @type {TeqFw_User_Front_DSource_User} */
    const dsUser = spec['TeqFw_User_Front_DSource_User$'];
    /** @type {Fl32_Dup_Front_DSource_User_Profile} */
    const dsProfile = spec['Fl32_Dup_Front_DSource_User_Profile$'];
    /** @type {TeqFw_Web_Front_App_Event_Bus} */
    const eventsFront = spec['TeqFw_Web_Front_App_Event_Bus$'];
    /** @type {TeqFw_Web_Front_App_Connect_Event_Direct_Portal} */
    const portalBack = spec['TeqFw_Web_Front_App_Connect_Event_Direct_Portal$'];
    /** @type {Fl32_Dup_Shared_Event_Front_User_Invite_Validate_Request} */
    const esfValidReq = spec['Fl32_Dup_Shared_Event_Front_User_Invite_Validate_Request$'];
    /** @type {Fl32_Dup_Shared_Event_Front_Contact_Card_Add_Request} */
    const esfContactAddReq = spec['Fl32_Dup_Shared_Event_Front_Contact_Card_Add_Request$'];
    /** @type {Fl32_Dup_Shared_Event_Back_User_Invite_Validate_Response} */
    const esbValidRes = spec['Fl32_Dup_Shared_Event_Back_User_Invite_Validate_Response$'];
    /** @type {Fl32_Dup_Front_Widget_Invite_Validate_Contact} */
    const wgContact = spec['Fl32_Dup_Front_Widget_Invite_Validate_Contact$'];
    /** @type {Fl32_Dup_Front_Widget_Invite_Validate_SignUp} */
    const wgSignUp = spec['Fl32_Dup_Front_Widget_Invite_Validate_SignUp$'];

    // ENCLOSED VARS
    const template = `
<layout-empty>

    <contact v-if="displayContacts"
             :nick="senderNick"
             :publicKey="senderPubKey"
             :userId="senderUserId"
             @onDone="contactAccepted"
    />

    <sign-up v-if="displaySignUp"
             @onDone="signUpDone"
    />

    <q-card class="bg-white" style="min-width:245px">
        <q-card-section v-if="displayValidation">
            <div class="text-subtitle2 text-center">{{ $t('wg.invite.verify.msg.checkCode') }}</div>
        </q-card-section>
        <q-card-section v-if="displayInvalid">
            <div class="text-subtitle2 text-center">{{ $t('wg.invite.verify.msg.wrongCode') }}</div>
        </q-card-section>
    </q-card>

</layout-empty>
`;

    // MAIN
    /**
     * Template to create new component instances using Vue.
     *
     * @const {Object} vueCompTmpl
     * @memberOf Fl32_Dup_Front_Widget_Invite_Validate_Route
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
                const user = await dsUser.get();
                if (user?.id) {
                    // send this user contact back
                    const profile = await dsProfile.get();
                    const event = esfContactAddReq.createDto();
                    event.data.nick = profile.username;
                    event.data.publicKey = user.keys.public;
                    event.data.recipientId = this.senderUserId;
                    event.data.userId = user.id;
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
            // ENCLOSED FUNCTIONS
            /**
             * Send invitation code to server and get Web Push subscription data back.
             * @param {string} code
             * @return {Promise<Fl32_Dup_Shared_Event_Back_User_Invite_Validate_Response.Dto>}
             */
            async function validateInvite(code) {
                return new Promise((resolve) => {
                    // ENCLOSED VARS
                    let idFail, subs;

                    // ENCLOSED FUNCTIONS
                    /**
                     * @param {Fl32_Dup_Shared_Event_Back_User_Invite_Validate_Response.Dto} data
                     * @param {TeqFw_Web_Shared_App_Event_Trans_Message_Meta.Dto} meta
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
