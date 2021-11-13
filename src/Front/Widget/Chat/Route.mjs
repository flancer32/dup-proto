/**
 * 'Current Chat' route.
 *
 * @namespace Fl32_Dup_Front_Widget_Chat_Route
 */
// MODULE'S VARS
const NS = 'Fl32_Dup_Front_Widget_Chat_Route';

// MODULE'S FUNCTIONS
/**
 * Factory to create template for new Vue component instances.
 *
 * @returns {Fl32_Dup_Front_Widget_Chat_Route.vueCompTmpl}
 */
export default function (spec) {
    /** @type {Fl32_Dup_Front_Defaults} */
    const DEF = spec['Fl32_Dup_Front_Defaults$'];
    /** @type {Fl32_Dup_Front_Widget_Chat_Msg_Band.vueCompTmpl} */
    const band = spec['Fl32_Dup_Front_Widget_Chat_Msg_Band$'];
    /** @type {Fl32_Dup_Front_Rx_Chat_Title} */
    const rxTitle = spec['Fl32_Dup_Front_Rx_Chat_Title$'];
    /** @type {Fl32_Dup_Front_Rx_Chat_Current} */
    const rxChat = spec['Fl32_Dup_Front_Rx_Chat_Current$'];
    /** @type {TeqFw_Web_Front_Store_IDB} */
    const idb = spec['Fl32_Dup_Front_Store_Db$'];
    /** @type {Fl32_Dup_Front_Store_Entity_Contact_Card} */
    const metaContact = spec['Fl32_Dup_Front_Store_Entity_Contact_Card$'];

    // DEFINE WORKING VARS
    const template = `
<layout-chat>
    <router-view></router-view>
</layout-chat>
`;
    /**
     * Template to create new component instances using Vue.
     *
     * @const {Object} vueCompTmpl
     * @memberOf Fl32_Dup_Front_Widget_Chat_Route
     */
    return {
        teq: {package: DEF.SHARED.NAME},
        name: NS,
        template,
        components: {band},
        data() {
            return {};
        },
        props: {
            id: String,
        },
        methods: {},
        async mounted() {
            const trxRead = await idb.startTransaction(metaContact, false);
            /** @type {Fl32_Dup_Front_Store_Entity_Contact_Card.Dto} */
            const found = await idb.readOne(trxRead, metaContact, parseInt(this.id));
            if (found) {
                rxChat.setTypeUser();
                rxChat.setTitle(found.nick);
                rxChat.setOtherSideId(found.userId);
                rxTitle.set(found.nick);
            }
        },
    };
}
