/**
 * Route to check hollow state on front app startup and create new user if the hollow is empty.
 *
 * @namespace Fl32_Dup_Front_Widget_Hollow_Occupy_Route
 */
// MODULE'S VARS
const NS = 'Fl32_Dup_Front_Widget_Hollow_Occupy_Route';

// MODULE'S FUNCTIONS
/**
 * Factory to create template for new Vue component instances.
 *
 * @returns {Fl32_Dup_Front_Widget_Hollow_Occupy_Route.vueCompTmpl}
 */
export default function (spec) {
    /** @type {Fl32_Dup_Front_Defaults} */
    const DEF = spec['Fl32_Dup_Front_Defaults$'];
    /** @type {TeqFw_User_Front_Api_ISession} */
    const session = spec['TeqFw_User_Front_Api_ISession$'];
    /** @type {TeqFw_Web_Front_App_Connect_WAPI} */
    const gate = spec['TeqFw_Web_Front_App_Connect_WAPI$'];
    // TODO: change to interface after WF-516
    /** @type {Fl32_Dup_Shared_Api_Crypto_Key_IManager} */
    const mgrKey = spec['Fl32_Dup_Front_Model_Crypto_Key_Manager$'];
    /** @type {TeqFw_Web_Push_Shared_WAPI_Load_ServerKey.Factory} */
    const wapiLoadKey = spec['TeqFw_Web_Push_Shared_WAPI_Load_ServerKey#Factory$'];
    /** @type {TeqFw_Web_Front_Store} */
    const store = spec['TeqFw_Web_Front_Store$'];
    /** @type {Fl32_Dup_Front_Store_Single_User} */
    const metaUser = spec['Fl32_Dup_Front_Store_Single_User$'];
    /** @type {Fl32_Dup_Front_Dto_Key_Asym} */
    const dtoKey = spec['Fl32_Dup_Front_Dto_Key_Asym$'];
    /** @type {Fl32_Dup_Front_DSource_Hollow_IsFree} */
    const dsHollowIsFree = spec['Fl32_Dup_Front_DSource_Hollow_IsFree$'];
    /** @type {Fl32_Dup_Front_Proc_User_Register} */
    const procSignUp = spec['Fl32_Dup_Front_Proc_User_Register$'];

    // DEFINE WORKING VARS
    const template = `
<layout-empty>
    <q-card class="bg-white" style="min-width:245px">
        <q-card-section v-if="isHollowOccupied">
            <div class="text-subtitle2">{{$t('wg.hollow.occupy.msg.occupied')}}</div>
        </q-card-section>
        <q-card-section v-if="needSubscribe">
            <div class="text-subtitle2">{{$t('wg.hollow.occupy.msg.subscribe')}}</div>
            <q-card-actions align="center">
                <q-btn :label="$t('btn.subscribe')" padding="xs lg" v-on:click="subscribe"></q-btn>
            </q-card-actions>
        </q-card-section>
        <q-card-section v-if="hasSubscription && !isRegistered">
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
        <q-card-section v-if="isRegistered">
            <div class="text-subtitle2">{{$t('wg.hollow.occupy.msg.success')}}</div>
        </q-card-section>
    </q-card>
</layout-empty>
`;
    /**
     * Template to create new component instances using Vue.
     *
     * @const {Object} vueCompTmpl
     * @memberOf Fl32_Dup_Front_Widget_Hollow_Occupy_Route
     */
    return {
        teq: {package: DEF.SHARED.NAME},
        name: NS,
        template,
        components: {},
        data() {
            return {
                fldNick: null,
                isHollowOccupied: false,
                isRegistered: false,
                needRegister: false,
                needSubscribe: false,
                hasSubscription: false,
            };
        },
        methods: {
            async create() {
                // MAIN FUNCTIONALITY
                // generate keys for asymmetric encryption
                const keys = await mgrKey.generateAsyncKeys();
                // get user data with subscription details from IDB and compose WAPI-request
                // noinspection JSValidateTypes
                /** @type {Fl32_Dup_Front_Store_Single_User.Dto} */
                const dto = await store.get(metaUser.getEntityName());
                // start process to register user on backend
                /** @type {Fl32_Dup_Shared_Event_Back_User_SignUp_Registered.Dto|null} */
                const res = await procSignUp.run({
                    nick: this.fldNick,
                    pubKey: keys.publicKey,
                    subscription: dto.subscription
                });
                // generate symmetric key and save user data into IDB
                if (res.userId) {
                    dto.id = res.userId;
                    dto.hollowSecretKey = await mgrKey.generateSecretKey();
                    dto.serverPubKey = res.serverPublicKey;
                    dto.key = dtoKey.createDto();
                    dto.key.public = keys.publicKey;
                    dto.key.secret = keys.secretKey;
                    await store.set(metaUser.getEntityName(), dto);
                    this.isRegistered = true;
                    // noinspection ES6MissingAwait
                    dsHollowIsFree.set(false);

                    // redirect user to homepage
                    setTimeout(() => {
                        session.reopen(DEF.ROUTE_HOME);
                    }, 2000);
                } else {
                    console.log(`Some error is occurred on the server, cannot get ID for new user.`);
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
                    /** @type {TeqFw_Web_Push_Shared_WAPI_Load_ServerKey.Request} */
                    const req = wapiLoadKey.createReq();
                    // noinspection JSValidateTypes
                    /** @type {TeqFw_Web_Push_Shared_WAPI_Load_ServerKey.Response} */
                    const res = await gate.send(req, wapiLoadKey);
                    /** @type {PushSubscription} */
                    const pushSubscription = await subscribePush(res.key);
                    // save subscription to IDB Store
                    /** @type {typeof Fl32_Dup_Front_Store_Single_User.ATTR} */
                    const ATTR = metaUser.getAttributes();
                    const json = pushSubscription.toJSON();
                    // noinspection JSCheckFunctionSignatures
                    const dto = metaUser.createDto({[ATTR.SUBSCRIPTION]: json});
                    await store.set(metaUser.getEntityName(), dto);
                    // switch UI
                    this.hasSubscription = true;
                    this.needSubscribe = false;
                } catch (e) {
                    console.error(e);
                }
            }
        },
        /**
         * Redirect to homepage is user is authenticated.
         * @return {Promise<void>}
         */
        async mounted() {
            const authorized = await session.checkUserAuthenticated();
            if (authorized) {
                this.$router.push(DEF.ROUTE_HOME);
            } else {
                if (dsHollowIsFree.get() === true) {
                    // noinspection JSValidateTypes
                    /** @type {Fl32_Dup_Front_Store_Single_User.Dto} */
                    const dto = await store.get(metaUser.getEntityName());
                    this.hasSubscription = (typeof dto?.subscription?.endpoint === 'string');
                    this.needSubscribe = !this.hasSubscription;
                    if (this.hasSubscription) this.needRegister = (dto?.id !== undefined);
                } else {
                    this.isHollowOccupied = true;
                }
            }
        },
    };
}
