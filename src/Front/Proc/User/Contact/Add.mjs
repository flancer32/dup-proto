/**
 * Add new contact card to local store.
 *
 * @namespace Fl32_Dup_Front_Proc_User_Contact_Add
 * @implements TeqFw_Core_Shared_Api_Event_IProcess
 */
export default class Fl32_Dup_Front_Proc_User_Contact_Add {
    constructor(spec) {
        // EXTRACT DEPS
        /** @type {TeqFw_Core_Shared_Logger} */
        const logger = spec['TeqFw_Core_Shared_Logger$'];
        /** @type {TeqFw_Web_Front_Store_IDB} */
        const idb = spec['Fl32_Dup_Front_Store_Db$'];
        /** @type {Fl32_Dup_Front_Store_Entity_Contact_Card} */
        const idbContact = spec['Fl32_Dup_Front_Store_Entity_Contact_Card$'];
        /** @type {TeqFw_Web_Front_App_Event_Bus} */
        const eventsFront = spec['TeqFw_Web_Front_App_Event_Bus$'];
        /** @type {Fl32_Dup_Shared_Event_Back_User_Contact_Add} */
        const esbContactAdd = spec['Fl32_Dup_Shared_Event_Back_User_Contact_Add$'];

        // MAIN
        eventsFront.subscribe(esbContactAdd.getEventName(), onContactAdd);

        // ENCLOSED FUNCTIONS
        /**
         * @param {Fl32_Dup_Shared_Event_Back_User_Contact_Add.Dto} data
         * @param {TeqFw_Web_Shared_App_Event_Trans_Message_Meta.Dto} meta
         */
        async function onContactAdd({data, meta}) {
            const card = idbContact.createDto();
            card.keyPub = data.userPubKey;
            card.nick = data.userNick;
            card.userId = data.userId;
            const trx = await idb.startTransaction(idbContact);
            await idb.add(trx, idbContact, card);
            await trx.commit();
            logger.info(`New contact is added: ${card.nick} (#${card.userId}).`);
        }

        // INSTANCE METHODS
        this.init = async function () { }

        this.run = async function ({}) { }
    }
}
