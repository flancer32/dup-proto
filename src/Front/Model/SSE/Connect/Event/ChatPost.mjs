/**
 * Factory to create handler for authorization events in SSE.
 * @namespace Fl32_Dup_Front_Model_SSE_Connect_Event_ChatPost
 */
// MODULE'S VARS
const NS = 'Fl32_Dup_Front_Model_SSE_Connect_Event_ChatPost';

export default function (spec) {
    /** @type {TeqFw_User_Front_Api_ISession} */
    const session = spec['TeqFw_User_Front_Api_ISession$'];
    /** @type {Fl32_Dup_Shared_SSE_ChatPost} */
    const sseChatPost = spec['Fl32_Dup_Shared_SSE_ChatPost$'];
    /** @type {Fl32_Dup_Front_Rx_Chat_Current} */
    const rxChat = spec['Fl32_Dup_Front_Rx_Chat_Current$'];
    /** @type {Fl32_Dup_Front_Dto_Message} */
    const dtoMsg = spec['Fl32_Dup_Front_Dto_Message$'];

    /**
     * @param {*} event
     * @return {Promise<void>}
     * @memberOf Fl32_Dup_Front_Model_SSE_Connect_Event_ChatPost
     */
    async function handler(event) {
        const text = event.data;
        try {
            // extract input data from event
            const msg = JSON.parse(text);
            const dto = sseChatPost.createDto(msg);
            const connectionId = dto.connectionId;
            const payload = dto.payload;
            // get encryption keys
            {
                const dto = dtoMsg.createDto();
                dto.body = msg.body;
                dto.date = new Date();
                dto.sent = (msg.userId === session.getUser().id);
                if (!dto.sent) dto.author = msg.author;
                rxChat.addMessage(dto);
            }
        } catch (e) {
            console.log(text);
            console.dir(e);
        }
    }

    Object.defineProperty(handler, 'name', {value: `${NS}.handler`});
    return handler;
}
