/**
 * Clean up IDB on authentication failure.
 *
 * @namespace Fl32_Dup_Front_Proc_User_Authentication
 * @implements TeqFw_Core_Shared_Api_Event_IProcess
 */
export default class Fl32_Dup_Front_Proc_User_Authentication {
    constructor(spec) {
        // EXTRACT DEPS
        /** @type {TeqFw_Core_Shared_Logger} */
        const logger = spec['TeqFw_Core_Shared_Logger$'];
        /** @type {TeqFw_Web_Front_App_Event_Bus} */
        const eventsFront = spec['TeqFw_Web_Front_App_Event_Bus$'];
        /** @type {TeqFw_User_Shared_Event_Back_Authentication_Failure} */
        const esbFailure = spec['TeqFw_User_Shared_Event_Back_Authentication_Failure$'];
        /** @type {Fl32_Dup_Front_DSource_Hollow_IsFree} */
        const dsHollow = spec['Fl32_Dup_Front_DSource_Hollow_IsFree$'];
        /** @type {Fl32_Dup_Front_DSource_User_Profile} */
        const dsProfile = spec['Fl32_Dup_Front_DSource_User_Profile$'];
        /** @type {TeqFw_User_Front_DSource_Server_Key} */
        const dsServerKey = spec['TeqFw_User_Front_DSource_Server_Key$'];
        /** @type {TeqFw_Web_Push_Front_DSource_Subscription} */
        const dsSubscribe = spec['TeqFw_Web_Push_Front_DSource_Subscription$'];
        /** @type {TeqFw_User_Front_DSource_User} */
        const dsUser = spec['TeqFw_User_Front_DSource_User$'];

        // MAIN
        eventsFront.subscribe(esbFailure.getEventName(), onFailure);

        // ENCLOSED FUNCTIONS
        /**
         * Clean up data sources in IDB.
         * @param {TeqFw_User_Shared_Event_Back_Authentication_Failure.Dto} data
         * @param {TeqFw_Web_Shared_App_Event_Trans_Message_Meta.Dto} meta
         */
        async function onFailure({data, meta}) {
            await dsHollow.clean();
            await dsProfile.clean();
            await dsServerKey.clean();
            await dsSubscribe.clean();
            await dsUser.clean();
            logger.info(`IDB is cleaned up on authentication failure event.`);
        }

        // INSTANCE METHODS
        this.init = async function () { }

        this.run = async function ({}) { }
    }
}
