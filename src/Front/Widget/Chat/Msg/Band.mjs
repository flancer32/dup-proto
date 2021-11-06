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
    /** @type {Fl32_Dup_Front_Model_Msg_Band} */
    const modBand = spec['Fl32_Dup_Front_Model_Msg_Band$'];
    /** @type {Fl32_Dup_Front_Dto_Message} */
    const dtoMsg = spec['Fl32_Dup_Front_Dto_Message$'];

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
        methods: {
            send() { }
        },
        async mounted() {
            // debugger
            this.band = modBand.getRef();
            const first = dtoMsg.createDto();
            first.body = 'This is first message.';
            first.sent = true;
            const second = dtoMsg.createDto();
            second.body = 'This is second message.';
            second.sent = false;
            // this.band.push(first);
            // this.band.push(second);
        },
    };
}
