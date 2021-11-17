/**
 * Navigation for chat mode.
 *
 * @namespace Fl32_Dup_Front_Layout_Nav_Chat
 */
// MODULE'S VARS
const NS = 'Fl32_Dup_Front_Layout_Nav_Chat';

// MODULE'S FUNCTIONS
/**
 * TeqFW DI factory function to get dependencies for the object.
 *
 * @returns {Fl32_Dup_Front_Layout_Nav_Chat.vueCompTmpl}
 */
export default function (spec) {
    /** @type {Fl32_Dup_Front_Defaults} */
    const DEF = spec['Fl32_Dup_Front_Defaults$'];
    /** @type {Fl32_Dup_Front_Widget_Contacts_List_Card.vueCompTmpl} */
    const card = spec['Fl32_Dup_Front_Widget_Contacts_List_Card$'];
    /** @type {TeqFw_Web_Front_Store_IDB} */
    const idb = spec['Fl32_Dup_Front_Store_Db$'];
    /** @type {Fl32_Dup_Front_Store_Entity_Contact_Card} */
    const idbContact = spec['Fl32_Dup_Front_Store_Entity_Contact_Card$'];

    // DEFINE WORKING VARS
    const template = `
<q-list bordered padding class="rounded-borders text-primary">

    <q-item to="${DEF.ROUTE_HOME}"
            active-class="bg-primary text-white"
            clickable
            v-ripple
    >
        <q-item-section avatar>
            <q-icon name="home"/>
        </q-item-section>
        <q-item-section>{{$t('navig.2home')}}</q-item-section>
    </q-item>

    <q-item v-for="(card) in cards"
        :to="chat(card)"
        active-class="bg-primary text-white"
    >{{card?.nick}}</q-item>

</q-list>


`;
    /**
     * Template to create new component instances using Vue.
     *
     * @const {Object} vueCompTmpl
     * @memberOf Fl32_Dup_Front_Layout_Nav_Chat
     */
    return {
        teq: {package: DEF.SHARED.NAME},
        name: NS,
        template,
        components: {card},
        data() {
            return {
                /** @type {Fl32_Dup_Front_Store_Entity_Contact_Card.Dto[]} */
                cards: [],
            };
        },
        methods: {
            /**
             * @param {Fl32_Dup_Front_Store_Entity_Contact_Card.Dto} card
             */
            chat(card) {
                const id = card?.userId;
                return DEF.ROUTE_CHAT_USER.replace(':id', String(id));
            }
        },
        async mounted() {
            // this code is called twice on widget mount cause widget is mounted twice (Vue Router ???)
            if (this.cards.length === 0) {
                const trx = await idb.startTransaction(idbContact, false);
                /** @type {Fl32_Dup_Front_Store_Entity_Contact_Card.Dto[]} */
                const cards = await idb.readSet(trx, idbContact);
                for (const one of cards) {
                    this.cards.push(one);
                }
            }
        },
    };
}
