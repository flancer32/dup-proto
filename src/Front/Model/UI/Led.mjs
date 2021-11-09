/**
 * UI LED indicator in header.
 *
 * @namespace Fl32_Dup_Front_Model_UI_Led
 */
// MODULE'S VARS
/**
 * @memberOf Fl32_Dup_Front_Model_UI_Led
 */
const STATE = {
    AJAX_ON: 'ajax',
    NET_OK: 'net',
    OFF: 'off',
    SERVER_OK: 'server',
}
Object.freeze(STATE);

// MODULE'S CLASSES
export default class Fl32_Dup_Front_Model_UI_Led {
    constructor(spec) {
        // EXTRACT DEPS
        /** @type {TeqFw_Vue_Front_Lib} */
        const VueLib = spec['TeqFw_Vue_Front_Lib$'];

        // DEFINE WORKING VARS / PROPS
        const ref = VueLib.getVue().ref;
        /** @type {{value: Fl32_Dup_Front_Dto_Contacts_Card.Dto[]}} */
        const _data = ref(STATE.OFF);
        let isOffline = false;
        let isConnected = false;
        let isAjax = false;

        // DEFINE INNER FUNCTIONS
        /**
         * Calculate LED state and set reactive element.
         */
        function calcState() {
            const current = _data.value;
            let next;
            if (isOffline) {
                next = STATE.OFF;
            } else {
                next = STATE.NET_OK;
                if (isConnected) {
                    next = STATE.SERVER_OK;
                    if (isAjax) {
                        next = STATE.AJAX_ON;
                    }
                }
            }
            if (current !== next) _data.value = next;
        }

        // DEFINE INSTANCE METHODS

        /**
         * Get reactive object.
         * @return {{value: Fl32_Dup_Front_Dto_Contacts_Card.Dto[]}}
         */
        this.getRef = () => _data;
        this.setOffline = function () {
            isOffline = false;
            calcState();
        }
        this.setOnline = function () {
            isOffline = true;
            calcState();
        }
        this.setServerConnected = function () {
            isConnected = true;
            calcState();
        }
        this.setServerDisconnected = function () {
            isConnected = false;
            calcState();
        }
        this.setAjaxOn = function () {
            isAjax = true;
            calcState();
        }
        this.setAjaxOff = function () {
            isAjax = false;
            calcState();
        }

        // MAIN FUNCTIONALITY

    }

    /**
     * @return {typeof Fl32_Dup_Front_Model_UI_Led.STATE}
     */
    getStates() {
        return STATE;
    }
}