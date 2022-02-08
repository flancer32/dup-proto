/**
 * Register new user on the back and wait for response.
 * @implements TeqFw_Core_Shared_Api_Event_IProcess
 * @deprecated use Fl32_Dup_Front_Proc_User_RegNew
 */
export default class Fl32_Dup_Front_Proc_User_Register {
    constructor(spec) {
        // EXTRACT DEPS
        /** @type {Fl32_Dup_Front_Defaults} */
        const DEF = spec['Fl32_Dup_Front_Defaults$'];
        /** @type {TeqFw_Web_Front_Mod_App_Front_Identity} */
        const appIdentity = spec['TeqFw_Web_Front_Mod_App_Front_Identity$'];
        /** @type {TeqFw_Web_Front_App_Connect_Event_Direct_Portal} */
        const portalBack = spec['TeqFw_Web_Front_App_Connect_Event_Direct_Portal$'];
        /** @type {TeqFw_Web_Front_App_Event_Bus} */
        const eventsFront = spec['TeqFw_Web_Front_App_Event_Bus$'];
        /** @type {Fl32_Dup_Shared_Event_Back_User_SignUp_Response} */
        const esbUserRegistered = spec['Fl32_Dup_Shared_Event_Back_User_SignUp_Response$'];
        /** @type {Fl32_Dup_Shared_Event_Front_User_SignUp_Request} */
        const esfUserSignedUp = spec['Fl32_Dup_Shared_Event_Front_User_SignUp_Request$'];

        // INSTANCE METHODS
        this.init = async function () { }

        /**
         * Register new user on back then save it to local store.
         * @param {string} nick
         * @param {string} invite
         * @param {string} pubKey
         * @return {Promise<Fl32_Dup_Shared_Event_Back_User_SignUp_Response.Dto>}
         */
        this.run = async function ({nick, invite, pubKey}) {
            return await new Promise((resolve) => {
                // ENCLOSED VARS
                let idFail, subs;

                // ENCLOSED FUNCTIONS
                /**
                 * @param {Fl32_Dup_Shared_Event_Back_User_SignUp_Response.Dto} data
                 */
                function onBackResponse({data}) {
                    clearTimeout(idFail);
                    resolve(data);
                    eventsFront.unsubscribe(subs);
                }

                // MAIN

                // subscribe to response event from back and create timeout response
                subs = eventsFront.subscribe(esbUserRegistered.getEventName(), onBackResponse);
                idFail = setTimeout(() => {
                    eventsFront.unsubscribe(subs);
                    resolve();
                }, DEF.TIMEOUT_EVENT_RESPONSE); // return nothing after timeout

                // create event message and publish it to back
                const event = esfUserSignedUp.createDto();
                const data = event.data;
                data.invite = invite;
                data.nick = nick;
                data.keyPub = pubKey;
                portalBack.publish(event);
            });
        }
    }
}
