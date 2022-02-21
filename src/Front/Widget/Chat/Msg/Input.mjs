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
    /** @type {TeqFw_Core_Shared_Api_ILogger} */
    const logger = spec['TeqFw_Core_Shared_Api_ILogger$$']; // instance
    /** @type {TeqFw_Web_Front_Mod_App_Front_Identity} */
    const frontIdentity = spec['TeqFw_Web_Front_Mod_App_Front_Identity$'];
    /** @type {Fl32_Dup_Front_Rx_Chat_Current} */
    const rxChat = spec['Fl32_Dup_Front_Rx_Chat_Current$'];
    /** @type {TeqFw_Web_Shared_Api_Crypto_IScrambler} */
    const scrambler = spec['TeqFw_Web_Shared_Api_Crypto_IScrambler$'];
    /** @type {TeqFw_Web_Front_App_Store_IDB} */
    const idb = spec['Fl32_Dup_Front_Store_Db$'];
    /** @type {Fl32_Dup_Front_Store_Entity_Band} */
    const idbBand = spec['Fl32_Dup_Front_Store_Entity_Band$'];
    /** @type {Fl32_Dup_Front_Store_Entity_Contact} */
    const idbContact = spec['Fl32_Dup_Front_Store_Entity_Contact$'];
    /** @type {Fl32_Dup_Front_Store_Entity_Msg} */
    const idbMsg = spec['Fl32_Dup_Front_Store_Entity_Msg$'];
    /** @type {Fl32_Dup_Front_Proc_Msg_Post.process|function} */
    const procPost = spec['Fl32_Dup_Front_Proc_Msg_Post$'];
    /** @type {Fl32_Dup_Front_Mod_Msg_Saver} */
    const modMsgSaver = spec['Fl32_Dup_Front_Mod_Msg_Saver$'];
    /** @type {Fl32_Dup_Front_Dto_Message} */
    const dtoMsg = spec['Fl32_Dup_Front_Dto_Message$'];
    /** @type {typeof Fl32_Dup_Front_Enum_Msg_Type} */
    const TYPE = spec['Fl32_Dup_Front_Enum_Msg_Type$'];
    /** @type {typeof Fl32_Dup_Front_Enum_Msg_Direction} */
    const DIR = spec['Fl32_Dup_Front_Enum_Msg_Direction$'];
    /** @type {TeqFw_Web_Front_Lib_Uuid.v4|function} */
    const uuidV4 = spec['TeqFw_Web_Front_Lib_Uuid.v4'];

    // ENCLOSED VARS
    const I_MSG = idbMsg.getIndexes();

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

    // MAIN
    logger.setNamespace(NS);
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
                otherSideBandId: null,
            };
        },
        computed: {
            enabled() {
                return this.otherSideBandId !== null;
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
                 * @param {string} msgUuid
                 * @param {string} msg
                 * @param {number} authorId
                 * @param {number} bandId current band ID (=> contactId => userId)
                 * @return {Promise<{msgUUID: string, recipientId: number}>}
                 */
                async function encryptAndSend(msgUuid, msg, authorId, bandId) {
                    // get keys to encrypt
                    const sec = frontIdentity.getSecretKey();
                    // get recipient's public key from IDB
                    const trx = await idb.startTransaction([idbContact, idbBand], false);
                    /** @type {Fl32_Dup_Front_Store_Entity_Band.Dto} */
                    const band = await idb.readOne(trx, idbBand, bandId);
                    /** @type {Fl32_Dup_Front_Store_Entity_Contact.Dto} */
                    const card = await idb.readOne(trx, idbContact, band?.contactRef);
                    const pub = card.keyPub;
                    // set key and encrypt
                    scrambler.setKeys(pub, sec);
                    const encrypted = scrambler.encryptAndSign(msg);
                    logger.info(`Chat message #${msgUuid} is encrypted.`, {msgUuid});
                    // post message to server
                    const confirm = await procPost({
                        msgUuid,
                        payload: encrypted,
                        userId: authorId,
                        recipientId: card.idOnBack
                    });
                    // trx.commit(); // transaction has finished here (cause read only??)
                    return {msgUUID: confirm?.messageId, recipientId: card.idOnBack};
                }

                // MAIN
                const senderFrontId = frontIdentity.getFrontId();
                const body = this.message;
                this.message = null;
                const msgUuid = uuidV4();
                logger.info(`Chat message #${msgUuid} is posted to band #${this.otherSideBandId}.`);
                const {recipientId} = await encryptAndSend(msgUuid, body, senderFrontId, this.otherSideBandId);
                if (msgUuid) {
                    logger.info(`Chat message #${msgUuid} is registered by the server.`, {msgUuid});
                    const msgId = await modMsgSaver.savePersonalOut({
                        uuid: msgUuid,
                        body,
                        recipientId,
                    });
                    // push message to current band
                    const trx = await idb.startTransaction([idbMsg]);
                    /** @type {Fl32_Dup_Front_Store_Entity_Msg.Dto} */
                    const one = await idb.readOne(trx, idbMsg, msgUuid, I_MSG.BY_UUID);
                    await trx.commit();
                    const dto = dtoMsg.createDto();
                    dto.body = one.body;
                    dto.date = one.date;
                    dto.sent = (one.direction === DIR.OUT);
                    rxChat.addMessage(dto);
                } else {
                    logger.info(`Cannot send chat message #${msgUuid} to the server.`, {msgUuid});
                }
            }
        },
        async mounted() {
            this.otherSideBandId = rxChat.getBandId();
        },
    };
}
