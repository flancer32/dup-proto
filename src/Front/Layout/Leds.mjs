/**
 * LEDs panel to indicate connection state.
 *
 * @namespace Fl32_Dup_Front_Layout_Leds
 */
// MODULE'S VARS
const NS = 'Fl32_Dup_Front_Layout_Leds';
// Quasar codes for colors
const Q_COLOR_OFF = 'grey';
const Q_COLOR_OK = 'green-8';
const Q_COLOR_AJAX = 'green-6';

// MODULE'S FUNCTIONS
/**
 * TeqFW DI factory function to get dependencies for the object.
 *
 * @returns {Fl32_Dup_Front_Layout_Leds.vueCompTmpl}
 */
export default function (spec) {
    /** @type {Fl32_Dup_Front_Defaults} */
    const DEF = spec['Fl32_Dup_Front_Defaults$'];
    /** @type {Fl32_Dup_Front_Rx_Led} */
    const rxLed = spec['TeqFw_Web_Front_Api_Mod_Server_IConnect$']; // get as interface to get singleton

    // ENCLOSED VARS
    /** @type {typeof Fl32_Dup_Front_Rx_Led.STATE} */
    const STATE = rxLed.getStates();
    const template = `
<q-btn dense flat round icon="lens" size="8.5px" :color="color" />
`;
    /**
     * Template to create new component instances using Vue.
     *
     * @const {Object} vueCompTmpl
     * @memberOf Fl32_Dup_Front_Layout_Leds
     */
    return {
        teq: {package: DEF.SHARED.NAME},
        name: NS,
        template,
        computed: {
            color() {
                const state = rxLed.getRef().value;
                if (state === STATE.ACTIVE) {
                    return Q_COLOR_AJAX;
                } else if (state === STATE.SERVER_OK) {
                    return Q_COLOR_OK;
                } else {
                    return Q_COLOR_OFF;
                }
            }
        },
    };
}
