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
    /** @type {TeqFw_Core_Shared_Util.formatDateTime|function} */
    const formatDateTime = spec['TeqFw_Core_Shared_Util.formatDateTime'];
    /** @type {TeqFw_Web_Front_Store_IDB} */
    const idb = spec['Fl32_Dup_Front_Store_Db$'];
    /** @type {Fl32_Dup_Front_Store_Entity_Contact_Card} */
    const metaContact = spec['Fl32_Dup_Front_Store_Entity_Contact_Card$'];

    // DEFINE WORKING VARS
    const template = `
<q-card v-on:click="chat">
    <q-card-section>
        <div class="text-subtitle1">{{nick}} (#{{id}})</div>
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
            id() {
                return this.card?.userId;
            },
            nick() {
                return this.card?.nick || 'Anon';
            }
        },
        methods: {
            async chat() {
                // DEFINE INNER FUNCTIONS

                /**
                 * @param {Fl32_Dup_Shared_Dto_Contacts_Card.Dto} wapi
                 * @return {Promise<void>}
                 */
                async function addCardToIDB(wapi) {
                    /** @type {IDBTransaction} */
                    const trx = await idb.startTransaction(metaContact);
                    const dto = metaContact.createDto();
                    dto.id = wapi.userId;
                    dto.keyPub = wapi.keyPublic;
                    dto.nick = wapi.nick;
                    dto.parentId = wapi.parentId;
                    dto.userId = wapi.userId;
                    await idb.add(trx, metaContact, dto);
                    await trx.commit(); // TODO: should we use 'await commit' here?
                }

                /**
                 * @param {number} userId
                 * @return {Promise<Fl32_Dup_Front_Store_Entity_Contact_Card.Dto|null>}
                 */
                async function found(userId) {
                    const trxRead = await idb.startTransaction(metaContact, false);
                    return await idb.readOne(trxRead, metaContact, userId);
                }

                // MAIN FUNCTIONALITY
                /** @type {Fl32_Dup_Shared_Dto_Contacts_Card.Dto} */
                const wapi = this.card.wapiCard;
                // check this card exists in local address book
                if (!await found(wapi.userId)) await addCardToIDB(wapi);
                // ... then redirect to chat route
                const route = DEF.ROUTE_CHAT_USER.replace(':id', this.id);
                this.$router.push(route);
            }
        },
        async mounted() {

        },
    };
}
