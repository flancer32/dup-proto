/**
 * Get incoming messages from backend and send confirmation back.
 */
// MODULE'S VARS
const ATTEMPTS = 4; // number of attempts to get response event from backend
const TIMEOUT = 5000; // between events messages to backend

/**
 * @implements TeqFw_Core_Shared_Api_Event_IProcess
 */
export default class Fl32_Dup_Front_Proc_Msg_Receive {
    constructor(spec) {
        // EXTRACT DEPS
        /** @type {TeqFw_Web_Front_App_UUID} */
        const frontUUID = spec['TeqFw_Web_Front_App_UUID$'];
        /** @type {TeqFw_Web_Front_App_Event_Queue} */
        const eventsQueue = spec['TeqFw_Web_Front_App_Event_Queue$'];
        /** @type {TeqFw_Web_Front_App_Event_Embassy} */
        const backEmbassy = spec['TeqFw_Web_Front_App_Event_Embassy$'];
        /** @type {Fl32_Dup_Shared_Event_Front_Msg_Post} */
        const esfPosted = spec['Fl32_Dup_Shared_Event_Front_Msg_Post$'];

        // ENCLOSED VARS

        // MAIN

        // ENCLOSED FUNCTIONS

        // INSTANCE METHODS
        this.init = async function () { }
        this.run = async function ({}) {
            const payload = esfPosted.createDto();
            // send event to backend first time
            // noinspection ES6MissingAwait
            eventsQueue.add(esfPosted.getName(), payload);
            // wait until response event will come from back
            return await new Promise((resolve) => {
                // ENCLOSED VARS
                let i = 1, repeatId;

                // ENCLOSED FUNCTIONS
                /**
                 *
                 * {Fl32_Dup_Shared_Event_Back_User_SignUp_Registered.Dto}
                 * @param evt
                 */
                function onBackResponse(evt) {
                    if (repeatId) clearInterval(repeatId);
                    resolve(evt);
                }

                /**
                 * Send event message to the back or resolve promise with 'null' if attempts count is too high.
                 */
                function repeat() {
                    if (++i > ATTEMPTS) {
                        clearInterval(repeatId);
                        resolve(null);
                    } else eventsQueue.add(esfPosted.getName(), payload);
                }

                // MAIN
                // repeat event message every 5 sec.
                repeatId = setInterval(repeat, TIMEOUT);
                // subscribe to response event from back
                backEmbassy.subscribe(esbUserRegistered.getName(), onBackResponse);
            });
        }
    }
}
