/**
 * Reactive element, LED indicator in header for network state and activities.
 * There are 3 states:
 *  - offline: front is not connected to back (browser is in offline or server is down);
 *  - online: front has opened reverse connection to get server events;
 *  - active: some outgoing activity is performed (front to back requests);
 *
 * @namespace Fl32_Dup_Front_Rx_Led
 */
// MODULE'S VARS
/**
 * @memberOf Fl32_Dup_Front_Rx_Led
 */
const STATE = {
    ACTIVE: 'active',
    OFF: 'offline',
    SERVER_OK: 'online',
}
Object.freeze(STATE);

// MODULE'S CLASSES
/**
 * @implements TeqFw_Web_Front_Api_Mod_Server_IConnect
 */
export default class Fl32_Dup_Front_Rx_Led {
    constructor(spec) {
        // EXTRACT DEPS
        const {ref} = spec['TeqFw_Vue_Front_Lib_Vue'];

        // ENCLOSED VARS
        const _data = ref(STATE.OFF);
        let isOffline = true;
        let isAjax = false;

        // ENCLOSED FUNCTIONS
        /**
         * Calculate LED state and set reactive element.
         */
        function calcState() {
            const current = _data.value;
            let next;
            if (isOffline) {
                next = STATE.OFF;
            } else {
                next = STATE.SERVER_OK;
                if (isAjax) {
                    next = STATE.ACTIVE;
                }
            }
            if (current !== next) _data.value = next;
        }

        // INSTANCE METHODS

        /**
         * Get reactive object.
         */
        this.getRef = () => _data;

        this.startActivity = function () {
            isAjax = true;
            calcState();
        }

        this.stopActivity = function () {
            isAjax = false;
            calcState();
        }

        this.setOffline = function () {
            isOffline = true;
            calcState();
        }

        this.setOnline = function () {
            isOffline = false;
            calcState();
        }

    }

    /**
     * @return {typeof Fl32_Dup_Front_Rx_Led.STATE}
     */
    getStates() {
        return STATE;
    }
}
