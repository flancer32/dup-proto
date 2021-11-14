/**
 * Messages output widget.
 *
 * @namespace Fl32_Dup_Front_Widget_Chat_Msg_Band
 */
// MODULE'S VARS
const NS = 'Fl32_Dup_Front_Widget_Chat_Msg_Band';

// MODULE'S FUNCTIONS
/**
 * TeqFW DI factory function to get dependencies for the object.
 *
 * @returns {Fl32_Dup_Front_Widget_Chat_Msg_Band.vueCompTmpl}
 */
export default function (spec) {
    /** @type {Fl32_Dup_Front_Defaults} */
    const DEF = spec['Fl32_Dup_Front_Defaults$'];
    /** @type {Fl32_Dup_Front_Widget_Chat_Msg_Band_Item.vueCompTmpl} */
    const message = spec['Fl32_Dup_Front_Widget_Chat_Msg_Band_Item$'];
    /** @type {Fl32_Dup_Front_Rx_Chat_Current} */
    const rxChat = spec['Fl32_Dup_Front_Rx_Chat_Current$'];

    // DEFINE WORKING VARS
    const template = `
<div class="q-pa-md row justify-center">
    <div style="width: 100%; max-width: 400px">
        <message v-for="(item) in band"
                 :item="item"
        />
    </div>
</div>
`;
    /**
     * Template to create new component instances using Vue.
     *
     * @const {Object} vueCompTmpl
     * @memberOf Fl32_Dup_Front_Widget_Chat_Msg_Band
     */
    return {
        teq: {package: DEF.SHARED.NAME},
        name: NS,
        template,
        components: {message},
        data() {
            return {
                band: []
            };
        },
        methods: {},
        async mounted() {
            this.band = rxChat.getMessages();
        },
    };
}
