/**
 * Message input widget.
 *
 * @namespace Fl32_Dup_Front_Ui_Chat_Msg_Input
 */
// MODULE'S VARS
const NS = 'Fl32_Dup_Front_Ui_Chat_Msg_Input';

// MODULE'S FUNCTIONS
/**
 * TeqFW DI factory function to get dependencies for the object.
 *
 * @returns {Fl32_Dup_Front_Ui_Chat_Msg_Input.vueCompTmpl}
 */
export default function (spec) {
    /** @type {Fl32_Dup_Front_Defaults} */
    const DEF = spec['Fl32_Dup_Front_Defaults$'];
    /** @type {TeqFw_Core_Shared_Api_ILogger} */
    const logger = spec['TeqFw_Core_Shared_Api_ILogger$$']; // instance
    /** @type {TeqFw_Web_Auth_Front_Mod_Identity} */
    const modIdentity = spec['TeqFw_Web_Auth_Front_Mod_Identity$'];
    /** @type {Fl32_Dup_Front_Rx_Chat_Current} */
    const rxChat = spec['Fl32_Dup_Front_Rx_Chat_Current$'];
    /** @type {TeqFw_Web_Auth_Shared_Api_Crypto_IScrambler} */
    const scrambler = spec['TeqFw_Web_Auth_Shared_Api_Crypto_IScrambler$'];
    /** @type {TeqFw_Web_Front_App_Store_IDB} */
    const idb = spec['Fl32_Dup_Front_Store_Db$'];
    /** @type {Fl32_Dup_Front_Store_Entity_Band} */
    const idbBand = spec['Fl32_Dup_Front_Store_Entity_Band$'];
    /** @type {Fl32_Dup_Front_Store_Entity_Contact} */
    const idbContact = spec['Fl32_Dup_Front_Store_Entity_Contact$'];
    /** @type {TeqFw_Web_Event_Front_Mod_Connect_Direct_Portal} */
    const portalBack = spec['TeqFw_Web_Event_Front_Mod_Connect_Direct_Portal$'];
    /** @type {Fl32_Dup_Shared_Event_Front_Msg_Post} */
    const esfPosted = spec['Fl32_Dup_Shared_Event_Front_Msg_Post$'];
    /** @type {Fl32_Dup_Front_Mod_Msg_Saver} */
    const modMsgSaver = spec['Fl32_Dup_Front_Mod_Msg_Saver$'];
    /** @type {Fl32_Dup_Front_Dto_Message} */
    const dtoMsg = spec['Fl32_Dup_Front_Dto_Message$'];
    /** @type {typeof Fl32_Dup_Front_Enum_Msg_State} */
    const STATE = spec['Fl32_Dup_Front_Enum_Msg_State$'];
    /** @type {TeqFw_Web_Auth_Front_Lib_Uuid.v4|function} */
    const uuidV4 = spec['TeqFw_Web_Auth_Front_Lib_Uuid.v4'];

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
     * @memberOf Fl32_Dup_Front_Ui_Chat_Msg_Input
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
                 * @param {string} uuid
                 */
                function postToBand(body, date, uuid) {
                    const dto = dtoMsg.createDto();
                    dto.body = body;
                    dto.date = date;
                    dto.sent = true;
                    dto.state = STATE.NOT_SENT;
                    dto.uuid = uuid;
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
                    // FUNCS
                    /**
                     * Post chat message to the server as event.
                     * @param {string} uuid UUID for the message
                     * @param {string} payload encrypted data
                     * @param {number} recipientId
                     * @return {Promise<void>}
                     */
                    async function postMessage(uuid, payload, recipientId) {
                        const event = esfPosted.createDto();
                        event.meta.frontUUID = modIdentity.getFrontUuid();
                        event.data.message.payload = payload;
                        event.data.message.recipientId = recipientId;
                        event.data.message.dateSent = new Date();
                        event.data.message.uuid = uuid;
                        await portalBack.publish(event);
                        logger.info(`Chat message #${uuid} is posted to the back, event #${event.meta.uuid}.`, {msgUuid: uuid});
                    }

                    // MAIN
                    // retrieve keys and encrypt text body
                    const pub = contact.keyPub;
                    const sec = modIdentity.getSecretKey();
                    scrambler.setKeys(pub, sec);
                    const encrypted = scrambler.encryptAndSign(body);
                    logger.info(`Chat message #${uuid} is encrypted.`, {msgUuid: uuid});
                    // noinspection ES6MissingAwait
                    postMessage(uuid, encrypted, contact.idOnBack);
                }

                // MAIN
                const uuid = uuidV4();
                const body = this.message;
                const bandId = this.otherSideBandId;
                const contact = await getContactByBand(bandId);
                const date = new Date();
                postToBand(body, date, uuid);
                const {id: msgId} = await modMsgSaver.savePersonalOut({uuid, body, bandId, date});
                logger.info(`Chat message #${uuid} is saved to IDB as #${msgId}.`);
                this.message = null; // clear UI field
                logger.info(`Chat message #${uuid} is posted to band #${bandId}.`);
                await encryptAndSend(uuid, body, contact);
            }
        },
        async mounted() {
            this.otherSideBandId = rxChat.getBandId();
        },
    };
}
