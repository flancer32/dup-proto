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
                const route = DEF.ROUTE_CHAT_USER.replace(':id', this.id);
                this.$router.push(route);
            }
        },
    };
}
