/**
 * Route to check invitation code on the front app and to add new user.
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
    /** @type {TeqFw_Web_Front_Store_IDB} */
    const idb = spec['Fl32_Dup_Front_Store_Db$'];
    /** @type {Fl32_Dup_Front_Store_Entity_Contact_Card} */
    const idbCard = spec['Fl32_Dup_Front_Store_Entity_Contact_Card$'];
    /** @type {TeqFw_User_Front_DSource_User} */
    const dsUser = spec['TeqFw_User_Front_DSource_User$'];
    /** @type {TeqFw_Web_Push_Front_DSource_Subscription} */
    const dsSubscript = spec['TeqFw_Web_Push_Front_DSource_Subscription$'];
    /** @type {Fl32_Dup_Front_DSource_User_Profile} */
    const dsProfile = spec['Fl32_Dup_Front_DSource_User_Profile$'];
    /** @type {TeqFw_Web_Front_App_Event_Bus} */
    const eventsFront = spec['TeqFw_Web_Front_App_Event_Bus$'];
    /** @type {TeqFw_Web_Front_App_Connect_Event_Direct_Portal} */
    const portalBack = spec['TeqFw_Web_Front_App_Connect_Event_Direct_Portal$'];
    /** @type {TeqFw_Web_Push_Shared_Dto_Subscription} */
    const dtoSubscript = spec['TeqFw_Web_Push_Shared_Dto_Subscription$'];
    /** @type {Fl32_Dup_Front_Dto_User} */
    const dtoProfile = spec['Fl32_Dup_Front_Dto_User$'];
    /** @type {Fl32_Dup_Front_Proc_User_Register} */
    const procSignUp = spec['Fl32_Dup_Front_Proc_User_Register$'];
    /** @type {Fl32_Dup_Shared_Event_Front_User_Invite_Validate_Request} */
    const esfValidReq = spec['Fl32_Dup_Shared_Event_Front_User_Invite_Validate_Request$'];
    /** @type {Fl32_Dup_Shared_Event_Back_User_Invite_Validate_Response} */
    const esbValidRes = spec['Fl32_Dup_Shared_Event_Back_User_Invite_Validate_Response$'];

    // DEFINE WORKING VARS
    const I_CONTACT = idbCard.getIndexes();
    const template = `
<layout-empty>
    <q-card class="bg-white" style="min-width:245px">
        <q-card-section v-if="displayCodeVerify">
            <div class="text-subtitle2 text-center">{{$t('wg.invite.verify.msg.checkCode')}}</div>
        </q-card-section>
        <q-card-section v-if="displayCodeWrong">
            <div class="text-subtitle2 text-center">{{$t('wg.invite.verify.msg.wrongCode')}}</div>
        </q-card-section>
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
</layout-empty>
`;
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
        data() {
            return {
                displayCodeVerify: true,
                displayCodeWrong: false,
                displayError: false,
                displayRegister: false,
                displaySubscribe: false,
                displaySuccess: false,
                fldError: null,
                fldNick: null,
                vapidPubKey: null,
            };
        },
        props: {
            code: String,
        },
        methods: {
            async create() {
                const me = this;
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
                        me.$router.push(DEF.ROUTE_HOME);
                    }, 2000);
                } else {
                    this.displayRegister = false;
                    this.displayError = true;
                    this.fldError = `Some error is occurred on the server, cannot get ID for the new user.`;
                    logger.error(this.fldError);
                }
            },

            async subscribe() {
                // ENCLOSED FUNCTIONS
                async function subscribePush(key) {
                    logger.info(`Invited user starts subscription to Web Push API.`)
                    /** @type {PushSubscriptionOptionsInit} */
                    const opts = {
                        userVisibleOnly: true,
                        applicationServerKey: key
                    };
                    const sw = await navigator.serviceWorker.ready;
                    return await sw.pushManager.subscribe(opts);
                }

                // MAIN
                try {
                    /** @type {PushSubscription} */
                    const pushSubscription = await subscribePush(this.vapidPubKey);
                    // save subscription to IDB Store
                    const obj = pushSubscription.toJSON();
                    // noinspection JSCheckFunctionSignatures
                    const dto = dtoSubscript.createDto(obj);
                    await dsSubscript.set(dto);
                    logger.info(`Web Push API subscription for new user is done. Keys are stored to IDB.`);
                    // switch UI
                    this.displaySubscribe = false;
                    this.displayRegister = true;
                } catch (e) {
                    this.displaySubscribe = false;
                    this.displayError = true;
                    this.fldError = `Some error is occurred. See console log for details. ${e}`;
                    logger.error(this.fldError);
                }
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
                    const msg = esfValidReq.createDto();
                    msg.data.code = code;
                    portalBack.publish(msg);
                });
            }

            /**
             * Save parent contact.
             * @param {number} userId
             * @param {string} nick
             * @param {string} keyPub
             * @return {Promise<void>}
             */
            async function addParentCard(userId, nick, keyPub) {
                const dto = idbCard.createDto();
                dto.userId = userId;
                dto.nick = nick;
                dto.keyPub = keyPub;
                const trx = await idb.startTransaction(idbCard);
                const found = await idb.readOne(trx, idbCard, userId, I_CONTACT.BY_USER);
                if (!found) {
                    await idb.add(trx, idbCard, dto);
                    await trx.commit();
                    logger.info(`Contact card for parent #${userId} is added.`)
                } else {
                    logger.info(`Contact card for parent #${userId} is already added before.`)
                }
            }

            // MAIN
            const user = await dsUser.get();
            if (user?.id) {
                // this browser already has registered user, redirect to the home
                this.$router.push(DEF.ROUTE_HOME);
            } else {
                logger.info(`Invite validation is started (code: ${this.code}).`);
                const res = await validateInvite(this.code);
                this.displayCodeVerify = false;
                if (res?.webPushKey) {
                    logger.info(`Invite code '${this.code}' is valid.`);
                    await addParentCard(res.parentId, res.parentNick, res.parentPubKey);
                    this.vapidPubKey = res.webPushKey;
                    const sub = await dsSubscript.get();
                    const profile = await dsProfile.get();
                    this.displaySubscribe = !(typeof sub?.endpoint === 'string');
                    if (!this.displaySubscribe) {
                        this.displayRegister = (profile?.username === undefined);
                        if (!this.displayRegister)
                            this.$router.push(DEF.ROUTE_HOME);
                        else
                            logger.info(`Invited user has Web Push subscription but has no backend ID yet.`);
                    } else {
                        logger.info(`Invited user should subscribe to Web Push API.`);
                    }
                } else {
                    logger.error(`Invite validation response has no key to subscribe to use Web Push API.`);
                    this.displayCodeWrong = true;
                }
            }
        },
    };
}
