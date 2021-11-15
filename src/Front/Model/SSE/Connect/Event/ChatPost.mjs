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
    /** @type {Fl32_Dup_Shared_SSE_ChatPost} */
    const sseChatPost = spec['Fl32_Dup_Shared_SSE_ChatPost$'];
    /** @type {Fl32_Dup_Front_Rx_Chat_Current} */
    const rxChat = spec['Fl32_Dup_Front_Rx_Chat_Current$'];
    /** @type {Fl32_Dup_Front_Dto_Message} */
    const dtoMsg = spec['Fl32_Dup_Front_Dto_Message$'];
    /** @type {Fl32_Dup_Front_Act_Band_Msg_Add.act|function} */
    const actMsgAdd = spec['Fl32_Dup_Front_Act_Band_Msg_Add$'];

    /**
     * @param {*} event
     * @return {Promise<void>}
     * @memberOf Fl32_Dup_Front_Model_SSE_Connect_Event_ChatPost
     */
    async function handler(event) {
        // DEFINE INNER FUNCTIONS
        function confirmDelivery(messageId, userId) {
            const req = wapiDelivery.createReq({messageId, userId});
            gate.send(req, wapiDelivery);
        }

        // MAIN FUNCTIONALITY
        const text = event.data;
        try {
            // extract input data from event
            const user = session.getUser();
            const userId = user.id;
            const msg = JSON.parse(text);
            const dto = sseChatPost.createDto(msg);
            const connectionId = dto.connectionId;
            const payload = dto.payload;
            const msgId = msg.msgId;
            // get encryption keys
            {
                // add message to current band
                const sent = (msg.userId === userId);
                // addToChat(msg.body, msg.author, sent);
                actMsgAdd({
                    authorId: msg.userId,
                    bandId: msg.userId,
                    body: msg.body,
                    date: new Date(),
                    msgId,
                });
                // send delivery confirmation (w/o await)
                confirmDelivery(msgId, userId);
            }
        } catch (e) {
            console.log(text);
            console.dir(e);
        }
    }

    Object.defineProperty(handler, 'name', {value: `${NS}.handler`});
    return handler;
}
