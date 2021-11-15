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
    /** @type {TeqFw_Core_Shared_Logger} */
    const logger = spec['TeqFw_Core_Shared_Logger$'];
    /** @type {TeqFw_Web_Front_Service_Gate} */
    const gate = spec['TeqFw_Web_Front_Service_Gate$'];
    /** @type {Fl32_Dup_Shared_WAPI_Msg_Post.Factory} */
    const routePost = spec['Fl32_Dup_Shared_WAPI_Msg_Post.Factory$'];
    /** @type {TeqFw_User_Front_Api_ISession} */
    const session = spec['TeqFw_User_Front_Api_ISession$'];
    /** @type {Fl32_Dup_Front_Rx_Chat_Current} */
    const rxChat = spec['Fl32_Dup_Front_Rx_Chat_Current$'];
    /** @type {Fl32_Dup_Front_Act_Band_Msg_Add.act|function} */
    const actMsgAdd = spec['Fl32_Dup_Front_Act_Band_Msg_Add$'];

    // WORKING VARS
    const template = `
<div class="t-grid-cols" style="width:100%; grid-template-columns: 1fr auto; grid-gap: var(--grid-gap);">
    <div>
    <q-input
      v-model="message"
      outlined
      placeholder="Message..."
      autogrow
      @keypress.ctrl.enter="send"
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
                // INNER FUNCTIONS

                /**
                 * Encrypt and send message to the server. Get message ID from server.
                 * @param {string} msg
                 * @param {number} authorId
                 * @param {number} recipientId
                 * @return {Promise<number>}
                 */
                async function sendToServer(msg, authorId, recipientId) {

                    /** @type {Fl32_Dup_Shared_WAPI_Msg_Post.Request} */
                    const req = routePost.createReq();
                    req.payload = msg;
                    req.userId = authorId;
                    req.recipientId = recipientId;
                    // noinspection JSValidateTypes
                    /** @type {Fl32_Dup_Shared_WAPI_Msg_Post.Response} */
                    const res = await gate.send(req, routePost);
                    return res.messageId;
                }

                // MAIN FUNCTIONALITY
                const user = session.getUser();
                const authorId = user.id;
                const recipientId = this.otherSideId;
                const msg = this.message;
                this.message = null;
                const msgId = await sendToServer(msg, authorId, recipientId);
                logger.info(`Message sent to the server. ID: ${msgId}.`);
                actMsgAdd({
                    authorId,
                    bandId: recipientId,
                    body: msg,
                    date: new Date(),
                    msgId,
                });
            }
        },
        async mounted() {
            this.otherSideId = rxChat.getOtherSideId();
        },
    };
}
