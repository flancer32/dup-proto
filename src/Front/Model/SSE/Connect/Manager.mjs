export default class Fl32_Dup_Front_Model_SSE_Connect_Manager {
    constructor(spec) {
        // EXTRACT DEPS
        /** @type {TeqFw_Web_Front_SSE_Connect} */
        const _connect = spec['TeqFw_Web_Front_SSE_Connect$$']; // new instance
        /** @type {TeqFw_User_Front_Api_ISession} */
        const _session = spec['TeqFw_User_Front_Api_ISession$'];
        /** @type {Fl32_Dup_Front_Rx_Chat_Current} */
        const rxChat = spec['Fl32_Dup_Front_Rx_Chat_Current$'];
        /** @type {Fl32_Dup_Front_Dto_Message} */
        const dtoMsg = spec['Fl32_Dup_Front_Dto_Message$'];
        /** @type {Fl32_Dup_Front_Model_SSE_Connect_Event_Authorize.handler|function} */
        const hndlAuthorize = spec['Fl32_Dup_Front_Model_SSE_Connect_Event_Authorize$'];
        /** @type {Fl32_Dup_Front_Model_SSE_Connect_Event_ChatPost.handler|function} */
        const hndlChatPost = spec['Fl32_Dup_Front_Model_SSE_Connect_Event_ChatPost$'];
        /** @type {TeqFw_Web_Front_Service_Gate} */
        const gate = spec['TeqFw_Web_Front_Service_Gate$'];
        /** @type {Fl32_Dup_Shared_WAPI_SSE_Close.Factory} */
        const wapiClose = spec['Fl32_Dup_Shared_WAPI_SSE_Close#Factory$'];

        // DEFINE INSTANCE METHODS
        this.isActive = function () {
            return _connect.stateOpen();
        }

        this.close = async function () {
            // _connect.close();
            // send message to server to close SSE connection
            /** @type {Fl32_Dup_Shared_WAPI_SSE_Close.Request} */
            const req = wapiClose.createReq();
            req.userId = _session.getUserId();
            /** @type {Fl32_Dup_Shared_WAPI_SSE_Close.Response} */
            const res = await gate.send(req, wapiClose);
        }

        this.open = async function () {
            function handlerMessage(event) {
                try {
                    debugger
                    const text = event.data;
                    const msg = JSON.parse(text);
                    const dto = dtoMsg.createDto();
                    dto.body = msg.body;
                    dto.date = new Date();
                    dto.sent = (msg.userId === _session.getUser().id);
                    if (!dto.sent) dto.author = msg.author;
                    rxChat.addMessage(dto);
                    if (typeof window.navigator.vibrate === 'function')
                        window.navigator.vibrate([100, 100, 100]);
                } catch (e) {
                    console.log(text);
                }
            }

            const handlers = {
                authorize: hndlAuthorize,
                chatPost: hndlChatPost,
                message: handlerMessage,
            };
            await _connect.open('./sse/channel', handlers);
        }
    }
}
