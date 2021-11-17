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
    /** @type {Fl32_Dup_Front_Store_Entity_Msg} */
    const idbMsg = spec['Fl32_Dup_Front_Store_Entity_Msg$'];
    /** @type {Fl32_Dup_Front_Model_Chat_User} */
    const modChatUser = spec['Fl32_Dup_Front_Model_Chat_User$'];

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
        watch: {
            async id(current, old) {
                if (current !== old)
                    await modChatUser.loadBand(current);
                else
                    console.log(`The same ID on message band loading.`);
            }
        },
        async mounted() {
            console.log(`Loading message band #${this.id}...`);
            await modChatUser.loadBand(this.id);
        },
    };
}
