/**
 * Model to control offline/online mode switching in browser.
 *
 * @namespace Fl32_Dup_Front_Mod_Offline
 */
export default class Fl32_Dup_Front_Mod_Offline {
    constructor(spec) {
        // EXTRACT DEPS
        /** @type {Fl32_Dup_Front_Rx_Led} */
        const rxLed = spec['Fl32_Dup_Front_Rx_Led$'];
        /** @type {TeqFw_Web_Front_App_Connect_Event_Reverse} */
        const eventStreamReverse = spec['TeqFw_Web_Front_App_Connect_Event_Reverse$'];

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
