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
    /** @type {TeqFw_Web_Front_WAPI_Gate} */
    const gate = spec['TeqFw_Web_Front_WAPI_Gate$'];
    /** @type {Fl32_Dup_Shared_WAPI_Msg_Post.Factory} */
    const routePost = spec['Fl32_Dup_Shared_WAPI_Msg_Post.Factory$'];
    /** @type {TeqFw_User_Front_Api_ISession} */
    const session = spec['TeqFw_User_Front_Api_ISession$'];
    /** @type {Fl32_Dup_Front_Rx_Chat_Current} */
    const rxChat = spec['Fl32_Dup_Front_Rx_Chat_Current$'];
    /** @type {Fl32_Dup_Front_Act_Band_Msg_Add.act|function} */
    const actMsgAdd = spec['Fl32_Dup_Front_Act_Band_Msg_Add$'];
    /** @type {Fl32_Dup_Front_Factory_Crypto} */
    const factCrypto = spec['Fl32_Dup_Front_Factory_Crypto$'];
    /** @type {TeqFw_Web_Front_Store_IDB} */
    const idb = spec['Fl32_Dup_Front_Store_Db$'];
    /** @type {Fl32_Dup_Front_Store_Entity_Contact_Card} */
    const idbContact = spec['Fl32_Dup_Front_Store_Entity_Contact_Card$'];

    // WORKING VARS
    /** @type {Fl32_Dup_Shared_Model_Crypto_Enigma_Asym} */
    const enigma = factCrypto.createEnigmaAsym();

    const template = `
<div class="t-grid-cols" style="width:100%; grid-template-columns: 1fr auto; grid-gap: var(--grid-gap);">
    <div>
    <q-input
      :placeholder="placeholder"
      :disable="!enabled"
      @keypress.ctrl.enter="send"
      autogrow
      outlined
      v-model="message"
    />
    </div>
    <div style="margin: auto;">
        <q-btn :label="$t('btn.ok')" color="primary" round v-on:click="send" :disable="!enabled"></q-btn>
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
        computed: {
            enabled() {
                return this.otherSideId !== null;
            },
            placeholder() {
                return this.enabled ? 'Message...' : 'Please select user to chat...';
            },
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
                async function encryptAndSend(msg, authorId, recipientId) {
                    // get keys to encrypt
                    /** @type {Fl32_Dup_Front_Store_Single_User.Dto} */
                    const user = session.getUser();
                    const sec = user.key.secret
                    // get recipient's public key from IDB
                    const trx = await idb.startTransaction(idbContact, false);
                    /** @type {Fl32_Dup_Front_Store_Entity_Contact_Card.Dto} */
                    const card = await idb.readOne(trx, idbContact, recipientId);
                    const pub = card.keyPub;
                    // set key and encrypt
                    enigma.setKeys(pub, sec);
                    const encrypted = enigma.encryptAndSign(msg);
                    // post message to server
                    /** @type {Fl32_Dup_Shared_WAPI_Msg_Post.Request} */
                    const req = routePost.createReq();
                    req.payload = encrypted;
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
                const msgId = await encryptAndSend(msg, authorId, recipientId);
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
