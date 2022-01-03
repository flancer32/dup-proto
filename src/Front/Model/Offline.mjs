/**
 * Model to control offline/online mode switching in browser.
 *
 * @namespace Fl32_Dup_Front_Model_Offline
 */
export default class Fl32_Dup_Front_Model_Offline {
    constructor(spec) {
        // EXTRACT DEPS
        /** @type {Fl32_Dup_Front_Rx_Led} */
        const rxLed = spec['Fl32_Dup_Front_Rx_Led$'];
        /** @type {TeqFw_Web_Front_App_Event_Stream_Reverse} */
        const eventStreamReverse = spec['TeqFw_Web_Front_App_Event_Stream_Reverse$'];

        // DEFINE WORKING VARS / PROPS

        // DEFINE INNER FUNCTIONS

        // DEFINE INSTANCE METHODS

        // MAIN FUNCTIONALITY
        window.addEventListener('online', async () => {
            console.log(`We are online`);
            rxLed.setOnline();
            await eventStreamReverse.open();
        });
        window.addEventListener('offline', () => {
            console.log(`We are offline`);
            rxLed.setOffline();
        });
    }
}
