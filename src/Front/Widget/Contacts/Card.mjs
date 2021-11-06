/**
 * Contacts card.
 *
 * @namespace Fl32_Dup_Front_Widget_Contacts_Card
 */
// MODULE'S VARS
const NS = 'Fl32_Dup_Front_Widget_Contacts_Card';

// MODULE'S FUNCTIONS
/**
 * Factory to create template for new Vue component instances.
 *
 * @returns {Fl32_Dup_Front_Widget_Contacts_Card.vueCompTmpl}
 */
export default function (spec) {
    /** @type {Fl32_Dup_Front_Defaults} */
    const DEF = spec['Fl32_Dup_Front_Defaults$'];
    /** @type {TeqFw_Core_Shared_Util.formatDateTime|function} */
    const formatDateTime = spec['TeqFw_Core_Shared_Util.formatDateTime'];

    // DEFINE WORKING VARS
    const template = `
<q-card>
    <q-card-section>
        <div class="text-subtitle1">{{nick}} (#{{id}})</div>
        <div class="text-body2">{{dateRegistered}}</div>
    </q-card-section>
</q-card>
`;
    /**
     * Template to create new component instances using Vue.
     *
     * @const {Object} vueCompTmpl
     * @memberOf Fl32_Dup_Front_Widget_Contacts_Card
     */
    return {
        teq: {package: DEF.SHARED.NAME},
        name: NS,
        template,
        props: {
            /** @type {Fl32_Dup_Front_Dto_Message.Dto} */
            card: null
        },
        computed: {
            dateRegistered() {
                return formatDateTime(this?.card?.wapiCard?.dateRegistered);
            },
            id() {
                return this?.card?.wapiCard?.userId;
            },
            nick() {
                return this?.card?.wapiCard?.nick || 'Anon';
            }
        },
        methods: {},
        async mounted() {

        },
    };
}
