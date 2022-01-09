/**
 * Receive posted messages from sender, save it to 'Posted Queue', send message to recipient.
 * Receive report from recipient, move message from 'Posted Queue' to 'Delivered Queue' then report about delivery
 * to sender. Get delivery report confirmation from sender and remove message from queue.
 */
export default class Fl32_Dup_Back_Proc_Msg_Queue {
    constructor(spec) {
        // EXTRACT DEPS
        /** @type {Fl32_Dup_Back_Defaults} */
        const DEF = spec['Fl32_Dup_Back_Defaults$'];
        /** @type {TeqFw_Core_Shared_Logger} */
        const logger = spec['TeqFw_Core_Shared_Logger$'];
        /** @type {TeqFw_Core_Back_Config} */
        const config = spec['TeqFw_Core_Back_Config$'];
        /** @type {TeqFw_Web_Back_App_Server_Handler_Event_Embassy} */
        const frontEmbassy = spec['TeqFw_Web_Back_App_Server_Handler_Event_Embassy$'];
        /** @type {TeqFw_Web_Back_App_Server_Handler_Event_Queue} */
        const backQueue = spec['TeqFw_Web__Back_App_Server_Handler_Event_Queue$'];
        /** @type {Fl32_Dup_Shared_Event_Front_Msg_Post} */
        const esfMsgPost = spec['Fl32_Dup_Shared_Event_Front_Msg_Post$'];
        /** @type {Fl32_Dup_Shared_Event_Back_Msg_Confirm_Post} */
        const esbConfirmPost = spec['Fl32_Dup_Shared_Event_Back_Msg_Confirm_Post$'];
        /** @type {Fl32_Dup_Back_Mod_Msg_Queue_Posted} */
        const queuePosted = spec['Fl32_Dup_Back_Mod_Msg_Queue_Posted$'];

        // DEFINE WORKING VARS / PROPS

        // MAIN FUNCTIONALITY
        frontEmbassy.subscribe(esfMsgPost.getName(), onMessagePost)

        // DEFINE INNER FUNCTIONS
        async function onMessagePost(evt) {
            debugger
            // register new message in posted queue
            const msgKey = queuePosted.add(evt);
            const payload = esbConfirmPost.createDto();
            payload.messageId = msgKey;
            backQueue.add(evt.frontUUID, esbConfirmPost.getName(), payload);
        }
    }
}
