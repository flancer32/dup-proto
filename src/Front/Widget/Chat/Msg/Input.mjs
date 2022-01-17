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
    /** @type {TeqFw_User_Front_DSource_User} */
    const dsUser = spec['TeqFw_User_Front_DSource_User$'];
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
    /** @type {Fl32_Dup_Front_Proc_Msg_Post} */
    const procPost = spec['Fl32_Dup_Front_Proc_Msg_Post$'];

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
                 * @return {Promise<string>}
                 */
                async function encryptAndSend(msg, authorId, recipientId) {
                    // get keys to encrypt
                    const user = await dsUser.get();
                    const sec = user.keys.secret
                    // get recipient's public key from IDB
                    const trx = await idb.startTransaction(idbContact, false);
                    /** @type {Fl32_Dup_Front_Store_Entity_Contact_Card.Dto} */
                    const card = await idb.readOne(trx, idbContact, recipientId);
                    const pub = card.keyPub;
                    // set key and encrypt
                    enigma.setKeys(pub, sec);
                    const encrypted = enigma.encryptAndSign(msg);
                    // post message to server
                    const confirm = await procPost.run({
                        payload: encrypted,
                        userId: authorId,
                        recipientId
                    });
                    return confirm?.messageId;
                }

                // MAIN FUNCTIONALITY
                const user = await dsUser.get();
                const authorId = user.id;
                const recipientId = this.otherSideId;
                const msg = this.message;
                this.message = null;
                const msgId = await encryptAndSend(msg, authorId, recipientId);
                if (msgId) {
                    logger.info(`Message sent to the server. ID: ${msgId}.`);
                    actMsgAdd({
                        authorId,
                        bandId: recipientId,
                        body: msg,
                        date: new Date(),
                        uuid: msgId,
                    });
                } else {
                    logger.info(`Cannot send message to the server`);
                }
            }
        },
        async mounted() {
            this.otherSideId = rxChat.getOtherSideId();
        },
    };
}
