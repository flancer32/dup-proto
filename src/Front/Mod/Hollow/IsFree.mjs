/**
 * Model for hollow state (free or occupied).
 * IDB is the first data source for the model. If IDB has no data then ask the back.
 */
export default class Fl32_Dup_Front_Mod_Hollow_IsFree {
    constructor(spec) {
        // DEPS
        /** @type {Fl32_Dup_Front_Defaults} */
        const DEF = spec['Fl32_Dup_Front_Defaults$'];
        /** @type {TeqFw_Web_Event_Front_Mod_Bus} */
        const eventsFront = spec['TeqFw_Web_Event_Front_Mod_Bus$'];
        /** @type {TeqFw_Web_Event_Front_Mod_Connect_Direct_Portal} */
        const portalBack = spec['TeqFw_Web_Event_Front_Mod_Connect_Direct_Portal$'];
        /** @type {Fl32_Dup_Shared_Event_Front_Hollow_State_Request} */
        const esfReq = spec['Fl32_Dup_Shared_Event_Front_Hollow_State_Request$'];
        /** @type {Fl32_Dup_Shared_Event_Back_Hollow_State_Response} */
        const esbRes = spec['Fl32_Dup_Shared_Event_Back_Hollow_State_Response$'];
        /** @type {TeqFw_Web_Auth_Front_Mod_Identity} */
        const modIdentity = spec['TeqFw_Web_Auth_Front_Mod_Identity$'];
        /** @type {Fl32_Dup_Front_Mod_User_Profile} */
        const modProfile = spec['Fl32_Dup_Front_Mod_User_Profile$'];

        // VARS
        /** @type {boolean} */
        let _cache;

        // FUNCS
        /**
         * Get hollow state from the server.
         * @return {Promise<Fl32_Dup_Shared_Event_Back_Hollow_State_Response.Dto|null>}
         */
        function requestHollowState() {
            return new Promise((resolve) => {
                // VARS
                let idFail, subs;

                // FUNCS
                /**
                 * @param {Fl32_Dup_Shared_Event_Back_Hollow_State_Response.Dto} data
                 */
                function onResponse({data}) {
                    clearTimeout(idFail);
                    resolve(data);
                    eventsFront.unsubscribe(subs);
                }

                // MAIN
                // subscribe to response event from back and create timeout response
                subs = eventsFront.subscribe(esbRes.getEventName(), onResponse);
                idFail = setTimeout(() => {
                    eventsFront.unsubscribe(subs);
                    resolve();
                }, DEF.TIMEOUT_EVENT_RESPONSE); // return nothing after timeout

                // create event message and publish it to back
                const event = esfReq.createDto();
                event.data.frontId = modIdentity.getFrontBid();
                portalBack.publish(event);
            });

        }

        // INSTANCE METHODS

        /**
         * 'true' if there is a local user profile in IDB or there is one only user on the server.
         * @return {Promise<boolean>}
         */
        this.get = async () => {
            if (_cache === undefined) {
                /** @type {Fl32_Dup_Front_Dto_User.Dto} */
                const profile = await modProfile.get();
                if (profile?.nick) _cache = false;
                else {
                    const res = await requestHollowState();
                    _cache = res?.hollowIsFree;
                }
            }
            return _cache;
        }
    }
}
