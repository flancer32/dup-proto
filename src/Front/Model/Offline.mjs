/**
 * Model to control offline/online mode switching in browser..
 *
 * @namespace Fl32_Dup_Front_Model_Offline
 */
export default class Fl32_Dup_Front_Model_Offline {
    constructor(spec) {
        // EXTRACT DEPS
        /** @type {Fl32_Dup_Front_Rx_Led} */
        const rxLed = spec['Fl32_Dup_Front_Rx_Led$'];
        /** @type {Fl32_Dup_Front_Model_SSE_Connect_Manager} */
        const sseConnect = spec['Fl32_Dup_Front_Model_SSE_Connect_Manager$'];

        // DEFINE WORKING VARS / PROPS

        // DEFINE INNER FUNCTIONS

        // DEFINE INSTANCE METHODS

        // MAIN FUNCTIONALITY
        window.addEventListener('online', async (evt) => {
            console.log(`We are online`);
            rxLed.setOnline();
            await sseConnect.open();
        });
        window.addEventListener('offline', (evt) => {
            console.log(`We are offline`);
            rxLed.setOffline();
        });
    }
}
