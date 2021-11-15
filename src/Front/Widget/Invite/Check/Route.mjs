/**
 * Route to check invitation code on the front app and to add new user.
 *
 * @namespace Fl32_Dup_Front_Widget_Invite_Check_Route
 */
// MODULE'S VARS
const NS = 'Fl32_Dup_Front_Widget_Invite_Check_Route';

// MODULE'S FUNCTIONS
/**
 * Factory to create template for new Vue component instances.
 *
 * @returns {Fl32_Dup_Front_Widget_Invite_Check_Route.vueCompTmpl}
 */
export default function (spec) {
    /** @type {Fl32_Dup_Front_Defaults} */
    const DEF = spec['Fl32_Dup_Front_Defaults$'];
    /** @type {TeqFw_User_Front_Api_ISession} */
    const session = spec['TeqFw_User_Front_Api_ISession$'];
    /** @type {TeqFw_Web_Front_Service_Gate} */
    const gate = spec['TeqFw_Web_Front_Service_Gate$'];
    /** @type {Fl32_Dup_Shared_WAPI_User_Invite_Validate.Factory} */
    const wapiValidate = spec['Fl32_Dup_Shared_WAPI_User_Invite_Validate#Factory$'];
    /** @type {Fl32_Dup_Shared_WAPI_User_Create.Factory} */
    const wapiCreate = spec['Fl32_Dup_Shared_WAPI_User_Create#Factory$'];
    /** @type {TeqFw_Web_Front_Store} */
    const store = spec['TeqFw_Web_Front_Store$'];
    /** @type {Fl32_Dup_Front_Store_Single_User} */
    const metaUser = spec['Fl32_Dup_Front_Store_Single_User$'];
    // TODO: change to interface after WF-516
    /** @type {Fl32_Dup_Shared_Api_Crypto_Key_IManager} */
    const mgrKey = spec['Fl32_Dup_Front_Model_Crypto_Key_Manager$'];
    /** @type {Fl32_Dup_Front_Dto_Key_Asym} */
    const dtoKey = spec['Fl32_Dup_Front_Dto_Key_Asym$'];

    // DEFINE WORKING VARS
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
     * @memberOf Fl32_Dup_Front_Widget_Invite_Check_Route
     */
    return {
        teq: {package: DEF.SHARED.NAME},
        name: NS,
        template,
        components: {},
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
                // DEFINE INNER FUNCTIONS
                /**
                 * @param {string} code
                 * @param {string} nick
                 * @param {Fl32_Dup_Front_Dto_User_Subscription.Dto} subscript
                 * @param {string} pubKey
                 * @return {Promise<Fl32_Dup_Shared_WAPI_User_Create.Response|boolean>}
                 */
                async function createUserOnServer(code, nick, subscript, pubKey) {
                    /** @type {Fl32_Dup_Shared_WAPI_User_Create.Request} */
                    const req = wapiCreate.createReq();
                    req.endpoint = subscript.endpoint;
                    req.invite = code;
                    req.nick = nick;
                    req.keyAuth = subscript.keys.auth;
                    req.keyP256dh = subscript.keys.p256dh;
                    req.keyPub = pubKey;
                    // noinspection JSValidateTypes
                    /** @type {Fl32_Dup_Shared_WAPI_User_Create.Response} */
                    return await gate.send(req, wapiCreate);
                }

                // MAIN FUNCTIONALITY
                // generate keys for asymmetric encryption
                const keys = await mgrKey.generateAsyncKeys();
                // get user data with subscription details from IDB and compose WAPI-request
                // noinspection JSValidateTypes
                /** @type {Fl32_Dup_Front_Store_Single_User.Dto} */
                const dto = await store.get(metaUser.getEntityName());
                const res = await createUserOnServer(this.code, this.fldNick, dto.subscription, keys.publicKey);
                // generate symmetric key and save user data into IDB
                if (res.userId) {
                    dto.id = res.userId;
                    dto.serverPubKey = res.serverPublicKey;
                    dto.key = dtoKey.createDto();
                    dto.key.public = keys.publicKey;
                    dto.key.secret = keys.secretKey;
                    await store.set(metaUser.getEntityName(), dto);
                    this.displayRegister = false;
                    this.displaySuccess = true;
                    // redirect user to homepage
                    setTimeout(() => {
                        session.reopen(DEF.ROUTE_HOME);
                    }, 2000);
                } else {
                    this.displayRegister = false;
                    this.displayError = true;
                    this.fldError = `Some error is occurred on the server, cannot get ID for the new user.`;
                    console.log(this.fldError);
                }
            },

            async subscribe() {
                // DEFINE INNER FUNCTIONS
                async function subscribePush(key) {
                    /** @type {PushSubscriptionOptionsInit} */
                    const opts = {
                        userVisibleOnly: true,
                        applicationServerKey: key
                    };
                    const sw = await navigator.serviceWorker.ready;
                    return await sw.pushManager.subscribe(opts);
                }

                // MAIN FUNCTIONALITY
                try {
                    /** @type {PushSubscription} */
                    const pushSubscription = await subscribePush(this.vapidPubKey);
                    // save subscription to IDB Store
                    /** @type {typeof Fl32_Dup_Front_Store_Single_User.ATTR} */
                    const ATTR = metaUser.getAttributes();
                    const json = pushSubscription.toJSON();
                    // noinspection JSCheckFunctionSignatures
                    const dto = metaUser.createDto({[ATTR.SUBSCRIPTION]: json});
                    await store.set(metaUser.getEntityName(), dto);
                    // switch UI
                    this.displaySubscribe = false;
                    this.displayRegister = true;
                } catch (e) {
                    this.displaySubscribe = false;
                    this.displayError = true;
                    this.fldError = `Some error is occurred. See console log for details. ${e}`;
                    console.log(this.fldError);
                }
            }
        },
        /**
         * Redirect to homepage is user is authenticated otherwise load server keys and add new user.
         * @return {Promise<void>}
         */
        async mounted() {
            // DEFINE INNER FUNCTIONS
            // MAIN FUNCTIONALITY
            const authorized = await session.checkUserAuthenticated();
            if (authorized) {
                this.$router.push(DEF.ROUTE_HOME);
            } else {
                const req = wapiValidate.createReq();
                req.code = this.code;
                /** @type {Fl32_Dup_Shared_WAPI_User_Invite_Validate.Response} */
                const res = await gate.send(req, wapiValidate);
                this.displayCodeVerify = false;
                if (res?.webPushKey) {
                    this.vapidPubKey = res.webPushKey;
                    /** @type {Fl32_Dup_Front_Store_Single_User.Dto} */
                    const dto = await store.get(metaUser.getEntityName());
                    this.displaySubscribe = !(typeof dto?.subscription?.endpoint === 'string');
                    if (!this.displaySubscribe) {
                        this.displayRegister = (dto?.id === undefined);
                        if (!this.displayRegister) this.$router.push(DEF.ROUTE_HOME);
                    }
                } else {
                    this.displayCodeWrong = true;
                }
            }
        },
    };
}
