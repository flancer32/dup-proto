/**
 * Factory to create handler for authorization events in SSE.
 * @namespace Fl32_Dup_Front_Model_SSE_Connect_Event_ChatPost
 */
// MODULE'S VARS
const NS = 'Fl32_Dup_Front_Model_SSE_Connect_Event_ChatPost';

export default function (spec) {
    /** @type {TeqFw_User_Front_Api_ISession} */
    const session = spec['TeqFw_User_Front_Api_ISession$'];
    /** @type {TeqFw_Web_Front_Service_Gate} */
    const gate = spec['TeqFw_Web_Front_Service_Gate$'];
    /** @type {Fl32_Dup_Shared_WAPI_Msg_Confirm_Delivery.Factory} */
    const wapiDelivery = spec['Fl32_Dup_Shared_WAPI_Msg_Confirm_Delivery#Factory$'];
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

    // INNER FUNCTIONS

    /**
     * @param {*} event
     * @return {Promise<void>}
     * @memberOf Fl32_Dup_Front_Model_SSE_Connect_Event_ChatPost
     */
    async function handler(event) {

        // INNER FUNCTIONS
        function confirmDelivery(messageId, userId) {
            const req = wapiDelivery.createReq({messageId, userId});
            gate.send(req, wapiDelivery);
        }

        async function decrypt(encrypted, senderId) {
            let res = null;
            /** @type {Fl32_Dup_Front_Store_Single_User.Dto} */
            const user = session.getUser();
            const sec = user.key.secret
            // get recipient's public key from IDB
            const trx = await idb.startTransaction(idbContact, false);
            /** @type {Fl32_Dup_Front_Store_Entity_Contact_Card.Dto} */
            const card = await idb.readOne(trx, idbContact, senderId);
            if (card) {
                const pub = card.keyPub;
                // set key and encrypt
                enigma.setKeys(pub, sec);
                res = enigma.decryptAndVerify(encrypted);
            }
            return res;
        }

        // MAIN FUNCTIONALITY
        const text = event.data;
        try {
            // extract input data from event
            const user = session.getUser();
            const userId = user.id;
            const msg = JSON.parse(text);
            const msgId = msg.msgId;
            // decrypt message
            const body = await decrypt(msg.body, msg.userId);
            if (body)
                // save message to IDB and push to current band (if required)
                actMsgAdd({
                    authorId: msg.userId,
                    bandId: msg.userId,
                    body,
                    date: new Date(),
                    msgId,
                });
            // send delivery confirmation (w/o await)
            confirmDelivery(msgId, userId);
        } catch (e) {
            console.log(text);
            console.dir(e);
        }
    }

    // MAIN FUNCTIONALITY
    Object.defineProperty(handler, 'name', {value: `${NS}.handler`});
    return handler;
}
