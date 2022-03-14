/**
 * Contact card to view/edit contacts properties.
 *
 * @namespace Fl32_Dup_Front_Ui_Contacts_Card_Route
 */
// MODULE'S VARS
const NS = 'Fl32_Dup_Front_Ui_Contacts_Card_Route';

// MODULE'S FUNCTIONS
/**
 * Factory to create template for new Vue component instances.
 *
 * @returns {Fl32_Dup_Front_Ui_Contacts_Card_Route.vueCompTmpl}
 */
export default function (spec) {
    /** @type {Fl32_Dup_Front_Defaults} */
    const DEF = spec['Fl32_Dup_Front_Defaults$'];
    /** @type {TeqFw_Web_Front_App_Store_IDB} */
    const idb = spec['Fl32_Dup_Front_Store_Db$'];
    /** @type {Fl32_Dup_Front_Store_Entity_Contact} */
    const idbContact = spec['Fl32_Dup_Front_Store_Entity_Contact$'];
    /** @type {Fl32_Dup_Front_Store_Entity_Band} */
    const idbBand = spec['Fl32_Dup_Front_Store_Entity_Band$'];
    /** @type {Fl32_Dup_Front_Ui_Contacts_List_Card.vueCompTmpl} */
    const cardData = spec['Fl32_Dup_Front_Ui_Contacts_List_Card$'];
    /** @type {Fl32_Dup_Front_Rx_Title} */
    const rxTitle = spec['Fl32_Dup_Front_Rx_Title$'];
    /** @type {TeqFw_Core_Shared_Util_Format.dateTime|function} */
    const formatDate = spec['TeqFw_Core_Shared_Util_Format.dateTime'];

    // VARS
    const I_BAND = idbBand.getIndexes();
    const template = `
<layout-base>
    <q-card>
    
        <q-card-section class="q-gutter-sm">
            <q-input :label="$t('wg.contact.card.nick')"
                     :disable="freezeRegister"
                     outlined
                     v-model="fldNick"
            />
            <div class="t-grid-cols">
                <q-input :label="$t('wg.contact.card.dateFrom')"
                         disable
                         outlined
                         v-model="dateFrom"
                />
                 <q-btn dense flat round icon="message" v-on:click="goToChat" />
            </div>
        </q-card-section>

        <q-card-actions align="center">
            <q-btn :label="$t('btn.ok')"
                   color="primary"
                   padding="xs lg"
                   v-on:click="onSubmit"
            />
        </q-card-actions>

    </q-card>
    
    <q-dialog v-model="displayInfo">
        <q-card>
            <q-card-section>
                <div class="text-h6">{{$t('wg.contact.add.dgLink.title')}}</div>
            </q-card-section>
        </q-card>
    </q-dialog>
</layout-base>
`;
    /**
     * Template to create new component instances using Vue.
     *
     * @const {Object} vueCompTmpl
     * @memberOf Fl32_Dup_Front_Ui_Contacts_Card_Route
     */
    return {
        teq: {package: DEF.SHARED.NAME},
        name: NS,
        template,
        components: {cardData},
        data() {
            return {
                /** @type {Fl32_Dup_Front_Store_Entity_Contact.Dto} */
                card: null,
                displayInfo: false,
                fldNick: null,
            };
        },
        props: {
            id: Number, // card id in IDB
        },
        computed: {
            dateFrom() {
                return formatDate(this?.card?.date);
            },
        },
        methods: {
            async goToChat() {
                const cardId = Number.parseInt(this.id);
                const trx = await idb.startTransaction(idbBand);
                /** @type {Fl32_Dup_Front_Store_Entity_Band.Dto} */
                const band = await idb.readOne(trx, idbBand, cardId, I_BAND.BY_CONTACT);
                if (band) {
                    const route = DEF.ROUTE_CHAT_BAND.replace(':id', band.id);
                    this.$router.push(route);
                }
                trx.commit();
            },
            async onSubmit() {
                this.displayInfo = true;
                this.card.nick = this.fldNick.trim();
                const entity = idbContact.createDto(this.card);
                const trx = await idb.startTransaction(idbContact);
                await idb.updateOne(trx, idbContact, entity);
                await trx.commit();
                this.displayInfo = false;
                rxTitle.set(this.card.nick);
            },
        },
        async mounted() {
            const trx = await idb.startTransaction(idbContact, false);
            /** @type {Fl32_Dup_Front_Store_Entity_Contact.Dto} */
            const card = await idb.readOne(trx, idbContact, Number.parseInt(this.id));
            await trx.commit();
            this.card = card;
            this.fldNick = card.nick;
            rxTitle.set(card.nick);
        },
    };
}
