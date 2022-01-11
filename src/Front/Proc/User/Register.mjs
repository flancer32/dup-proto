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
        /** @type {TeqFw_Web_Front_App_Connect_Event_Direct_Portal} */
        const portalBack = spec['TeqFw_Web_Front_App_Connect_Event_Direct_Portal$'];
        /** @type {TeqFw_Web_Front_App_Event_Bus} */
        const eventsFront = spec['TeqFw_Web_Front_App_Event_Bus$'];
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
            const message = esfUserSignedUp.createDto();
            const data = message.data;
            data.endpoint = subscription.endpoint;
            data.invite = invite;
            data.nick = nick;
            data.keyAuth = subscription.keys.auth;
            data.keyP256dh = subscription.keys.p256dh;
            data.keyPub = pubKey;
            data.frontUUID = frontUUID.get();
            // send event to backend first time
            portalBack.publish(message);
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
                    resolve(evt?.data);
                }

                /**
                 * Send event message to the back or resolve promise with 'null' if attempts count is too high.
                 */
                function repeat() {
                    if (++i > ATTEMPTS) {
                        clearInterval(repeatId);
                        resolve(null);
                    } else portalBack.publish(message);
                }

                // MAIN
                // repeat event message every 5 sec.
                repeatId = setInterval(repeat, TIMEOUT);
                // subscribe to response event from back
                eventsFront.subscribe(esbUserRegistered.getEventName(), onBackResponse);
            });
        }
    }
}
