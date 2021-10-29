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


    // DEFINE WORKING VARS
    const template = `
<layout-empty>
    <q-card class="t-bg-white">
        <q-card-section>
            <div class="text-subtitle2" style="min-width:245px">{{$t('wg.user.create.title')}}:</div>
       </q-card-section>
       <q-card-section>
            <q-input class="id-email"
                :label="$t('wg.user.create.nick.label')"
                outlined
                v-model="fldNick"
            ></q-input>
        </q-card-section>
        <q-card-actions align="center">
            <q-btn :label="$t('btn.ok')" padding="xs lg" v-on:click="create"></q-btn>
        </q-card-actions>
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
            return {};
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
            }
        },
        async mounted() { },
    };
}

// finalize code components for this es6-module
Object.defineProperty(Factory, 'name', {value: `${NS}.Factory`});
