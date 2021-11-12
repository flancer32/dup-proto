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
    /** @type {TeqFw_User_Front_Api_ISession} */
    const _session = spec['TeqFw_User_Front_Api_ISession$'];
    /** @type {TeqFw_Web_Front_Service_Gate} */
    const gate = spec['TeqFw_Web_Front_Service_Gate$'];
    /** @type {Fl32_Dup_Shared_WAPI_User_List.Factory} */
    const wapiContacts = spec['Fl32_Dup_Shared_WAPI_User_List.Factory$'];
    /** @type {Fl32_Dup_Front_Widget_Contacts_List_Card.vueCompTmpl} */
    const card = spec['Fl32_Dup_Front_Widget_Contacts_List_Card$'];
    /** @type {Fl32_Dup_Front_Dto_Contacts_Card} */
    const dtoCard = spec['Fl32_Dup_Front_Dto_Contacts_Card$'];
    /** @type {Fl32_Dup_Front_Model_Contacts} */
    const modContacts = spec['Fl32_Dup_Front_Model_Contacts$'];

    // DEFINE WORKING VARS
    const A_CARD = dtoCard.getAttributes();
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
            /** @type {Fl32_Dup_Front_Store_Entity_User.Dto} */
            const userCurrent = _session.getUser();
            const userId = userCurrent.id;
            /** @type {Fl32_Dup_Shared_WAPI_User_List.Request} */
            const req = wapiContacts.createReq();
            /** @type {Fl32_Dup_Shared_WAPI_User_List.Response} */
            const res = await gate.send(req, wapiContacts);
            const update = [];
            for (const key of Object.keys(res?.cards)) {
                const wapi = res.cards[key];
                if (wapi.userId === userId) continue;
                // noinspection JSCheckFunctionSignatures
                const card = dtoCard.createDto({[A_CARD.WAPI_CARD]: wapi});
                update.push(card);
            }
            modContacts.setValues(update);
        },
    };
}
