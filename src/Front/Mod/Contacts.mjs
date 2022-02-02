/**
 * Model to represent contacts book in the app.
 */
export default class Fl32_Dup_Front_Mod_Contacts {
    constructor(spec) {
        // EXTRACT DEPS
        /** @type {TeqFw_Web_Front_App_Logger} */
        const logger = spec['TeqFw_Web_Front_App_Logger$'];
        /** @type {TeqFw_Web_Front_App_Store_IDB} */
        const idb = spec['Fl32_Dup_Front_Store_Db$'];
        /** @type {Fl32_Dup_Front_Store_Entity_Contact_Card} */
        const idbCard = spec['Fl32_Dup_Front_Store_Entity_Contact_Card$'];

        // ENCLOSED VARS
        const I_CONTACT = idbCard.getIndexes();

        // MAIN

        // ENCLOSED FUNCTIONS

        // INSTANCE METHODS
        /**
         * Add new contact card to IDB if this user not added yet.
         * @param {number} userId backend ID for the added user
         * @param {string} nick own nickname of the added user
         * @param {string} publicKey public key for asymmetric encryption
         * @return {Promise<{contactId: number, alreadyExists: boolean}>}
         */
        this.add = async function ({userId, nick, publicKey}) {
            let alreadyExists = false, contactId;
            const dto = idbCard.createDto();
            dto.userId = userId;
            dto.nick = nick;
            dto.keyPub = publicKey;
            const trx = await idb.startTransaction(idbCard);
            /** @type {Fl32_Dup_Front_Store_Entity_Contact_Card.Dto} */
            const found = await idb.readOne(trx, idbCard, userId, I_CONTACT.BY_USER);
            if (!found) {
                const res = await idb.create(trx, idbCard, dto);
                await trx.commit();
                logger.info(`Contact card for parent #${userId} is added on new user registration.`)
                contactId = res;
            } else {
                await trx.commit();
                logger.info(`Contact card for parent #${userId} is already added before.`)
                alreadyExists = true;
                contactId = found.id;
            }
            return {contactId, alreadyExists}
        }
    }
}
