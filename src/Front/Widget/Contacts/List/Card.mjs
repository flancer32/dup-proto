/**
 * Contacts card.
 *
 * @namespace Fl32_Dup_Front_Widget_Contacts_List_Card
 */
// MODULE'S VARS
const NS = 'Fl32_Dup_Front_Widget_Contacts_List_Card';

// MODULE'S FUNCTIONS
/**
 * Factory to create template for new Vue component instances.
 *
 * @returns {Fl32_Dup_Front_Widget_Contacts_List_Card.vueCompTmpl}
 */
export default function (spec) {
    /** @type {Fl32_Dup_Front_Defaults} */
    const DEF = spec['Fl32_Dup_Front_Defaults$'];
    /** @type {TeqFw_Web_Front_App_Store_IDB} */
    const idb = spec['Fl32_Dup_Front_Store_Db$'];
    /** @type {Fl32_Dup_Front_Store_Entity_Band} */
    const idbBand = spec['Fl32_Dup_Front_Store_Entity_Band$'];
    /** @type {TeqFw_Core_Shared_Util.formatDate|function} */
    const formatDate = spec['TeqFw_Core_Shared_Util.formatDate'];

    // ENCLOSED VARS
    const I_BAND = idbBand.getIndexes();
    const template = `
<q-card v-on:click="chat">
    <q-card-section>
        <div class="text-subtitle1">{{nick}}</div>
        <div class="text-caption text-right">{{$t('wg.contact.list.contact')}} #{{id}};
            {{$t('wg.contact.list.user')}} #{{userId}};
            {{$t('wg.contact.list.from')}} {{date}}</div>
    </q-card-section>
</q-card>
`;
    /**
     * Template to create new component instances using Vue.
     *
     * @const {Object} vueCompTmpl
     * @memberOf Fl32_Dup_Front_Widget_Contacts_List_Card
     */
    return {
        teq: {package: DEF.SHARED.NAME},
        name: NS,
        template,
        props: {
            /** @type {Fl32_Dup_Front_Store_Entity_Contact_Card.Dto} */
            card: null
        },
        computed: {
            date() {
                return formatDate(this.card?.date);
            },
            id() {
                return this.card?.id;
            },
            nick() {
                return this.card?.nick || 'Anon';
            },
            userId() {
                return this.card?.userId;
            },
        },
        methods: {
            async chat() {
                let bandId;
                const trx = await idb.startTransaction([idbBand]);
                /** @type {Fl32_Dup_Front_Store_Entity_Band.Dto} */
                const found = await idb.readOne(trx, idbBand, this.id, I_BAND.BY_CONTACT);
                if (!found) { // we need to create new band object
                    const dto = idbBand.createDto();
                    dto.contactRef = this.id;
                    const id = await idb.add(trx, idbBand, dto);
                    bandId = String(id);
                } else {
                    bandId = String(found?.id);
                }
                trx.commit();
                const route = DEF.ROUTE_CHAT_BAND.replace(':id', bandId);
                this.$router.push(route);
            }
        },
    };
}
