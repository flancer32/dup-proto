/**
 * Messages output widget.
 *
 * @namespace Fl32_Dup_Front_Ui_Chat_Msg_Band
 */
// MODULE'S VARS
const NS = 'Fl32_Dup_Front_Ui_Chat_Msg_Band';

// MODULE'S FUNCTIONS
/**
 * TeqFW DI factory function to get dependencies for the object.
 *
 * @returns {Fl32_Dup_Front_Ui_Chat_Msg_Band.vueCompTmpl}
 */
export default function (spec) {
    /** @type {Fl32_Dup_Front_Defaults} */
    const DEF = spec['Fl32_Dup_Front_Defaults$'];
    /** @type {Fl32_Dup_Front_Ui_Chat_Msg_Band_Item.vueCompTmpl} */
    const message = spec['Fl32_Dup_Front_Ui_Chat_Msg_Band_Item$'];
    /** @type {Fl32_Dup_Front_Rx_Chat_Current} */
    const rxChat = spec['Fl32_Dup_Front_Rx_Chat_Current$'];

    // DEFINE WORKING VARS
    const template = `
<div 
    class="q-pa-md fixed-bottom row justify-center" 
    style="margin-bottom:56px; width: 100%; height:calc(100% - 50px - 56px); margin-top: 50px;">
    <q-scroll-area ref="scrollAreaRef" style="height: 100%; width: 100%;"  @scroll="onScrollFirst">
        <message v-for="(item) in band"
            :item="item"
        />
    </q-scroll-area>
</div>
`;
    /**
     * Template to create new component instances using Vue.
     *
     * @const {Object} vueCompTmpl
     * @memberOf Fl32_Dup_Front_Ui_Chat_Msg_Band
     */
    return {
        teq: {package: DEF.SHARED.NAME},
        name: NS,
        template,
        components: {message},
        data() {
            return {
                band: rxChat.getMessages(),
                count: rxChat.getMessagesCount(),
                // scrollAreaRef: null,
            };
        },
        methods: {
            onScrollFirst() {
                //console.log(`onScrollFirst`);
            }
        },
        watch: {
            count() {
                const scroll = this?._?.refs?.scrollAreaRef;
                if (scroll) {
                    setTimeout(() => {scroll.setScrollPosition('vertical', 150000, 500);}, 500);
                }
            }
        },
        async mounted() {
            const scroll = this?._?.refs?.scrollAreaRef;
            if (scroll) {
                setTimeout(() => {scroll.setScrollPosition('vertical', 150000, 2000);}, 500);
            }
        },
        updated() {
            console.log(`updated`);
        },
        renderTriggered() {
            console.log(`renderTriggered`);
        },
    };
}
