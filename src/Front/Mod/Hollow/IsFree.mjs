/**
 * Model for hollow state (free or occupied).
 */
export default class Fl32_Dup_Front_Mod_Hollow_IsFree {
    constructor(spec) {
        // EXTRACT DEPS
        /** @type {Fl32_Dup_Front_Defaults} */
        const DEF = spec['Fl32_Dup_Front_Defaults$'];
        /** @type {TeqFw_Web_Front_App_Event_Bus} */
        const eventsFront = spec['TeqFw_Web_Front_App_Event_Bus$'];
        /** @type {TeqFw_Web_Front_App_Connect_Event_Direct_Portal} */
        const portalBack = spec['TeqFw_Web_Front_App_Connect_Event_Direct_Portal$'];
        /** @type {Fl32_Dup_Shared_Event_Front_Hollow_State_Request} */
        const esfReq = spec['Fl32_Dup_Shared_Event_Front_Hollow_State_Request$'];
        /** @type {Fl32_Dup_Shared_Event_Back_Hollow_State_Response} */
        const esbRes = spec['Fl32_Dup_Shared_Event_Back_Hollow_State_Response$'];
        /** @type {TeqFw_Web_Front_Mod_App_Front_Identity} */
        const frontIdentity = spec['TeqFw_Web_Front_Mod_App_Front_Identity$'];

        // ENCLOSED VARS
        let _cache;

        // ENCLOSED FUNCTIONS
        /**
         * Get hollow state from the server.
         * @return {Promise<Fl32_Dup_Shared_Event_Back_Hollow_State_Response.Dto|null>}
         */
        function requestHollowState() {
            return new Promise((resolve) => {
                // ENCLOSED VARS
                let idFail, subs;

                // ENCLOSED FUNCTIONS
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
                event.data.frontId = frontIdentity.getFrontId();
                portalBack.publish(event);
            });

        }

        // INSTANCE METHODS

        /**
         * 'true' if there is any user on the server.
         * @return {Promise<boolean>}
         */
        this.get = async () => {
            if (_cache === undefined) {
                const res = await requestHollowState();
                _cache = res?.hollowIsFree;
            }
            return _cache;
        }

        /**
         * @param {boolean} data
         */
        this.set = (data) => {
            _cache = data;
        }
    }
}
