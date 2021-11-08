/**
 * @implements TeqFw_Web_Front_Api_SSE_IState
 */
export default class Fl32_Dup_Front_Redo_TeqFw_Web_Front_Api_SSE_IState {
    constructor(spec) {
        // EXTRACT DEPS
        /** @type {Fl32_Dup_Front_Model_UI_Led} */
        const modLed = spec['Fl32_Dup_Front_Model_UI_Led$'];

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
