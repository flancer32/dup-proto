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
    /** @type {typeof Fl32_Dup_Front_Enum_Msg_State} */
    const STATE = spec['Fl32_Dup_Front_Enum_Msg_State$'];
    /** @type {TeqFw_Web_Front_Lib_Uuid.v4|function} */
    const uuidV4 = spec['TeqFw_Web_Front_Lib_Uuid.v4'];

    // VARS
    const template = `
<div class="t-grid-cols" style="width:100%; grid-template-columns: 1fr auto; grid-gap: var(--grid-gap);">
    <div>
    <q-input
      :placeholder="placeholder"
      :disable="!enabled"
      @keypress.ctrl.enter="send"
      autogrow
      outlined
      bg-color="white"
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
                // FUNCS

                /**
                 * Get contact card by band ID from IDB.
                 * @param {number} bandId
                 * @return {Promise<Fl32_Dup_Front_Store_Entity_Contact.Dto>}
                 */
                async function getContactByBand(bandId) {
                    let res;
                    const trx = await idb.startTransaction([idbContact, idbBand], false);
                    /** @type {Fl32_Dup_Front_Store_Entity_Band.Dto} */
                    const band = await idb.readOne(trx, idbBand, bandId);
                    /** @type {Fl32_Dup_Front_Store_Entity_Contact.Dto} */
                    res = await idb.readOne(trx, idbContact, band?.contactRef);
                    trx.commit(); // transaction has finished here (cause read only??)
                    return res;
                }

                /**
                 * Add posted message to band on UI.
                 * @param {string} body plain text
                 * @param {Date} date
                 */
                function postToBand(body, date) {
                    const dto = dtoMsg.createDto();
                    dto.body = body;
                    dto.date = date;
                    dto.sent = true;
                    dto.state = STATE.NOT_SENT;
                    rxChat.addMessage(dto);
                }

                /**
                 * Encrypt and send message to the server. Get message ID from server.
                 * @param {string} uuid chat message UUID
                 * @param {string} body plain text body
                 * @param {Fl32_Dup_Front_Store_Entity_Contact.Dto} contact contact card of the recipient
                 * @return {Promise<void>}
                 */
                async function encryptAndSend(uuid, body, contact) {
                    const authorId = frontIdentity.getFrontId();
                    // retrieve keys and encrypt text body
                    const pub = contact.keyPub;
                    const sec = frontIdentity.getSecretKey();
                    scrambler.setKeys(pub, sec);
                    const encrypted = scrambler.encryptAndSign(body);
                    logger.info(`Chat message #${uuid} is encrypted.`, {msgUuid: uuid});
                    // post message to server
                    await procPost({
                        msgUuid: uuid,
                        payload: encrypted,
                        userId: authorId,
                        recipientId: contact.idOnBack
                    });
                }

                // MAIN
                const uuid = uuidV4();
                const body = this.message;
                const bandId = this.otherSideBandId;
                const contact = await getContactByBand(bandId);
                const {id: msgId, date: msgDate} = await modMsgSaver.savePersonalOut({uuid, body, bandId});
                logger.info(`Chat message #${uuid} is saved to IDB as #${msgId}.`);
                this.message = null; // clear UI field
                postToBand(body, msgDate);
                logger.info(`Chat message #${uuid} is posted to band #${bandId}.`);
                await encryptAndSend(uuid, body, contact);
            }
        },
        async mounted() {
            this.otherSideBandId = rxChat.getBandId();
        },
    };
}
