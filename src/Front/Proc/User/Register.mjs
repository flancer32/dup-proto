/**
 * On-demand process to register new 'user' on the back.
 *
 * @namespace Fl32_Dup_Front_Proc_User_Register
 */
// MODULE'S VARS
const NS = 'Fl32_Dup_Front_Proc_User_Register';

// MODULE'S FUNCTIONS
export default function (spec) {
    // DEPS
    /** @type {Fl32_Dup_Front_Defaults} */
    const DEF = spec['Fl32_Dup_Front_Defaults$'];
    /** @type {TeqFw_Web_Front_App_Connect_Event_Direct_Portal} */
    const portalBack = spec['TeqFw_Web_Front_App_Connect_Event_Direct_Portal$'];
    /** @type {TeqFw_Web_Front_App_Event_Bus} */
    const eventsFront = spec['TeqFw_Web_Front_App_Event_Bus$'];
    /** @type {Fl32_Dup_Shared_Event_Back_User_SignUp_Response} */
    const esbUserRegistered = spec['Fl32_Dup_Shared_Event_Back_User_SignUp_Response$'];
    /** @type {Fl32_Dup_Shared_Event_Front_User_SignUp_Request} */
    const esfUserSignedUp = spec['Fl32_Dup_Shared_Event_Front_User_SignUp_Request$'];

    // ENCLOSED FUNCS
    /**
     * @param {string} nick
     * @param {string} invite invitation code if this is not the first user.
     * @param {string} pubKey
     * @return {Promise<{success: boolean}>}
     * @memberOf Fl32_Dup_Front_Proc_User_Register
     */
    async function process({nick, invite, pubKey} = {}) {
        return new Promise((resolve) => {
            // ENCLOSED VARS
            let idFail, subs, success = false;

            // ENCLOSED FUNCS
            /**
             * @param {Fl32_Dup_Shared_Event_Back_User_SignUp_Response.Dto} data
             */
            function onBackResponse({data}) {
                clearTimeout(idFail);
                eventsFront.unsubscribe(subs);
                resolve({success: data?.success});
            }

            /**
             * Unsubscribe callback handler and return.
             */
            function onTimeout() {
                eventsFront.unsubscribe(subs);
                resolve({success});
            }

            // MAIN
            // subscribe to response event from back and setup timeout response
            subs = eventsFront.subscribe(esbUserRegistered.getEventName(), onBackResponse);
            idFail = setTimeout(onTimeout, DEF.TIMEOUT_EVENT_RESPONSE); // return after timeout
            // create event message and publish it to back
            const event = esfUserSignedUp.createDto();
            const data = event.data;
            data.invite = invite;
            data.keyPub = pubKey;
            data.nick = nick;
            portalBack.publish(event);
        });
    }

    // MAIN
    Object.defineProperty(process, 'namespace', {value: `${NS}.process`});
    return process;
}
