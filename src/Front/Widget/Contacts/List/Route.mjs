/**
 * List contacts route.
 *
 * @namespace Fl32_Dup_Front_Widget_Contacts_List_Route
 */
// MODULE'S VARS
const NS = 'Fl32_Dup_Front_Widget_Contacts_List_Route';

// MODULE'S FUNCTIONS
/**
 * Factory to create template for new Vue component instances.
 *
 * @returns {Fl32_Dup_Front_Widget_Contacts_List_Route.vueCompTmpl}
 */
export default function (spec) {
    /** @type {Fl32_Dup_Front_Defaults} */
    const DEF = spec['Fl32_Dup_Front_Defaults$'];
    /** @type {Fl32_Dup_Front_Widget_Contacts_List_Card.vueCompTmpl} */
    const card = spec['Fl32_Dup_Front_Widget_Contacts_List_Card$'];
    /** @type {Fl32_Dup_Front_Model_Contacts} */
    const modContacts = spec['Fl32_Dup_Front_Model_Contacts$'];

    /** @type {TeqFw_Web_Front_Store_IDB} */
    const idb = spec['Fl32_Dup_Front_Store_Db$'];
    /** @type {Fl32_Dup_Front_Store_Entity_Contact_Card} */
    const idbContact = spec['Fl32_Dup_Front_Store_Entity_Contact_Card$'];

    // DEFINE WORKING VARS
    const template = `
<layout-base>
    <div class="q-pt-xs q-gutter-xs">
        <card v-for="(card) in cards"
            :card="card" 
        />
    </div>
</layout-base>
`;
    /**
     * Template to create new component instances using Vue.
     *
     * @const {Object} vueCompTmpl
     * @memberOf Fl32_Dup_Front_Widget_Contacts_List_Route
     */
    return {
        teq: {package: DEF.SHARED.NAME},
        name: NS,
        template,
        components: {card},
        data() {
            return {
                cards: modContacts.getRef(),
            };
        },
        methods: {},
        async mounted() {
            // await modContacts.loadFromServer();
            const trx = await idb.startTransaction(idbContact);
            /** @type {Fl32_Dup_Front_Store_Entity_Contact_Card.Dto[]} */
            const cards = await idb.readSet(trx, idbContact);
            if (cards.length === 0) {
                // add fake data to IDB
                for (let i = 1; i < 10; i++) {
                    const card = idbContact.createDto();
                    card.keyPub = 'pub';
                    card.userId = i;
                    card.nick = `nick_${i}`;
                    await idb.add(trx, idbContact, card);
                }
            } else {
                this.cards = cards;
            }
        },
    };
}
