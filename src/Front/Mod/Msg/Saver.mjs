/**
 * Model to save messages to IDB.
 */
export default class Fl32_Dup_Front_Mod_Msg_Saver {
    constructor(spec) {
        // EXTRACT DEPS
        /** @type {TeqFw_Web_Front_Store_IDB} */
        const idb = spec['Fl32_Dup_Front_Store_Db$'];
        /** @type {Fl32_Dup_Front_Store_Entity_Band} */
        const idbBand = spec['Fl32_Dup_Front_Store_Entity_Band$'];
        /** @type {Fl32_Dup_Front_Store_Entity_Contact_Card} */
        const idbContact = spec['Fl32_Dup_Front_Store_Entity_Contact_Card$'];
        /** @type {Fl32_Dup_Front_Store_Entity_Msg_Base} */
        const idbMsgBase = spec['Fl32_Dup_Front_Store_Entity_Msg_Base$'];
        /** @type {Fl32_Dup_Front_Store_Dto_Msg_Pers_Out} */
        const dtoPersOut = spec['Fl32_Dup_Front_Store_Dto_Msg_Pers_Out$'];
        /** @type {Fl32_Dup_Front_Store_Dto_Msg_Pers_In} */
        const dtoPersIn = spec['Fl32_Dup_Front_Store_Dto_Msg_Pers_In$'];
        /** @type {typeof Fl32_Dup_Front_Enum_Msg_Type} */
        const TYPE = spec['Fl32_Dup_Front_Enum_Msg_Type$'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castDate|function} */
        const castDate = spec['TeqFw_Core_Shared_Util_Cast.castDate'];

        // ENCLOSED VARS
        const I_BAND = idbBand.getIndexes();
        const I_CONTACT = idbContact.getIndexes();

        // MAIN

        // ENCLOSED FUNCTIONS
        // ENCLOSED FUNCTIONS

        async function _getBandId(trx, userId) {
            let res;
            const contact = await getContactByUserId(trx, userId);
            const contactId = contact?.id; // local ID
            const bandSaved = await getBandByContactRef(trx, contactId);
            if (bandSaved) res = bandSaved.id;
            else {
                // we need to create new band object
                const dto = idbBand.createDto();
                dto.contactRef = contactId;
                res = await idb.add(trx, idbBand, dto);
            }
            return res;
        }

        /**
         * Lookup for message band by contact's local id.
         * @param {IDBTransaction} trx
         * @param {number} contactId
         * @return {Promise<Fl32_Dup_Front_Store_Entity_Band.Dto|null>}
         */
        async function getBandByContactRef(trx, contactId) {
            return await idb.readOne(trx, idbBand, contactId, I_BAND.BY_CONTACT);
        }

        /**
         * Lookup for contact by user backend id.
         * @param {IDBTransaction} trx
         * @param {number} userId
         * @return {Promise<Fl32_Dup_Front_Store_Entity_Band.Dto|null>}
         */
        async function getContactByUserId(trx, userId) {
            /** @type {Fl32_Dup_Front_Store_Entity_Contact_Card.Dto} */
            return await idb.readOne(trx, idbContact, userId, I_CONTACT.BY_USER);
        }

        // INSTANCE METHODS
        /**
         * Save personal incoming message to IDB.
         * @param {string} uuid
         * @param {string} body
         * @param {number} senderId local ID for contact card of the sender
         * @param {Date} dateSent
         * @return {Promise<{id: number}>}
         */
        this.savePersonalIn = async function ({uuid, body, senderId, dateSent}) {
            const trx = await idb.startTransaction([idbBand, idbContact, idbMsgBase]);
            const bandId = await _getBandId(trx, senderId);
            const dto = dtoPersIn.createDto();
            dto.bandRef = bandId;
            dto.body = body;
            dto.date = new Date();
            dto.dateSent = castDate(dateSent);
            dto.senderId = senderId;
            dto.type = TYPE.PERS_IN;
            dto.uuid = uuid;
            const id = await idb.add(trx, idbMsgBase, dto);
            await trx.commit();
            return {id};
        }

        /**
         * Save personal outgoing message to IDB.
         * @param {string} uuid
         * @param {string} body
         * @param {number} recipientId local ID for contact card of the recipient
         * @return {Promise<{id: number}>}
         */
        this.savePersonalOut = async function ({uuid, body, recipientId}) {
            const trx = await idb.startTransaction([idbBand, idbContact, idbMsgBase]);
            const bandId = await _getBandId(trx, recipientId);
            const dto = dtoPersOut.createDto();
            dto.bandRef = bandId;
            dto.body = body;
            dto.date = new Date();
            dto.recipientId = recipientId;
            dto.type = TYPE.PERS_OUT;
            dto.uuid = uuid;
            const id = await idb.add(trx, idbMsgBase, dto);
            await trx.commit();
            return {id};
        }
    }
}
