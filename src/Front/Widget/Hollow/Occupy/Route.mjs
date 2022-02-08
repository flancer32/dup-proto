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
    /** @type {TeqFw_Web_Front_App_Logger} */
    const logger = spec['TeqFw_Web_Front_App_Logger$'];
    /** @type {Fl32_Dup_Front_Mod_Hollow_IsFree} */
    const modHollowIsFree = spec['Fl32_Dup_Front_Mod_Hollow_IsFree$'];
    /** @type {Fl32_Dup_Front_Dto_User} */
    const dtoProfile = spec['Fl32_Dup_Front_Dto_User$'];
    /** @type {Fl32_Dup_Front_Proc_User_RegNew.process|function} */
    const procRegNew = spec['Fl32_Dup_Front_Proc_User_RegNew$'];
    /** @type {TeqFw_Web_Push_Front_Mod_Subscription} */
    const modSubscript = spec['TeqFw_Web_Push_Front_Mod_Subscription$'];
    /** @type {Fl32_Dup_Front_Mod_User_Profile} */
    const modProfile = spec['Fl32_Dup_Front_Mod_User_Profile$'];

    // DEFINE WORKING VARS
    const template = `
<layout-empty>
    <q-card class="bg-white" style="min-width:245px">
        <q-card-section v-if="displayIsOccupied">
            <div class="text-subtitle2">{{$t('wg.hollow.occupy.msg.occupied')}}</div>
        </q-card-section>
        <q-card-section v-if="displaySubscribe">
            <div class="text-subtitle2">{{$t('wg.hollow.occupy.msg.subscribe')}}</div>
            <q-card-actions align="center">
                <q-btn :label="$t('btn.subscribe')" padding="xs lg" :disable="freezeSubscribe" v-on:click="subscribe"></q-btn>
            </q-card-actions>
        </q-card-section>
        <q-card-section v-if="displayRegister">
            <div class="text-subtitle2">{{$t('wg.hollow.occupy.msg.nick')}}</div>
            <q-input
                    :label="$t('wg.hollow.occupy.nick.label')"
                    :disable="freezeRegister"
                    outlined
                    v-model="fldNick"
            ></q-input>
            <q-card-actions align="center">
                <q-btn :label="$t('btn.ok')" padding="xs lg" :disable="freezeRegister" v-on:click="create"></q-btn>
            </q-card-actions>
        </q-card-section>
        <q-card-section v-if="displaySuccess">
            <div class="text-subtitle2">{{$t('wg.hollow.occupy.msg.success')}}</div>
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
     * @memberOf Fl32_Dup_Front_Widget_Hollow_Occupy_Route
     */
    return {
        teq: {package: DEF.SHARED.NAME},
        name: NS,
        template,
        components: {},
        data() {
            return {
                displayError: false,
                displayIsOccupied: false,
                displayRegister: false,
                displaySubscribe: false,
                displaySuccess: false,
                fldError: null,
                fldNick: null,
                freezeRegister: false,
                freezeSubscribe: false,
            };
        },
        methods: {
            async create() {
                const me = this;
                this.freezeRegister = true;
                this.displayError = false;
                try {
                    // start process to register the first user on backend
                    const {success} = await procRegNew();
                    // create profile in IDB and update hollow state
                    if (success) {
                        const profile = dtoProfile.createDto()
                        profile.nick = this.fldNick;
                        await modProfile.set(profile);
                        this.displayRegister = false;
                        this.displaySuccess = true;
                        // redirect user to homepage
                        setTimeout(() => {
                            me.$router.push(DEF.ROUTE_HOME);
                        }, DEF.TIMEOUT_UI_DELAY);
                    } else {
                        this.fldError = `Some error is occurred on the server, cannot add user to the user tree.`;
                        logger.error(this.fldError);
                        this.displayError = true;
                    }
                } catch (e) {
                    this.fldError = `Exception: ${e.message}`;
                    this.displayError = true;
                    logger.error(this.fldError);
                }
                this.freezeRegister = false;
            },

            async subscribe() {
                this.freezeSubscribe = true;
                const isSubscribed = await modSubscript.subscribe();
                // switch UI
                if (isSubscribed) {
                    this.displaySubscribe = false;
                    this.displayRegister = true;
                } else {
                    logger.error('Cannot subscribe new user to Web Push API on hollow occupation.');
                }
                this.freezeSubscribe = false;
            }
        },
        /**
         * Redirect to homepage is user is authenticated.
         * @return {Promise<void>}
         */
        async mounted() {
            // get data from IDB and calculate state
            /** @type {Fl32_Dup_Front_Dto_User.Dto} */
            const profile = await modProfile.get();
            if (await modHollowIsFree.get() === true) {
                const canSubscribe = await modSubscript.canSubscribe();
                const hasSubscription = await modSubscript.hasSubscription();
                const needSubscribe = canSubscribe && !hasSubscription;
                this.displaySubscribe = needSubscribe;
                this.displayRegister = (!needSubscribe) && (profile?.nick === undefined);
            } else {
                // user is authenticated, goto home page
                this.displayIsOccupied = true;
                if (profile?.nick) this.$router.push(DEF.ROUTE_HOME);
            }
        },
    };
}
