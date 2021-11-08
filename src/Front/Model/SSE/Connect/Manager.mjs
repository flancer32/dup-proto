export default class Fl32_Dup_Front_Model_SSE_Connect_Manager {
    constructor(spec) {
        // EXTRACT DEPS
        /** @type {Fl32_Dup_Front_Defaults} */
        const DEF = spec['Fl32_Dup_Front_Defaults$'];
        /** @type {TeqFw_Web_Front_SSE_Connect} */
        const _connect = spec['TeqFw_Web_Front_SSE_Connect$$']; // new instance
        /** @type {TeqFw_User_Front_Api_ISession} */
        const modSess = spec['TeqFw_User_Front_Api_ISession$'];
        /** @type {Fl32_Dup_Front_Model_Msg_Band} */
        const modBand = spec['Fl32_Dup_Front_Model_Msg_Band$'];
        /** @type {Fl32_Dup_Front_Dto_Message} */
        const dtoMsg = spec['Fl32_Dup_Front_Dto_Message$'];

        // DEFINE INSTANCE METHODS
        this.isActive = function () {
            return _connect.stateOpen();
        }

        this.close = async function () {
            _connect.close();
        }
        this.open = async function () {
            function handlerMessage(event) {
                try {
                    const text = event.data;
                    const msg = JSON.parse(text);
                    const dto = dtoMsg.createDto();
                    dto.body = msg.body;
                    dto.date = new Date();
                    dto.sent = (msg.userId === modSess.getUser().id);
                    if (!dto.sent) dto.author = msg.author;
                    modBand.push(dto);
                    if (typeof window.navigator.vibrate === 'function')
                        window.navigator.vibrate([100, 100, 100]);
                } catch (e) {
                    console.log(text);
                }
            }

            function handlerAuthorize(event) {
                try {
                    const text = event.data;
                    const msg = JSON.parse(text);
                    console.log(`authorize: ${text}`);
                } catch (e) {
                    console.log(text);
                }
            }

            const handlers = {
                authorize: handlerAuthorize,
                message: handlerMessage,
            };
            await _connect.open('./sse/channel', handlers);
        }
    }
}
