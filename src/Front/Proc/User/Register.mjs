/**
 * Register new user on the back and wait for response.
 *
 * @namespace Fl32_Dup_Front_Proc_User_Register
 */
// MODULE'S VARS
const ATTEMPTS = 4; // number of attempts to get response event from backend
const TIMEOUT = 5000; // between events messages to backend

// MODULE'S CLASSES
/**
 * @implements TeqFw_Core_Shared_Api_Event_IProcess
 */
export default class Fl32_Dup_Front_Proc_User_Register {
    constructor(spec) {
        // EXTRACT DEPS
        /** @type {TeqFw_Web_Front_App_UUID} */
        const frontUUID = spec['TeqFw_Web_Front_App_UUID$'];
        /** @type {TeqFw_Web_Front_App_Event_Queue} */
        const eventsQueue = spec['TeqFw_Web_Front_App_Event_Queue$'];
        /** @type {TeqFw_Web_Front_App_Event_Embassy} */
        const backEmbassy = spec['TeqFw_Web_Front_App_Event_Embassy$'];
        /** @type {Fl32_Dup_Shared_Event_Back_User_SignUp_Registered} */
        const esbUserRegistered = spec['Fl32_Dup_Shared_Event_Back_User_SignUp_Registered$'];
        /** @type {Fl32_Dup_Shared_Event_Front_User_SignedUp} */
        const esfUserSignedUp = spec['Fl32_Dup_Shared_Event_Front_User_SignedUp$'];

        // INSTANCE METHODS
        this.init = async function () { }

        /**
         * Register new user on back then save it to local store.
         * @param {string} nick
         * @param {string} invite
         * @param {string} pubKey
         * @param {Fl32_Dup_Front_Dto_User_Subscription.Dto} subscription
         * @return {Promise<Fl32_Dup_Shared_Event_Back_User_SignUp_Registered.Dto|null>}
         */
        this.run = async function ({nick, invite, pubKey, subscription}) {
            const payload = esfUserSignedUp.createDto();
            payload.endpoint = subscription.endpoint;
            payload.invite = invite;
            payload.nick = nick;
            payload.keyAuth = subscription.keys.auth;
            payload.keyP256dh = subscription.keys.p256dh;
            payload.keyPub = pubKey;
            payload.frontUUID = frontUUID.get();
            // send event to backend first time
            // noinspection ES6MissingAwait
            eventsQueue.add(esfUserSignedUp.getName(), payload);
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
                    } else eventsQueue.add(esfUserSignedUp.getName(), payload);
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
