/**
 * Frontend class to establish SSE connection with server using '/sse/channel' address.
 */
export default class Fl32_Dup_Front_SSE_Channel {
    constructor(spec) {
        // EXTRACT DEPS
        /** @type {Fl32_Dup_Back_Defaults} */
        const DEF = spec['Fl32_Dup_Back_Defaults$'];
        /** @type {TeqFw_User_Front_Api_ISession} */
        const modSess = spec['TeqFw_User_Front_Api_ISession$'];
        /** @type {Fl32_Dup_Front_Model_Msg_Band} */
        const modBand = spec['Fl32_Dup_Front_Model_Msg_Band$'];
        /** @type {Fl32_Dup_Front_Dto_Message} */
        const dtoMsg = spec['Fl32_Dup_Front_Dto_Message$'];

        // DEFINE WORKING VARS / PROPS
        /** @type {EventSource} */
        let _source;

        // DEFINE INSTANCE METHODS

        this.open = function () {
            if (_source === undefined) {
                _source = new EventSource('./sse/channel');
                _source.addEventListener('message', function (e) {
                    console.log(`SSE data is coming. State: ${_source.readyState}.`);
                    // put input message into the band
                    // console.dir(e.data);
                    const text = e.data;
                    try {
                        const json = JSON.parse(text);
                        const dto = dtoMsg.createDto();
                        dto.body = json.body;
                        dto.date = new Date();
                        dto.sent = (json.userId === modSess.getUser().id);
                        if (!dto.sent) dto.author = json.author;
                        modBand.push(dto);
                    } catch (e) {
                        console.log(text);
                    }

                });
                _source.addEventListener('error', function (e) {
                    console.log(`error`);
                    console.dir(e);
                    console.log(`Event source state: ${_source?.readyState}.`);
                    _source.close();
                    console.log(`Event source state: ${_source?.readyState}.`);
                });
                _source.addEventListener('open', function (e) {
                    console.log(`New SSE connection is opening.`);
                    console.dir(e);
                    console.log(`New SSE connection is created. State: ${_source.readyState}.`);
                });
                console.log(`New SSE connection is created. State: ${_source.readyState}.`);
            }
        }

        this.close = function () {
            if (_source && (_source.readyState !== 2)) {
                debugger;
                _source.close();
            }
        }
    }

}
