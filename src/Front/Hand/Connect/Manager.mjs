/**
 * Re-open events reverse stream if it was closed by server.
 * Try to open stream every 5 sec. for first 2 min. then every 1 min until stream will be opened.
 *
 * @namespace Fl32_Dup_Front_Hand_Connect_Manager
 */
// MODULE'S VARS
const TIMEOUT_SMALL = 5000; // 5 sec
const TIMEOUT_NORM = 60000; // 1 min
const INTERVAL_TO_SWITCH = 120000 // 2 min

// MODULE'S CLASSES
export default class Fl32_Dup_Front_Hand_Connect_Manager {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Web_Event_Front_Mod_Connect_Reverse} */
        const stream = spec['TeqFw_Web_Event_Front_Mod_Connect_Reverse$'];
        /** @type {TeqFw_Web_Event_Front_Mod_Bus} */
        const eventsFront = spec['TeqFw_Web_Event_Front_Mod_Bus$'];
        /** @type {TeqFw_Web_Event_Front_Event_Connect_Reverse_Closed} */
        const efClosed = spec['TeqFw_Web_Event_Front_Event_Connect_Reverse_Closed$'];
        /** @type {TeqFw_Web_Event_Front_Event_Connect_Reverse_Opened} */
        const efOpened = spec['TeqFw_Web_Event_Front_Event_Connect_Reverse_Opened$'];

        // VARS
        let _frequent = true; // retry every 5 sec or every 1 min
        let _idIntervalTry; // save ID for running watchdog function
        let _isOpened = false; // 'true' if reverse stream is opened
        /** @type {Date} */
        let _timeStarted; // save watchdog starting time to select wait interval (5 sec or 1 min)

        // MAIN
        eventsFront.subscribe(efOpened.getEventName(), onReverseOpened);
        eventsFront.subscribe(efClosed.getEventName(), onReverseClosed);


        // FUNCS
        /**
         * Clean up watchdog function on stream opening.
         */
        function onReverseOpened() {
            _isOpened = true;
            if (_idIntervalTry) {
                clearInterval(_idIntervalTry);
                _idIntervalTry = null;
            }
        }

        /**
         * Startup watchdog function on stream closing.
         */
        function onReverseClosed() {
            _isOpened = false;
            if (!_idIntervalTry) {
                _frequent = true;
                _timeStarted = new Date();
                _idIntervalTry = setInterval(retryStreamOpening, TIMEOUT_SMALL);
            }
        }

        /**
         * Watchdog function.
         */
        function retryStreamOpening() {
            if (_isOpened && _idIntervalTry) { // stop processing if stream is  opened
                clearInterval(_idIntervalTry);
                _idIntervalTry = null;
            } else if (window.navigator.onLine) {
                if (_frequent) {
                    // frequent retries
                    const now = new Date();
                    if ((now.getTime() - _timeStarted.getTime()) > INTERVAL_TO_SWITCH) {
                        // switch to normal retries
                        clearInterval(_idIntervalTry);
                        _idIntervalTry = setInterval(retryStreamOpening, TIMEOUT_NORM);
                    }
                }
                stream.open();
            }
        }
    }
}
