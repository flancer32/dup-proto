/**
 * Widget to display one chat message on the messages band.
 *
 * @namespace Fl32_Dup_Front_Widget_Chat_Msg_Band_Item
 */
// MODULE'S VARS
const NS = 'Fl32_Dup_Front_Widget_Chat_Msg_Band_Item';
// Quasar codes for colors
const Q_COLOR_NOT_SENT = 'grey';
const Q_COLOR_ON_SERVER = 'yellow-3';
const Q_COLOR_DELIVERED = 'blue-6';
const Q_COLOR_READ = 'green-6';

// MODULE'S INTERFACES
/**
 * @interface
 * @memberOf Fl32_Dup_Front_Widget_Chat_Msg_Band_Item
 */
class IUiComp {
    setDelivered() {}

    setOnServer() {}

    setRead() {}
}

// MODULE'S FUNCTIONS
/**
 * TeqFW DI factory function to get dependencies for the object.
 *
 * @returns {Fl32_Dup_Front_Widget_Chat_Msg_Band_Item.vueCompTmpl}
 */
export default function (spec) {
    /** @type {Fl32_Dup_Front_Defaults} */
    const DEF = spec['Fl32_Dup_Front_Defaults$'];
    /** @type {TeqFw_Core_Shared_Util_Format.time|function} */
    const formatTime = spec['TeqFw_Core_Shared_Util_Format.time'];
    /** @type {typeof Fl32_Dup_Front_Enum_Msg_State} */
    const STATE = spec['Fl32_Dup_Front_Enum_Msg_State$'];
    /** @type {Fl32_Dup_Front_Ui_Chat_Band} */
    const uiChatBand = spec['Fl32_Dup_Front_Ui_Chat_Band$'];

    // DEFINE WORKING VARS
    const template = `
<q-chat-message :bg-color="colorBg" :text-color="colorTxt"
    :text="body"
    :name="item?.author"
    :sent="item?.sent"
>
    <template v-slot:stamp>
        <div style="text-align: right;">
            {{stamp}} 
            <q-btn dense flat round icon="lens" size="6px" v-if="displayLed" :color="colorLed" />
        </div>
    </template>
</q-chat-message>
`;
    /**
     * Template to create new component instances using Vue.
     *
     * @const {Object} vueCompTmpl
     * @memberOf Fl32_Dup_Front_Widget_Chat_Msg_Band_Item
     */
    return {
        teq: {package: DEF.SHARED.NAME},
        name: NS,
        template,
        props: {
            /** @type {Fl32_Dup_Front_Dto_Message.Dto} */
            item: null
        },
        computed: {
            body() {
                /** @type {Fl32_Dup_Front_Dto_Message.Dto} */
                const item = this.item;
                return (typeof item?.body === 'string') ? [item.body] : [];
            },
            colorBg() {
                return (this.item?.sent) ? 'base' : 'darker';
            },
            colorLed() {
                /** @type {Fl32_Dup_Front_Enum_Msg_State} */
                const state = this.item.state;
                if (state === STATE.ON_SERVER) return Q_COLOR_ON_SERVER;
                else if (state === STATE.DELIVERED) return Q_COLOR_DELIVERED;
                else if (state === STATE.READ) return Q_COLOR_READ;
                else return Q_COLOR_NOT_SENT;

            },
            colorTxt() {
                return (this.item?.sent) ? 'lightest' : 'lighter';
            },
            displayLed() {
                return this.item.sent;
            },
            stamp() {
                return (this.item?.date instanceof Date) ? formatTime(this.item.date) : null;
            }
        },
        methods: {
            setDelivered() {
                if (this.item.state !== STATE.READ)
                    this.item.state = STATE.DELIVERED;
            },
            setOnServer() {
                this.item.state = STATE.ON_SERVER;
            },
            setRead() {
                this.item.state = STATE.READ;
            },
        },
        mounted() {
            uiChatBand.putMessage(this?.item?.uuid, this);
        },
    };
}
