/**
 * Re-open events reverse stream if it was closed by server.
 * Try to open stream every 1 min until stream will be opened.
 *
 * @namespace Fl32_Dup_Front_Proc_Connect_Manager
 */
export default class Fl32_Dup_Front_Proc_Connect_Manager {
    constructor(spec) {
        // EXTRACT DEPS
        /** @type {TeqFw_Core_Shared_Logger} */
        const logger = spec['TeqFw_Core_Shared_Logger$'];
        /** @type {TeqFw_Web_Front_App_Connect_Event_Reverse} */
        const stream = spec['TeqFw_Web_Front_App_Connect_Event_Reverse$'];
        /** @type {TeqFw_Web_Front_App_Event_Bus} */
        const eventsFront = spec['TeqFw_Web_Front_App_Event_Bus$'];
        /** @type {TeqFw_Web_Front_Event_Connect_Event_Reverse_Closed} */
        const efClosed = spec['TeqFw_Web_Front_Event_Connect_Event_Reverse_Closed$'];
        /** @type {TeqFw_Web_Front_Event_Connect_Event_Reverse_Opened} */
        const efOpened = spec['TeqFw_Web_Front_Event_Connect_Event_Reverse_Opened$'];

        // DEFINE WORKING VARS / PROPS
        let _isOpened = false;
        let _idIntervalTry;

        // MAIN FUNCTIONALITY
        eventsFront.subscribe(efOpened.getEventName(), () => {
            _isOpened = true;
            if (_idIntervalTry) {
                clearInterval(_idIntervalTry);
                _idIntervalTry = null;
            }
            logger.info(`New back-to-front event stream is opened by Connection Manager.`);
        });

        eventsFront.subscribe(efClosed.getEventName(), () => {
            logger.info(`Back-to-front event stream is closed. Try to re-connect.`);
            if (!_idIntervalTry)
                _idIntervalTry = setInterval(() => {
                    stream.open();
                    logger.info(`Connection Manager tries to open back-to-front event stream.`);
                }, 1000 * 5)
        });

        // INSTANCE METHODS
        this.init = function () {
        }
    }
}
