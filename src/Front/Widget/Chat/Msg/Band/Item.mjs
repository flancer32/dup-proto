/**
 * Widget to display one message on the messages band.
 *
 * @namespace Fl32_Dup_Front_Widget_Chat_Msg_Band_Item
 */
// MODULE'S VARS
const NS = 'Fl32_Dup_Front_Widget_Chat_Msg_Band_Item';

// MODULE'S FUNCTIONS
/**
 * TeqFW DI factory function to get dependencies for the object.
 *
 * @returns {Fl32_Dup_Front_Widget_Chat_Msg_Band_Item.vueCompTmpl}
 */
export default function (spec) {
    /** @type {Fl32_Dup_Front_Defaults} */
    const DEF = spec['Fl32_Dup_Front_Defaults$'];


    // DEFINE WORKING VARS
    const template = `
<q-chat-message :bg-color="colorBg" :text-color="colorTxt"
    :text="body"
    :sent="item?.sent"
/>
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
        components: {},
        data() {
            return {};
        },
        props: {
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
            colorTxt() {
                return (this.item?.sent) ? 'lightest' : 'lighter';
            },
        }
    };
}
