/**
 * Add new contact card to local store.
 */
export default class Fl32_Dup_Front_Hand_User_Contact_Add {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Core_Shared_Api_ILogger} */
        const logger = spec['TeqFw_Core_Shared_Api_ILogger$$']; // instance
        /** @type {TeqFw_Web_Front_App_Store_IDB} */
        const idb = spec['Fl32_Dup_Front_Store_Db$'];
        /** @type {Fl32_Dup_Front_Store_Entity_Contact} */
        const idbContact = spec['Fl32_Dup_Front_Store_Entity_Contact$'];
        /** @type {TeqFw_Web_Event_Front_Mod_Bus} */
        const eventsFront = spec['TeqFw_Web_Event_Front_Mod_Bus$'];
        /** @type {Fl32_Dup_Shared_Event_Back_User_Contact_Add} */
        const esbContactAdd = spec['Fl32_Dup_Shared_Event_Back_User_Contact_Add$'];
        /** @type {Fl32_Dup_Front_Widget_Home_Conversation} */
        const uiHomeConv = spec['Fl32_Dup_Front_Widget_Home_Conversation$'];

        // VARS
        const I_CONTACT = idbContact.getIndexes();

        // MAIN
        eventsFront.subscribe(esbContactAdd.getEventName(), onEvent);
        logger.setNamespace(this.constructor.name);

        // FUNCS
        /**
         * @param {Fl32_Dup_Shared_Event_Back_User_Contact_Add.Dto} data
         * @param {TeqFw_Web_Event_Shared_Dto_Event_Meta.Dto} meta
         */
        async function onEvent({data, meta}) {
            const card = idbContact.createDto();
            card.keyPub = data.userPubKey;
            card.nick = data.userNick;
            card.idOnBack = data.userId;
            const trx = await idb.startTransaction(idbContact);
            /** @type {Fl32_Dup_Shared_Event_Back_User_Contact_Add.Dto} */
            const found = await idb.readOne(trx, idbContact, data.userId, I_CONTACT.BY_BACK_ID);
            if (!found) {
                await idb.create(trx, idbContact, card);
                logger.info(`New contact is added: ${card.nick} (#${card.idOnBack}).`);
            } else {
                logger.info(`Contact for user ${card.nick} (#${card.idOnBack}) exists in IDB.`)
                if (found.userPubKey !== data.userPubKey) {
                    found.userNick = data.userNick;
                    found.userPubKey = data.userPubKey;
                    await idb.updateOne(trx, idbContact, found);
                    logger.info(`Public key for user ${card.nick} (#${card.idOnBack}) is updated.`)
                }
            }
            await trx.commit();
            // reload home route conversations if new contact is added
            if (!found) {
                const wgHome = uiHomeConv.get();
                wgHome.reload();
            }
        }
    }
}
