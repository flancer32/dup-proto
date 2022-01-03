/**
 * @implements TeqFw_Web_Front_Api_Event_Stream_Reverse_IState
 */
export default class Fl32_Dup_Front_Redo_TeqFw_Web_Front_Api_Event_Stream_Reverse_State {
    constructor(spec) {
        // EXTRACT DEPS
        /** @type {Fl32_Dup_Front_Rx_Led} */
        const modLed = spec['Fl32_Dup_Front_Rx_Led$'];

        // DEFINE INSTANCE METHODS
        this.closed = function () {
            modLed.setServerDisconnected();
        }

        this.connected = function () {
            modLed.setServerConnected()
        }

        this.error = function (e) {
            console.dir(e);
        }
    }

}
