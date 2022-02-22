/**
 * Model to save messages to IDB.
 */
export default class Fl32_Dup_Front_Mod_Msg_Saver {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Web_Front_App_Store_IDB} */
        const idb = spec['Fl32_Dup_Front_Store_Db$'];
        /** @type {Fl32_Dup_Front_Store_Entity_Band} */
        const idbBand = spec['Fl32_Dup_Front_Store_Entity_Band$'];
        /** @type {Fl32_Dup_Front_Store_Entity_Contact} */
        const idbContact = spec['Fl32_Dup_Front_Store_Entity_Contact$'];
        /** @type {Fl32_Dup_Front_Store_Entity_Msg} */
        const idbMsg = spec['Fl32_Dup_Front_Store_Entity_Msg$'];
        /** @type {Fl32_Dup_Front_Store_Dto_Msg_Pers_Out} */
        const dtoPersOut = spec['Fl32_Dup_Front_Store_Dto_Msg_Pers_Out$'];
        /** @type {Fl32_Dup_Front_Store_Dto_Msg_Pers_In} */
        const dtoPersIn = spec['Fl32_Dup_Front_Store_Dto_Msg_Pers_In$'];
        /** @type {typeof Fl32_Dup_Front_Enum_Msg_Direction} */
        const DIR = spec['Fl32_Dup_Front_Enum_Msg_Direction$'];
        /** @type {typeof Fl32_Dup_Front_Enum_Msg_State} */
        const STATE = spec['Fl32_Dup_Front_Enum_Msg_State$'];
        /** @type {typeof Fl32_Dup_Front_Enum_Msg_Type} */
        const TYPE = spec['Fl32_Dup_Front_Enum_Msg_Type$'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castDate|function} */
        const castDate = spec['TeqFw_Core_Shared_Util_Cast.castDate'];

        // ENCLOSED VARS
        const I_BAND = idbBand.getIndexes();
        const I_CONTACT = idbContact.getIndexes();

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
                res = await idb.create(trx, idbBand, dto);
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
            /** @type {Fl32_Dup_Front_Store_Entity_Contact.Dto} */
            return await idb.readOne(trx, idbContact, userId, I_CONTACT.BY_BACK_ID);
        }

        // INSTANCE METHODS
        /**
         * Save personal incoming message to IDB.
         * @param {string} uuid
         * @param {string} body
         * @param {number} senderId local ID for contact card of the sender
         * @param {Date} dateSent
         * @return {Promise<{id:number, bandId:number, date:Date}>}
         */
        this.savePersonalIn = async function ({uuid, body, senderId, dateSent}) {
            const trx = await idb.startTransaction([idbBand, idbContact, idbMsg]);
            const bandId = await _getBandId(trx, senderId);
            const date = new Date();
            const entity = dtoPersIn.createDto();
            entity.bandRef = bandId;
            entity.body = body;
            entity.date = date;
            entity.dateSent = castDate(dateSent);
            entity.direction = DIR.IN;
            entity.senderId = senderId;
            entity.state = STATE.NOT_SENT;
            entity.type = TYPE.PERS;
            entity.uuid = uuid;
            const id = await idb.create(trx, idbMsg, entity);
            await trx.commit();
            return {id, bandId, date};
        }

        /**
         * Save personal outgoing message to IDB.
         * @param {string} uuid
         * @param {string} body
         * @param {number|string} bandId local ID for contact card of the recipient
         * @return {Promise<{id: number, date: Date}>}
         */
        this.savePersonalOut = async function ({uuid, body, bandId}) {
            const trx = await idb.startTransaction([idbMsg]);
            const entity = dtoPersOut.createDto();
            entity.bandRef = Number.parseInt(bandId);
            entity.body = body;
            entity.date = new Date();
            entity.direction = DIR.OUT;
            entity.state = STATE.NOT_SENT;
            entity.type = TYPE.PERS;
            entity.uuid = uuid;
            const id = await idb.create(trx, idbMsg, entity);
            await trx.commit();
            return {id, date: entity.date};
        }
    }
}
