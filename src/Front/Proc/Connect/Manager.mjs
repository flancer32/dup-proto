/**
 * Re-open events reverse stream if it was closed by server.
 * Try to open stream every 1 min until stream will be opened.
 *
 * @namespace Fl32_Dup_Front_Proc_Connect_Manager
 */
export default class Fl32_Dup_Front_Proc_Connect_Manager {
    constructor(spec) {
        // EXTRACT DEPS
        /** @type {TeqFw_Web_Front_App_Event_Stream_Reverse} */
        const stream = spec['TeqFw_Web_Front_App_Event_Stream_Reverse$'];
        /** @type {TeqFw_Web_Front_Event_Stream_Reverse_Closed} */
        const efClosed = spec['TeqFw_Web_Front_Event_Stream_Reverse_Closed$'];
        /** @type {TeqFw_Web_Front_Event_Stream_Reverse_Opened} */
        const efOpened = spec['TeqFw_Web_Front_Event_Stream_Reverse_Opened$'];

        // DEFINE WORKING VARS / PROPS
        let _isOpened = false;
        let _idIntervalTry;

        // MAIN FUNCTIONALITY

        stream.subscribe(efOpened.getName(), () => {
            _isOpened = true;
            if (_idIntervalTry) {
                clearInterval(_idIntervalTry);
                _idIntervalTry = null;
            }
        });

        stream.subscribe(efClosed.getName(), () => {
            if (!_idIntervalTry)
                _idIntervalTry = setInterval(() => {
                    stream.open();
                }, 1000 * 5)
        });

        // DEFINE INNER FUNCTIONS

        // DEFINE INSTANCE METHODS
        this.init = function () {
        }
    }
}
