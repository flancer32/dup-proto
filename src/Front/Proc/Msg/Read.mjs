/**
 * On-demand process to transfer report about message reading from recipient to author.
 * @namespace Fl32_Dup_Front_Proc_Msg_Read
 */
// MODULE'S VARS
const NS = 'Fl32_Dup_Front_Proc_Msg_Read';

// MODULE'S FUNCTIONS
export default function (spec) {
    // DEPS
    /** @type {Fl32_Dup_Front_Defaults} */
    const DEF = spec['Fl32_Dup_Front_Defaults$'];
    /** @type {TeqFw_Core_Shared_Api_ILogger} */
    const logger = spec['TeqFw_Core_Shared_Api_ILogger$$']; // instance
    /** @type {TeqFw_Web_Front_Mod_App_Front_Identity} */
    const frontIdentity = spec['TeqFw_Web_Front_Mod_App_Front_Identity$'];
    /** @type {TeqFw_Web_Front_App_Connect_Event_Direct_Portal} */
    const portalBack = spec['TeqFw_Web_Front_App_Connect_Event_Direct_Portal$'];
    /** @type {TeqFw_Web_Front_App_Event_Bus} */
    const eventsFront = spec['TeqFw_Web_Front_App_Event_Bus$'];
    /** @type {Fl32_Dup_Shared_Event_Front_Msg_Read} */
    const esfRead = spec['Fl32_Dup_Shared_Event_Front_Msg_Read$'];
    /** @type {Fl32_Dup_Shared_Event_Back_Msg_Confirm_Read} */
    const esbConfirm = spec['Fl32_Dup_Shared_Event_Back_Msg_Confirm_Read$'];

    // FUNCS

    /**
     * Send info about message reading form recipient to author.
     * @param {string} msgUuid UUID for the read message
     * @param {Date} date read date
     * @param {number} authorId backend ID for author's front
     * @return {Promise<Fl32_Dup_Shared_Event_Back_Msg_Confirm_Read.Dto>}
     *
     * @memberOf Fl32_Dup_Front_Proc_Msg_Read
     */
    async function process({msgUuid, date, authorId} = {}) {
        return new Promise((resolve) => {
            // VARS
            let idFail, subs;

            // FUNCS
            /**
             * @param {Fl32_Dup_Shared_Event_Back_Msg_Confirm_Read.Dto} data
             */
            function onResponse({data}) {
                clearTimeout(idFail);
                eventsFront.unsubscribe(subs);
                // tmp code to catch wrong answers
                const theSameMsg = (data?.messageId === msgUuid);
                if (!theSameMsg) debugger;
                resolve(data);
            }

            // MAIN

            // subscribe to response event from back and create timeout response
            subs = eventsFront.subscribe(esbConfirm.getEventName(), onResponse);
            idFail = setTimeout(() => {
                eventsFront.unsubscribe(subs);
                logger.info(`Read report sending for chat message #${msgUuid} is failed by timeout.`,
                    {msgUuid}
                );
                resolve();
            }, DEF.TIMEOUT_EVENT_RESPONSE); // return nothing after timeout

            // create event message and publish it to back
            const event = esfRead.createDto();
            event.meta.frontUUID = frontIdentity.getUuid();
            event.data.messageUuid = msgUuid;
            event.data.dateRead = date;
            event.data.authorId = authorId;
            portalBack.publish(event);
            logger.info(`Read report for chat message #${msgUuid} is sent to the back, event #${event.meta.uuid}.`, {msgUuid});
        });
    }

    // MAIN
    Object.defineProperty(process, 'namespace', {value: `${NS}.process`});
    logger.setNamespace(NS);
    return process;
}
