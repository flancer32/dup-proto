/**
 * Bridge to transfer add contacts request between users.
 *
 * @namespace Fl32_Dup_Back_Proc_Contact_Add_Bridge
 */
export default class Fl32_Dup_Back_Proc_Contact_Add_Bridge {
    constructor(spec) {
        // EXTRACT DEPS
        /** @type {TeqFw_Web_Back_App_Server_Handler_Event_Reverse_Portal} */
        const portalFront = spec['TeqFw_Web_Back_App_Server_Handler_Event_Reverse_Portal$'];
        /** @type {TeqFw_Core_Back_App_Event_Bus} */
        const eventsBack = spec['TeqFw_Core_Back_App_Event_Bus$'];
        /** @type {TeqFw_Web_Back_App_Server_Handler_Event_Reverse_Registry} */
        const regStreams = spec['TeqFw_Web_Back_App_Server_Handler_Event_Reverse_Registry$'];
        /** @type {TeqFw_User_Back_Mod_Event_Stream_Registry} */
        const regUserStreams = spec['TeqFw_User_Back_Mod_Event_Stream_Registry$'];
        /** @type {Fl32_Dup_Shared_Event_Front_Contact_Card_Add_Request} */
        const esfAddReq = spec['Fl32_Dup_Shared_Event_Front_Contact_Card_Add_Request$'];
        /** @type {Fl32_Dup_Shared_Event_Back_User_Contact_Add} */
        const esbAdd = spec['Fl32_Dup_Shared_Event_Back_User_Contact_Add$'];

        // MAIN
        eventsBack.subscribe(esfAddReq.getEventName(), onRequest)

        // ENCLOSED FUNCTIONS
        /**
         * @param {Fl32_Dup_Shared_Event_Front_Contact_Card_Add_Request.Dto} data
         * @param {TeqFw_Web_Shared_App_Event_Trans_Message_Meta.Dto} meta
         * @return {Promise<void>}
         */
        async function onRequest({data, meta}) {
            const recipientId = data?.recipientId;
            const streams = regUserStreams.getStreams(recipientId);
            if (streams.length > 0) {
                for (const one of streams) {
                    const frontUUID = regStreams.mapUUIDStreamToFront(one);
                    if (frontUUID) {
                        const event = esbAdd.createDto();
                        event.meta.frontUUID = frontUUID;
                        event.data.userNick = data.nick;
                        event.data.userId = data.userId;
                        event.data.userPubKey = data.publicKey;
                        portalFront.publish(event);
                    } else {
                        regUserStreams.deleteStream(one);
                    }
                }
            }
        }
    }
}
