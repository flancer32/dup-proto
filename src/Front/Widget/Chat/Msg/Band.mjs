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
    
<!--      <q-chat-message bg-color="base" text-color="lightest"-->
<!--        :text="to"-->
<!--        sent-->
<!--      />-->
<!--      <q-chat-message bg-color="darker" text-color="lighter"-->
<!--        :text="from"-->
<!--         stamp="20:23:43"-->
<!--      />-->
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
                from: ['very long long long long long long long long long long long long long long long long long long long message from server'],
                to: ['message to server', 'message to server', 'message to server', 'message to server'],
                band: []
            };
        },
        methods: {
            send() { }
        },
        async mounted() {
            // debugger
            this.band = modBand.getData();
            const first = dtoMsg.createDto();
            first.body = 'This is first message.';
            first.sent = true;
            const second = dtoMsg.createDto();
            second.body = 'This is second message.';
            second.sent = false;
            this.band.push(first);
            this.band.push(second);
            let count = 0;
            const interval = setInterval(() => {
                const item = dtoMsg.createDto();
                item.body = `This is additional message #${count}.`;
                item.sent = count % 2 === 0;
                count++;
                this.band.push(item);
                if (count > 10) clearInterval(interval);
            }, 2000);
        },
    };
}
