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
    /** @type {TeqFw_Web_Front_App_Logger} */
    const logger = spec['TeqFw_Web_Front_App_Logger$'];
    /** @type {TeqFw_User_Front_DSource_User} */
    const dsUser = spec['TeqFw_User_Front_DSource_User$'];
    /** @type {Fl32_Dup_Front_Rx_Chat_Current} */
    const rxChat = spec['Fl32_Dup_Front_Rx_Chat_Current$'];
    /** @type {TeqFw_Web_Shared_Api_Crypto_IScrambler} */
    const scrambler = spec['TeqFw_Web_Shared_Api_Crypto_IScrambler$'];
    /** @type {TeqFw_Web_Front_App_Store_IDB} */
    const idb = spec['Fl32_Dup_Front_Store_Db$'];
    /** @type {Fl32_Dup_Front_Store_Entity_Band} */
    const idbBand = spec['Fl32_Dup_Front_Store_Entity_Band$'];
    /** @type {Fl32_Dup_Front_Store_Entity_Contact_Card} */
    const idbContact = spec['Fl32_Dup_Front_Store_Entity_Contact_Card$'];
    /** @type {Fl32_Dup_Front_Store_Entity_Msg_Base} */
    const idbMsg = spec['Fl32_Dup_Front_Store_Entity_Msg_Base$'];
    /** @type {Fl32_Dup_Front_Proc_Msg_Post} */
    const procPost = spec['Fl32_Dup_Front_Proc_Msg_Post$'];
    /** @type {Fl32_Dup_Front_Mod_Msg_Saver} */
    const modMsgSaver = spec['Fl32_Dup_Front_Mod_Msg_Saver$'];
    /** @type {Fl32_Dup_Front_Dto_Message} */
    const dtoMsg = spec['Fl32_Dup_Front_Dto_Message$'];
    /** @type {typeof Fl32_Dup_Front_Enum_Msg_Type} */
    const TYPE = spec['Fl32_Dup_Front_Enum_Msg_Type$'];

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
                 * @param {string} msg
                 * @param {number} authorId
                 * @param {number} bandId current band ID (=> contactId => userId)
                 * @return {Promise<{msgUUID: string, recipientId: number}>}
                 */
                async function encryptAndSend(msg, authorId, bandId) {
                    // get keys to encrypt
                    const user = await dsUser.get();
                    const sec = user.keys.secret
                    // get recipient's public key from IDB
                    const trx = await idb.startTransaction([idbContact, idbBand], false);
                    /** @type {Fl32_Dup_Front_Store_Entity_Band.Dto} */
                    const band = await idb.readOne(trx, idbBand, bandId);
                    /** @type {Fl32_Dup_Front_Store_Entity_Contact_Card.Dto} */
                    const card = await idb.readOne(trx, idbContact, band?.contactRef);
                    const pub = card.keyPub;
                    // set key and encrypt
                    scrambler.setKeys(pub, sec);
                    const encrypted = scrambler.encryptAndSign(msg);
                    // post message to server
                    const confirm = await procPost.run({
                        payload: encrypted,
                        userId: authorId,
                        recipientId: card.userId
                    });
                    // trx.commit(); // transaction has finished here (cause read only??)
                    return {msgUUID: confirm?.messageId, recipientId: card.userId};
                }

                // MAIN
                const user = await dsUser.get();
                const authorId = user.id;
                const body = this.message;
                this.message = null;
                const {msgUUID, recipientId} = await encryptAndSend(body, authorId, this.otherSideBandId);
                if (msgUUID) {
                    logger.info(`Message sent to the server. ID: ${msgUUID}.`);
                    const msgId = await modMsgSaver.savePersonalOut({
                        uuid: msgUUID,
                        body,
                        recipientId,
                    });
                    // push message to current band
                    const trx = await idb.startTransaction([idbMsg]);
                    /** @type {Fl32_Dup_Front_Store_Entity_Msg_Base.Dto} */
                    const one = await idb.readOne(trx, idbMsg, msgUUID, I_MSG.BY_UUID);
                    await trx.commit();
                    const dto = dtoMsg.createDto();
                    dto.body = one.body;
                    dto.date = one.date;
                    dto.sent = (one.type === TYPE.PERS_OUT);
                    rxChat.addMessage(dto);
                } else {
                    logger.info(`Cannot send message to the server`);
                }
            }
        },
        async mounted() {
            this.otherSideBandId = rxChat.getBandId();
        },
    };
}
