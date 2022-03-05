/**
 * Model to collect data for homepage widget conversations.
 */
export default class Fl32_Dup_Front_Mod_Home_Conversations {
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
        /** @type {Fl32_Dup_Front_Dto_Home_Conversation} */
        const dtoConv = spec['Fl32_Dup_Front_Dto_Home_Conversation$'];

        // VARS
        const I_BAND = idbBand.getIndexes();
        const I_MSG = idbMsg.getIndexes();

        // INSTANCE METHODS
        /**
         * Load bands list and the last messages for the bands then order by date desc.
         * @return {Promise<*[]>}
         */
        this.load = async function () {
            const res = [];
            const trx = await idb.startTransaction([idbBand, idbContact, idbMsg]);

            // read all contacts from IDB
            /** @type {Fl32_Dup_Front_Store_Entity_Contact.Dto[]} */
            const contacts = await idb.readSet(trx, idbContact);
            for (const contact of contacts) {
                const dto = dtoConv.createDto();
                dto.contactId = contact.id;
                dto.name = contact.nick;
                dto.time = contact.date;
                dto.unread = 0;
                // get related band
                /** @type {Fl32_Dup_Front_Store_Entity_Band.Dto} */
                const band = await idb.readOne(trx, idbBand, contact.id, I_BAND.BY_CONTACT);
                if (band) {
                    dto.bandId = band.id;
                    // get the last incoming message
                    const index = I_MSG.BY_BAND;
                    const backward = true;
                    const limit = 1;
                    const query = IDBKeyRange.bound([band.id, new Date(0)], [band.id, new Date()]);
                    const keys = await idb.readKeys(trx, idbMsg, {index, query, backward, limit});
                    if (keys[0]) {
                        /** @type {Fl32_Dup_Front_Store_Entity_Msg.Dto} */
                        const msg = await idb.readOne(trx, idbMsg, keys[0], I_MSG.BY_BAND);
                        dto.message = msg.body;
                        dto.time = msg.date;
                        dto.unread = msg.unread;
                    }
                } else {
                    // create new band
                    const dtoBand = idbBand.createDto();
                    dtoBand.contactRef = contact.id;
                    dto.bandId = await idb.create(trx, idbBand, dtoBand);
                }
                res.push(dto);
            }

            trx.commit();
            // order result by date desc
            res.sort((a, b) => b.time - a.time);
            return res;
        }
    }
}
