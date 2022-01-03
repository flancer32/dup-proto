/**
 * LEDs panel to indicate connection state.
 *
 * @namespace Fl32_Dup_Front_Layout_Leds
 */
// MODULE'S VARS
const NS = 'Fl32_Dup_Front_Layout_Leds';
// Quasar codes for colors
const Q_COLOR_OFF = 'grey';
const Q_COLOR_NET = 'blue-7';
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
    const rxLed = spec['Fl32_Dup_Front_Rx_Led$'];
    /** @type {TeqFw_Web_Front_App_Event_Stream_Reverse} */
    const eventStreamReverse = spec['TeqFw_Web_Front_App_Event_Stream_Reverse$'];

    // DEFINE WORKING VARS
    /** @type {typeof Fl32_Dup_Front_Rx_Led.STATE} */
    const STATE = rxLed.getStates();
    const template = `
<q-btn dense flat round icon="lens" size="8.5px" :color="color" v-on:click="action"/>
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
        components: {},
        data() {
            return {};
        },
        computed: {
            color() {
                const state = rxLed.getRef().value;
                if (state === STATE.AJAX_ON) {
                    return Q_COLOR_AJAX;
                } else if (state === STATE.SERVER_OK) {
                    return Q_COLOR_OK;
                } else if (state === STATE.NET_OK) {
                    return Q_COLOR_NET;
                } else {
                    return Q_COLOR_OFF;
                }
            }
        },
        methods: {
            async action() {
                const ledState = rxLed.getRef().value;
                const isStreamOpened = eventStreamReverse.stateOpen();
                if (ledState === STATE.NET_OK) {
                    if (isStreamOpened) {
                        rxLed.setServerConnected();
                    } else {
                        await eventStreamReverse.open();
                    }
                } else if (ledState === STATE.SERVER_OK) {
                    if (!isStreamOpened) {
                        rxLed.setServerDisconnected();
                    } else {
                        await eventStreamReverse.close();
                    }

                }
            }
        },
        async mounted() {
        },
    };
}
