/**
 * Dialog to display referral link in desktop mode.
 *
 * @namespace Fl32_Dup_Front_Widget_Contacts_Add_DialogLink
 */
// MODULE'S VARS
const NS = 'Fl32_Dup_Front_Widget_Contacts_Add_DialogLink';

// MODULE'S FUNCTIONS
/**
 * TeqFW DI factory function to get dependencies for the object.
 *
 * @returns {Fl32_Dup_Front_Widget_Contacts_Add_DialogLink.vueCompTmpl}
 */
export default function (spec) {
    /** @type {Fl32_Dup_Front_Defaults} */
    const DEF = spec['Fl32_Dup_Front_Defaults$'];
    /** @type {Fl32_Dup_Front_Ui_Contacts_Add_DialogLink} */
    const uiLink = spec['Fl32_Dup_Front_Ui_Contacts_Add_DialogLink$'];
    /** @type {Fl32_Dup_Front_Lib_Qrious|function} */
    const QRious = spec['Fl32_Dup_Front_Lib_Qrious#'];

    // DEFINE WORKING VARS
    const template = `
<q-dialog v-model="display">
    <q-card>

        <q-card-section>
            <div class="text-h6">{{$t('wg.contact.add.dgLink.title')}}</div>
        </q-card-section>
        
        <q-card-section class="q-pt-none text-center">
            <canvas id="qrcode"></canvas>
        </q-card-section>
                
        <q-card-section class="q-pt-none text-center">
            <a :href="link">{{$t('wg.contact.add.dgLink.link')}}</a>
        </q-card-section>

        <q-card-actions align="center">
            <q-btn color="primary" :label="$t('btn.ok')" padding="xs lg" v-close-popup/>
        </q-card-actions>
    </q-card>
</q-dialog>
`;
    /**
     * Template to create new component instances using Vue.
     *
     * @const {Object} vueCompTmpl
     * @memberOf Fl32_Dup_Front_Widget_Contacts_Add_DialogLink
     */
    return {
        teq: {package: DEF.SHARED.NAME},
        name: NS,
        template,
        components: {},
        data() {
            return {
                display: false,
                link: null,
            };
        },
        props: {
            link: String,
        },
        methods: {
            displayLink(link) {
                this.link = link;
                this.display = true;
            }
        },
        async mounted() {
            uiLink.set(this);
        },
        updated() {
            const elCanvas = document.getElementById('qrcode');
            new QRious({
                element: elCanvas,
                value: this.link
            });
        },
    };
}
