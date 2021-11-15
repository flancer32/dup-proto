/**
 * Route widget to chat with other user.
 *
 * @namespace Fl32_Dup_Front_Widget_Chat_User_Route
 */
// MODULE'S VARS
const NS = 'Fl32_Dup_Front_Widget_Chat_User_Route';

// MODULE'S FUNCTIONS
/**
 * TeqFW DI factory function to get dependencies for the object.
 *
 * @returns {Fl32_Dup_Front_Widget_Chat_User_Route.vueCompTmpl}
 */
export default function (spec) {
    /** @type {Fl32_Dup_Front_Defaults} */
    const DEF = spec['Fl32_Dup_Front_Defaults$'];
    /** @type {Fl32_Dup_Front_Widget_Chat_Msg_Band} */
    const msgBand = spec['Fl32_Dup_Front_Widget_Chat_Msg_Band$'];
    /** @type {TeqFw_Web_Front_Store_IDB} */
    const idb = spec['Fl32_Dup_Front_Store_Db$'];
    /** @type {Fl32_Dup_Front_Store_Entity_Contact_Card} */
    const idbContact = spec['Fl32_Dup_Front_Store_Entity_Contact_Card$'];
    /** @type {Fl32_Dup_Front_Store_Entity_Msg} */
    const idbMsg = spec['Fl32_Dup_Front_Store_Entity_Msg$'];
    /** @type {Fl32_Dup_Front_Rx_Chat_Current} */
    const rxChat = spec['Fl32_Dup_Front_Rx_Chat_Current$'];
    /** @type {Fl32_Dup_Front_Dto_Message} */
    const dtoMsg = spec['Fl32_Dup_Front_Dto_Message$'];

    // DEFINE WORKING VARS
    /** @type {typeof Fl32_Dup_Front_Store_Entity_Msg.ATTR} */
    const A_MSG = idbMsg.getAttributes();
    const template = `
<layout-chat>
    <msg-band/>
</layout-chat>
`;
    /**
     * Template to create new component instances using Vue.
     *
     * @const {Object} vueCompTmpl
     * @memberOf Fl32_Dup_Front_Widget_Chat_User_Route
     */
    return {
        teq: {package: DEF.SHARED.NAME},
        name: NS,
        template,
        components: {msgBand},
        data() {
            return {};
        },
        props: {
            id: Number,
        },
        computed: {},
        methods: {},
        async mounted() {
            // validate contact card is in IDB
            const trx = await idb.startTransaction(idbContact, false);
            const found = await idb.readOne(trx, idbContact, parseInt(this.id));
            if (!found) {
                this.$router.push(DEF.ROUTE_CONTACTS_LIST);
            } else {
                const bandId = found.userId;
                rxChat.setTypeUser();
                rxChat.setTitle(found.nick);
                rxChat.setOtherSideId(bandId);
                // load messages from IDB
                const trx = await idb.startTransaction(idbMsg, false);
                const query = IDBKeyRange.only(bandId);
                /** @type {Fl32_Dup_Front_Store_Entity_Msg.Dto[]} */
                const items = await idb.readSet(trx, idbMsg, A_MSG.BAND_ID, query);
                // sort selected messages by date asc
                items.some((a, b) => {
                    return (a.date - b.date);
                });
                const messages = [];
                for (const item of items) {
                    const dto = dtoMsg.createDto();
                    dto.body = item.body;
                    dto.date = item.date;
                    dto.sent = (item.authorId !== item.bandId);
                    messages.push(dto);
                }
                rxChat.resetBand(messages);

            }
        },
    };
}
