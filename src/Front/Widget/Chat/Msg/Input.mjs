/**
 * Message input widget.
 *
 * @namespace Fl32_Dup_Front_Widget_Chat_Msg_Input
 */
// MODULE'S VARS
const NS = 'Fl32_Dup_Front_Widget_Chat_Msg_Input';

// MODULE'S FUNCTIONS
/**
 * TeqFW DI factory function to get dependencies for the object.
 *
 * @returns {Fl32_Dup_Front_Widget_Chat_Msg_Input.vueCompTmpl}
 */
export default function (spec) {
    /** @type {Fl32_Dup_Front_Defaults} */
    const DEF = spec['Fl32_Dup_Front_Defaults$'];
    /** @type {TeqFw_Web_Front_Service_Gate} */
    const gate = spec['TeqFw_Web_Front_Service_Gate$'];
    /** @type {Fl32_Dup_Shared_WAPI_Msg_Post.Factory} */
    const routePost = spec['Fl32_Dup_Shared_WAPI_Msg_Post.Factory$'];
    /** @type {TeqFw_User_Front_Api_ISession} */
    const session = spec['TeqFw_User_Front_Api_ISession$'];
    /** @type {Fl32_Dup_Front_Rx_Chat_Current} */
    const rxChat = spec['Fl32_Dup_Front_Rx_Chat_Current$'];

    // DEFINE WORKING VARS
    const template = `
<div class="t-grid-cols" style="width:100%; grid-template-columns: 1fr auto; grid-gap: var(--grid-gap);">
    <div>
    <q-input
      v-model="message"
      outlined
      placeholder="Message..."
      autogrow
    />
    </div>
    <div style="margin: auto;">
        <q-btn :label="$t('btn.ok')" color="primary" round v-on:click="send"></q-btn>
    </div>
</div>
`;
    /**
     * Template to create new component instances using Vue.
     *
     * @const {Object} vueCompTmpl
     * @memberOf Fl32_Dup_Front_Widget_Chat_Msg_Input
     */
    return {
        teq: {package: DEF.SHARED.NAME},
        name: NS,
        template,
        components: {},
        data() {
            return {
                message: null,
                otherSideId: null,
            };
        },
        methods: {
            async send() {
                // send message to server
                /** @type {Fl32_Dup_Shared_WAPI_Msg_Post.Request} */
                const req = routePost.createReq();
                req.body = this.message;
                const user = session.getUser();
                req.userId = user.id;
                req.recipientId = this.otherSideId;
                // noinspection JSValidateTypes
                /** @type {Fl32_Dup_Shared_WAPI_Msg_Post.Response} */
                const res = await gate.send(req, routePost);
                // console.log(this.message);
                this.message = null;
            }
        },
        async mounted() {
            this.otherSideId = rxChat.getOtherSideId();
        },
    };
}
