/**
 * @implements TeqFw_Web_Front_Api_Gate_IAjaxLed
 */
export default class Fl32_Dup_Front_Redo_TeqFw_Web_Front_Api_Gate_IAjaxLed {
    constructor(spec) {
        // EXTRACT DEPS
        /** @type {Fl32_Dup_Front_Rx_Led} */
        const modLed = spec['Fl32_Dup_Front_Rx_Led$'];

        // DEFINE INSTANCE METHODS
        this.off = function () {
            modLed.setAjaxOff();
        }

        this.on = function () {
            modLed.setAjaxOn()
        }

        this.reset = function () {
            modLed.setAjaxOff();
        }
    }

}
