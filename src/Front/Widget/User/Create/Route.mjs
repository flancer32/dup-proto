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
    /** @type {TeqFw_Web_Front_Store} */
    const store = spec['TeqFw_Web_Front_Store$'];
    /** @type {Fl32_Dup_Front_Store_User} */
    const metaUser = spec['Fl32_Dup_Front_Store_User$'];

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
                hasSubscription: false
            };
        },
        methods: {
            async create() {
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
                const aes = await crypto.generateKey(
                    {
                        name: "AES-GCM",
                        length: 256
                    },
                    true,
                    ["encrypt", "decrypt"]
                );
                finish = performance.now();
                const deltaAes = finish - start;
                console.log(`Time: ${deltaRsa} ms; ${deltaAes} ms;`);


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
