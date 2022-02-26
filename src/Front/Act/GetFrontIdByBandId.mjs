/**
 * Get front backend ID (RDB) by band local ID (IDB).
 *
 * @namespace Fl32_Dup_Front_Act_GetFrontIdByBandId
 */
// MODULE'S VARS
const NS = 'Fl32_Dup_Front_Act_GetFrontIdByBandId';

// MODULE'S FUNCTIONS
export default function (spec) {
    // DEPS
    /** @type {TeqFw_Web_Front_App_Store_IDB} */
    const idb = spec['Fl32_Dup_Front_Store_Db$'];
    /** @type {Fl32_Dup_Front_Store_Entity_Band} */
    const idbBand = spec['Fl32_Dup_Front_Store_Entity_Band$'];
    /** @type {Fl32_Dup_Front_Store_Entity_Contact} */
    const idbContact = spec['Fl32_Dup_Front_Store_Entity_Contact$'];

    // FUNCS
    /**
     * @param {IDBTransaction} trx read transaction for 'Band' & 'Contact' entities
     * @param {number|string} bandId
     * @return {Promise<{frontBid:number}>} backend ID for front corresponded to given band
     * @memberOf Fl32_Dup_Front_Act_GetFrontIdByBandId
     */
    async function act({trx, bandId}) {
        // MAIN
        let frontBid;
        const norm = Number.parseInt(bandId);
        /** @type {Fl32_Dup_Front_Store_Entity_Band.Dto} */
        const band = await idb.readOne(trx, idbBand, norm);
        if (band?.contactRef) {
            /** @type {Fl32_Dup_Front_Store_Entity_Contact.Dto} */
            const contact = await idb.readOne(trx, idbContact, band.contactRef);
            frontBid = contact?.idOnBack;
        }
        return {frontBid};
    }

    // MAIN
    Object.defineProperty(act, 'name', {value: `${NS}.act`});
    return act;
}
