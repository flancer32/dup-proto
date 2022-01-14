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
    /** @type {TeqFw_User_Front_DSource_User} */
    const dsUser = spec['TeqFw_User_Front_DSource_User$'];
    /** @type {TeqFw_Web_Push_Front_DSource_Subscription} */
    const dsSubscript = spec['TeqFw_Web_Push_Front_DSource_Subscription$'];
    /** @type {Fl32_Dup_Front_DSource_Hollow_IsFree} */
    const dsHollowIsFree = spec['Fl32_Dup_Front_DSource_Hollow_IsFree$'];
    /** @type {Fl32_Dup_Front_DSource_User_Profile} */
    const dsProfile = spec['Fl32_Dup_Front_DSource_User_Profile$'];
    /** @type {TeqFw_Web_Push_Shared_Dto_Subscription} */
    const dtoSubscript = spec['TeqFw_Web_Push_Shared_Dto_Subscription$'];
    /** @type {Fl32_Dup_Front_Dto_User} */
    const dtoUser = spec['Fl32_Dup_Front_Dto_User$'];
    /** @type {Fl32_Dup_Front_Proc_User_Register} */
    const procSignUp = spec['Fl32_Dup_Front_Proc_User_Register$'];
    /** @type {TeqFw_Web_Front_App_Event_Bus} */
    const eventsFront = spec['TeqFw_Web_Front_App_Event_Bus$'];
    /** @type {TeqFw_Web_Front_App_Connect_Event_Direct_Portal} */
    const portalBack = spec['TeqFw_Web_Front_App_Connect_Event_Direct_Portal$'];
    /** @type {TeqFw_Web_Push_Shared_Event_Front_Key_Load_Request} */
    const esfKeyReq = spec['TeqFw_Web_Push_Shared_Event_Front_Key_Load_Request$'];
    /** @type {TeqFw_Web_Push_Shared_Event_Back_Key_Load_Response} */
    const esbKeyRes = spec['TeqFw_Web_Push_Shared_Event_Back_Key_Load_Response$'];

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
                // const keys = await mgrKey.generateAsyncKeys();
                // get user data with subscription details from IDB and compose WAPI-request
                // noinspection JSValidateTypes
                const user = await dsUser.get();
                const sub = await dsSubscript.get();
                // start process to register user on backend
                /** @type {Fl32_Dup_Shared_Event_Back_User_SignUp_Registered.Dto|null} */
                const res = await procSignUp.run({
                    nick: this.fldNick,
                    pubKey: user.keys.public,
                    subscription: sub
                });
                // generate symmetric key and save user data into IDB
                if (res?.userId) {
                    // save/update data in IDB
                    user.id = res.userId;
                    await dsUser.set(user);
                    await dsHollowIsFree.set(false);
                    const profile = dtoUser.createDto()
                    profile.username = this.fldNick;
                    await dsProfile.set(profile);
                    this.isRegistered = true;
                    // redirect user to homepage
                    setTimeout(() => {
                        session.reopen(DEF.ROUTE_HOME);
                    }, 2000);
                } else {
                    console.log(`Some error is occurred on the server, cannot get ID for new user.`);
                }
            },

            async subscribe() {
                // ENCLOSED FUNCTIONS
                async function loadServerKey() {
                    return new Promise((resolve) => {
                        const idFail = setTimeout(resolve, 10000); // return after timeout
                        eventsFront.subscribe(
                            esbKeyRes.getEventName(),
                            (event) => {
                                /** @type {TeqFw_Web_Push_Shared_Event_Back_Key_Load_Response.Dto} */
                                const data = event.data;
                                clearTimeout(idFail);
                                resolve(data.key);
                            }
                        );
                        const message = esfKeyReq.createDto();
                        portalBack.publish(message);
                    });
                }

                async function subscribePush(key) {
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
                    const key = await loadServerKey();
                    /** @type {PushSubscription} */
                    const pushSubscription = await subscribePush(key);
                    // save subscription to IDB Store
                    const obj = pushSubscription.toJSON();
                    // noinspection JSCheckFunctionSignatures
                    const dto = dtoSubscript.createDto(obj);
                    await dsSubscript.set(dto);
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
                    // get data from IDB and calculate state
                    const user = await dsUser.get();
                    const sub = await dsSubscript.get();
                    this.hasSubscription = (typeof sub?.endpoint === 'string');
                    this.needSubscribe = !this.hasSubscription;
                    if (this.hasSubscription) this.needRegister = (user?.id !== undefined);
                } else {
                    this.isHollowOccupied = true;
                }
            }
        },
    };
}
