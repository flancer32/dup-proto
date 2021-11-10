/**
 * Route to create new user on front app startup.
 *
 * @namespace Fl32_Dup_Front_Widget_User_Create_Route
 */
// MODULE'S VARS
const NS = 'Fl32_Dup_Front_Widget_User_Create_Route';

// MODULE'S FUNCTIONS
/**
 * Factory to create template for new Vue component instances.
 *
 * @returns {Fl32_Dup_Front_Widget_User_Create_Route.vueCompTmpl}
 */
export default function (spec) {
    /** @type {Fl32_Dup_Front_Defaults} */
    const DEF = spec['Fl32_Dup_Front_Defaults$'];
    /** @type {TeqFw_User_Front_Api_ISession} */
    const session = spec['TeqFw_User_Front_Api_ISession$'];
    /** @type {TeqFw_Web_Front_Service_Gate} */
    const gate = spec['TeqFw_Web_Front_Service_Gate$'];
    // TODO: change to interface after WF-516
    /** @type {Fl32_Dup_Shared_Api_Crypto_Key_IManager} */
    const mgrKey = spec['Fl32_Dup_Front_Model_Crypto_Key_Manager$'];
    /** @type {TeqFw_Web_Push_Shared_Service_Route_Load_ServerKey.Factory} */
    const routeLoadKey = spec['TeqFw_Web_Push_Shared_Service_Route_Load_ServerKey#Factory$'];
    /** @type {Fl32_Dup_Shared_WAPI_User_Create.Factory} */
    const routeCreate = spec['Fl32_Dup_Shared_WAPI_User_Create#Factory$'];
    /** @type {TeqFw_Web_Front_Store} */
    const store = spec['TeqFw_Web_Front_Store$'];
    /** @type {Fl32_Dup_Front_Store_Entity_User} */
    const metaUser = spec['Fl32_Dup_Front_Store_Entity_User$'];
    /** @type {Fl32_Dup_Front_Dto_Key_Asym} */
    const dtoKey = spec['Fl32_Dup_Front_Dto_Key_Asym$'];

    // DEFINE WORKING VARS
    const template = `
<layout-empty>
    <q-card class="bg-white" style="min-width:245px">
        <q-card-section v-if="!hasSubscription">
            <div class="text-subtitle2">{{$t('wg.user.create.msg.subscribe')}}</div>
            <q-card-actions align="center">
                <q-btn :label="$t('btn.subscribe')" padding="xs lg" v-on:click="subscribe"></q-btn>
            </q-card-actions>
        </q-card-section>
        <q-card-section v-if="hasSubscription && !isRegistered">
            <div class="text-subtitle2">{{$t('wg.user.create.msg.nick')}}</div>
            <q-input
                    :label="$t('wg.user.create.nick.label')"
                    outlined
                    v-model="fldNick"
            ></q-input>
            <q-card-actions align="center">
                <q-btn :label="$t('btn.ok')" padding="xs lg" v-on:click="create"></q-btn>
            </q-card-actions>
        </q-card-section>
        <q-card-section v-if="isRegistered">
            <div class="text-subtitle2">{{$t('wg.user.create.msg.success')}}</div>
        </q-card-section>
    </q-card>
</layout-empty>
`;
    /**
     * Template to create new component instances using Vue.
     *
     * @const {Object} vueCompTmpl
     * @memberOf Fl32_Dup_Front_Widget_User_Create_Route
     */
    return {
        teq: {package: DEF.SHARED.NAME},
        name: NS,
        template,
        components: {},
        data() {
            return {
                fldNick: null,
                hasSubscription: false,
                isRegistered: false,
            };
        },
        methods: {
            async create() {
                // generate keys for asymmetric encryption
                const keys = await mgrKey.generateAsyncKeys();
                // get user data with subscription details from IDB and compose WAPI-request
                // noinspection JSValidateTypes
                /** @type {Fl32_Dup_Front_Store_Entity_User.Dto} */
                const dto = await store.get(metaUser.getEntityName());
                /** @type {Fl32_Dup_Shared_WAPI_User_Create.Request} */
                const req = routeCreate.createReq();
                req.endpoint = dto.subscription.endpoint;
                req.nick = this.fldNick;
                req.keyAuth = dto.subscription.keys.auth;
                req.keyP256dh = dto.subscription.keys.p256dh;
                req.keyPub = keys.publicKey;
                // noinspection JSValidateTypes
                /** @type {Fl32_Dup_Shared_WAPI_User_Create.Response} */
                const res = await gate.send(req, routeCreate);
                // save user ID with key into IDB
                if (res.userId) {
                    dto.id = res.userId;
                    dto.serverPubKey = res.serverPublicKey;
                    dto.key = dtoKey.createDto();
                    dto.key.public = keys.publicKey;
                    dto.key.secret = keys.secretKey;
                    await store.set(metaUser.getEntityName(), dto);
                    this.isRegistered = true;
                    setTimeout(() => {
                        this.$router.push(DEF.ROUTE_HOME);
                    }, 2000);
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
                    /** @type {TeqFw_Web_Push_Shared_Service_Route_Load_ServerKey.Request} */
                    const req = routeLoadKey.createReq();
                    // noinspection JSValidateTypes
                    /** @type {TeqFw_Web_Push_Shared_Service_Route_Load_ServerKey.Response} */
                    const res = await gate.send(req, routeLoadKey);
                    console.log(`key: ${res.key}`);
                    /** @type {PushSubscription} */
                    const pushSubscription = await subscribePush(res.key);
                    this.hasSubscription = true;

                    // save subscription to IDB Store
                    /** @type {typeof Fl32_Dup_Front_Store_Entity_User.ATTR} */
                    const ATTR = metaUser.getAttributes();
                    const json = pushSubscription.toJSON();
                    // noinspection JSCheckFunctionSignatures
                    const dto = metaUser.createDto({[ATTR.SUBSCRIPTION]: json});
                    await store.set(metaUser.getEntityName(), dto);
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
                // noinspection JSValidateTypes
                /** @type {Fl32_Dup_Front_Store_Entity_User.Dto} */
                const dto = await store.get(metaUser.getEntityName());
                this.hasSubscription = (typeof dto?.subscription?.endpoint === 'string');
            }
        },
    };
}
