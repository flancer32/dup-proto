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
    /** @type {TeqFw_Core_Shared_Api_ILogger} */
    const logger = spec['TeqFw_Core_Shared_Api_ILogger$$']; // instance
    /** @type {Fl32_Dup_Front_Mod_Hollow_IsFree} */
    const modHollowIsFree = spec['Fl32_Dup_Front_Mod_Hollow_IsFree$'];
    /** @type {Fl32_Dup_Front_Dto_User} */
    const dtoProfile = spec['Fl32_Dup_Front_Dto_User$'];
    /** @type {Fl32_Dup_Front_Proc_User_Register.process|function} */
    const procReg = spec['Fl32_Dup_Front_Proc_User_Register$'];
    /** @type {Fl32_Dup_Front_Mod_User_Profile} */
    const modProfile = spec['Fl32_Dup_Front_Mod_User_Profile$'];

    // VARS
    const template = `
<layout-empty>
    <q-card class="bg-white" style="min-width:245px">
        <q-card-section v-if="displayIsOccupied">
            <div class="text-subtitle2">{{$t('wg.hollow.occupy.msg.occupied')}}</div>
        </q-card-section>
        <q-card-section v-if="displayRegister">
            <div class="text-subtitle2">{{$t('wg.hollow.occupy.title')}}</div>
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

    // MAIN
    logger.setNamespace(NS);

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
                displaySuccess: false,
                fldError: null,
                fldNick: null,
                freezeRegister: false,
            };
        },
        methods: {
            async create() {
                const me = this;
                this.freezeRegister = true;
                this.displayError = false;
                try {
                    // start process to register the first user on backend
                    const {success} = await procReg();
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
                this.displayRegister = (profile?.nick === undefined);
            } else {
                // user is authenticated, goto home page
                this.displayIsOccupied = true;
                if (profile?.nick) this.$router.push(DEF.ROUTE_HOME);
            }
        },
    };
}
