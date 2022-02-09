/**
 * On-demand process to transfer new user message to backend and wait for confirmation.
 * @namespace Fl32_Dup_Front_Proc_Msg_Post
 */
// MODULE'S VARS
const NS = 'Fl32_Dup_Front_Proc_Msg_Post';

// MODULE'S FUNCTIONS
export default function (spec) {
    // DEPS
    /** @type {Fl32_Dup_Front_Defaults} */
    const DEF = spec['Fl32_Dup_Front_Defaults$'];
    /** @type {TeqFw_Web_Front_Mod_App_Front_Identity} */
    const frontIdentity = spec['TeqFw_Web_Front_Mod_App_Front_Identity$'];
    /** @type {TeqFw_Web_Front_Lib_Uuid.v4|function} */
    const uuidV4 = spec['TeqFw_Web_Front_Lib_Uuid.v4'];
    /** @type {TeqFw_Web_Front_App_Connect_Event_Direct_Portal} */
    const portalBack = spec['TeqFw_Web_Front_App_Connect_Event_Direct_Portal$'];
    /** @type {TeqFw_Web_Front_App_Event_Bus} */
    const eventsFront = spec['TeqFw_Web_Front_App_Event_Bus$'];
    /** @type {Fl32_Dup_Shared_Event_Front_Msg_Post} */
    const esfPosted = spec['Fl32_Dup_Shared_Event_Front_Msg_Post$'];
    /** @type {Fl32_Dup_Shared_Event_Back_Msg_Confirm_Post} */
    const esbConfirm = spec['Fl32_Dup_Shared_Event_Back_Msg_Confirm_Post$'];

    // ENCLOSED FUNCS

    /**
     * Post encrypted message to back and wait for post confirmation.
     * @param {string} payload encrypted data
     * @param {number} userId TODO: remove this input argument, back should use stream UUID to identify sender
     * @param {number} recipientId
     * @return {Promise<Fl32_Dup_Shared_Event_Back_Msg_Confirm_Post.Dto>}
     *
     * @memberOf Fl32_Dup_Front_Proc_Msg_Post
     */
    async function process({payload, userId, recipientId} = {}) {
        return new Promise((resolve) => {
            // ENCLOSED VARS
            let idFail, subs, msgUUID = uuidV4();

            // ENCLOSED FUNCTIONS
            /**
             * @param {Fl32_Dup_Shared_Event_Back_Msg_Confirm_Post.Dto} data
             */
            function onResponse({data}) {
                clearTimeout(idFail);
                eventsFront.unsubscribe(subs);
                // tmp code to catch wrong answers
                const theSameMsg = (data?.messageId === msgUUID);
                if (!theSameMsg) debugger;
                resolve(data);
            }

            // MAIN

            // subscribe to response event from back and create timeout response
            subs = eventsFront.subscribe(esbConfirm.getEventName(), onResponse);
            idFail = setTimeout(() => {
                eventsFront.unsubscribe(subs);
                resolve();
            }, DEF.TIMEOUT_EVENT_RESPONSE); // return nothing after timeout

            // create event message and publish it to back
            const event = esfPosted.createDto();
            event.meta.frontUUID = frontIdentity.getUuid();
            event.data.message.payload = payload;
            event.data.message.senderId = userId;
            event.data.message.recipientId = recipientId;
            event.data.message.dateSent = new Date();
            event.data.message.uuid = msgUUID;
            portalBack.publish(event);
        });
    }

    // MAIN
    Object.defineProperty(process, 'namespace', {value: `${NS}.process`});
    return process;
}
