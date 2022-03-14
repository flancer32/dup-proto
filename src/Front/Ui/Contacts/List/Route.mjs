/**
 * List contacts route.
 *
 * @namespace Fl32_Dup_Front_Ui_Contacts_List_Route
 */
// MODULE'S VARS
const NS = 'Fl32_Dup_Front_Ui_Contacts_List_Route';

// MODULE'S FUNCTIONS
/**
 * Factory to create template for new Vue component instances.
 *
 * @returns {Fl32_Dup_Front_Ui_Contacts_List_Route.vueCompTmpl}
 */
export default function (spec) {
    /** @type {Fl32_Dup_Front_Defaults} */
    const DEF = spec['Fl32_Dup_Front_Defaults$'];
    /** @type {TeqFw_Web_Front_App_Store_IDB} */
    const idb = spec['Fl32_Dup_Front_Store_Db$'];
    /** @type {Fl32_Dup_Front_Store_Entity_Contact} */
    const idbContact = spec['Fl32_Dup_Front_Store_Entity_Contact$'];
    /** @type {Fl32_Dup_Front_Ui_Contacts_List_Card.vueCompTmpl} */
    const card = spec['Fl32_Dup_Front_Ui_Contacts_List_Card$'];

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
     * @memberOf Fl32_Dup_Front_Ui_Contacts_List_Route
     */
    return {
        teq: {package: DEF.SHARED.NAME},
        name: NS,
        template,
        components: {card},
        data() {
            return {
                /** @type {Fl32_Dup_Front_Store_Entity_Contact.Dto[]} */
                cards: [],
            };
        },
        async mounted() {
            const trx = await idb.startTransaction(idbContact);
            /** @type {Fl32_Dup_Front_Store_Entity_Contact.Dto[]} */
            this.cards = await idb.readSet(trx, idbContact);
            await trx.commit();
        },
    };
}
