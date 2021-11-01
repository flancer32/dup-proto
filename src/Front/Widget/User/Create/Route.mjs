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
 * @memberOf Fl32_Dup_Front_Widget_User_Create_Route
 * @returns {Fl32_Dup_Front_Widget_User_Create_Route.vueCompTmpl}
 */
export default function Factory(spec) {
    /** @type {Fl32_Dup_Front_Defaults} */
    const DEF = spec['Fl32_Dup_Front_Defaults$'];
    /** @type {TeqFw_Web_Front_Service_Gate} */
    const gate = spec['TeqFw_Web_Front_Service_Gate$'];
    /** @type {TeqFw_Web_Push_Shared_Service_Route_Load_ServerKey.Factory} */
    const routeLoadKey = spec['TeqFw_Web_Push_Shared_Service_Route_Load_ServerKey#Factory$'];
    /** @type {Fl32_Dup_Shared_WApi_User_Create.Factory} */
    const routeCreate = spec['Fl32_Dup_Shared_WApi_User_Create#Factory$'];
    /** @type {TeqFw_Web_Front_Store} */
    const store = spec['TeqFw_Web_Front_Store$'];
    /** @type {Fl32_Dup_Front_Store_User} */
    const metaUser = spec['Fl32_Dup_Front_Store_User$'];
    /** @type {Fl32_Dup_Front_Dto_Key_Asym} */
    const dtoKey = spec['Fl32_Dup_Front_Dto_Key_Asym$'];

    // DEFINE WORKING VARS
    const template = `
<layout-empty>
    <q-card class="t-bg-white" style="min-width:245px">
        <q-card-section v-if="!hasSubscription">
            <div class="text-subtitle2">{{$t('wg.user.create.msg.subscribe')}}</div>
            <q-card-actions align="center">
                <q-btn :label="$t('btn.subscribe')" padding="xs lg" v-on:click="subscribe"></q-btn>
            </q-card-actions>
        </q-card-section>
        <q-card-section v-if="hasSubscription">
            <div class="text-subtitle2">{{$t('wg.user.create.msg.complete')}}</div>
            <q-input
                    :label="$t('wg.user.create.nick.label')"
                    outlined
                    v-model="fldNick"
            ></q-input>
            <q-card-actions align="center">
                <q-btn :label="$t('btn.ok')" padding="xs lg" v-on:click="create"></q-btn>
            </q-card-actions>
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
            };
        },
        methods: {
            async create() {

                function buf2hex(buffer) { // buffer is an ArrayBuffer
                    return [...new Uint8Array(buffer)]
                        .map(x => x.toString(16).padStart(2, '0'))
                        .join('');
                }

                const crypto = window.crypto.subtle;
                let start = performance.now();
                // const rsa = await crypto.generateKey(
                //     {
                //         name: "RSA-OAEP",
                //         modulusLength: 4096,
                //         publicExponent: new Uint8Array([1, 0, 1]),
                //         hash: "SHA-256"
                //     },
                //     true,
                //     ["encrypt", "decrypt"]
                // );
                let finish = performance.now();
                const deltaRsa = finish - start;

                start = performance.now();
                const ecdsa = await crypto.generateKey(
                    {
                        name: "ECDSA",
                        namedCurve: "P-256"
                    },
                    true,
                    ["sign", "verify"]
                );
                finish = performance.now();
                const deltaAes = finish - start;
                console.log(`Time: ${deltaRsa} ms; ${deltaAes} ms;`);

                const keyPub = await crypto.exportKey('raw', ecdsa.publicKey);
                const keyPriv = await crypto.exportKey('pkcs8', ecdsa.privateKey);
                const expPub = buf2hex(keyPub);
                const expPriv = buf2hex(keyPriv);
                // noinspection JSValidateTypes
                /** @type {Fl32_Dup_Front_Store_User.Dto} */
                const dto = await store.get(metaUser.getEntityName());
                /** @type {Fl32_Dup_Shared_WApi_User_Create.Request} */
                const req = routeCreate.createReq();
                req.endpoint = dto.subscription.endpoint;
                req.nick = this.fldNick;
                req.keyAuth = dto.subscription.keys.auth;
                req.keyP256dh = dto.subscription.keys.p256dh;
                req.keyPub = expPub;
                // noinspection JSValidateTypes
                /** @type {Fl32_Dup_Shared_WApi_User_Create.Response} */
                const res = await gate.send(req, routeCreate);
                console.log(`userId: ${res.userId}`);
                dto.key = dtoKey.createDto();
                dto.key.public = expPub;
                dto.key.private = expPriv;
                await store.set(metaUser.getEntityName(), dto);
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
                    const pushSubscription = await subscribePush(res.key);
                    console.log(pushSubscription.subscriptionId);
                    console.log(pushSubscription.endpoint);
                    console.log(JSON.stringify(pushSubscription));
                    this.hasSubscription = true;

                    // save subscription to IDB Store
                    /** @type {typeof Fl32_Dup_Front_Store_User.ATTR} */
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
        async mounted() {
            // noinspection JSValidateTypes
            /** @type {Fl32_Dup_Front_Store_User.Dto} */
            const dto = await store.get(metaUser.getEntityName());
            this.hasSubscription = (typeof dto?.subscription?.endpoint === 'string');
        },
    };
}

// finalize code components for this es6-module
Object.defineProperty(Factory, 'name', {value: `${NS}.Factory`});
