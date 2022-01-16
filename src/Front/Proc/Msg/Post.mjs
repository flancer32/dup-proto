/**
 * Sender is posted new message to recipient. Transfer this message to backend and wait for confirmation.
 * @implements TeqFw_Core_Shared_Api_Event_IProcess
 */
export default class Fl32_Dup_Front_Proc_Msg_Post {
    constructor(spec) {
        // EXTRACT DEPS
        /** @type {Fl32_Dup_Front_Defaults} */
        const DEF = spec['Fl32_Dup_Front_Defaults$'];
        /** @type {TeqFw_Web_Front_App_UUID} */
        const frontUUID = spec['TeqFw_Web_Front_App_UUID$'];
        /** @type {TeqFw_Web_Front_App_Connect_Event_Direct_Portal} */
        const portalBack = spec['TeqFw_Web_Front_App_Connect_Event_Direct_Portal$'];
        /** @type {TeqFw_Web_Front_App_Event_Bus} */
        const eventsFront = spec['TeqFw_Web_Front_App_Event_Bus$'];
        /** @type {Fl32_Dup_Shared_Event_Front_Msg_Post} */
        const esfPosted = spec['Fl32_Dup_Shared_Event_Front_Msg_Post$'];
        /** @type {Fl32_Dup_Shared_Event_Back_Msg_Confirm_Post} */
        const esbConfirm = spec['Fl32_Dup_Shared_Event_Back_Msg_Confirm_Post$'];

        // ENCLOSED VARS

        // MAIN

        // ENCLOSED FUNCTIONS

        // INSTANCE METHODS
        this.init = async function () { }
        /**
         * Post encrypted message to back and wait for post confirmation.
         * @param {string} message
         * @param {number} userId
         * @param {number} recipientId
         * @return {Promise<Fl32_Dup_Shared_Event_Back_Msg_Confirm_Post.Dto>}
         */
        this.run = async function ({message, userId, recipientId}) {
            return await new Promise((resolve) => {
                // ENCLOSED VARS
                let idFail, subs;

                // ENCLOSED FUNCTIONS
                /**
                 * @param {Fl32_Dup_Shared_Event_Back_Msg_Confirm_Post.Dto} data
                 */
                function onResponse({data}) {
                    clearTimeout(idFail);
                    resolve(data);
                    eventsFront.unsubscribe(subs);
                }

                // MAIN

                // subscribe to response event from back and create timeout response
                subs = eventsFront.subscribe(esbConfirm.getEventName(), onResponse);
                idFail = setTimeout(() => {
                    eventsFront.unsubscribe(subs);
                    resolve();
                }, DEF.TIMEOUT_EVENT_RESPONSE); // return nothing after timeout

                // create event message and publish it to back
                const msg = esfPosted.createDto();
                msg.meta.frontUUID = frontUUID.get();
                msg.data.message = message;
                msg.data.recipientId = recipientId;
                msg.data.userId = userId;
                portalBack.publish(msg);
            });
        }
    }
}
