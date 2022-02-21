/**
 * IDB for the application.
 */
// MODULE'S VARS
const NS = 'Fl32_Dup_Front_Store_Db';
const IDB_VERSION = 1;
/**
 * Factory to create connector to application level IDB
 * @param spec
 * @return {TeqFw_Web_Front_App_Store_IDB}
 */
export default function (spec) {
    /** @type {TeqFw_Web_Front_App_Store_IDB} */
    const idb = spec['TeqFw_Web_Front_App_Store_IDB$$']; // new instance
    /** @type {Fl32_Dup_Front_Store_Entity_Band} */
    const idbBand = spec['Fl32_Dup_Front_Store_Entity_Band$'];
    /** @type {Fl32_Dup_Front_Store_Entity_Contact} */
    const idbContact = spec['Fl32_Dup_Front_Store_Entity_Contact$'];
    /** @type {Fl32_Dup_Front_Store_Entity_Msg} */
    const idbMsg = spec['Fl32_Dup_Front_Store_Entity_Msg$'];

    // DEFINE WORKING VARS / PROPS
    const E_BAND = idbBand.getEntityName();
    const E_CONTACT = idbContact.getEntityName();
    const E_MSG = idbMsg.getEntityName();
    const A_BAND = idbBand.getAttributes();
    const A_CONTACT = idbContact.getAttributes();
    const A_MSG = idbMsg.getAttributes();
    const I_BAND = idbBand.getIndexes();
    const I_CONTACT = idbContact.getIndexes();
    const I_MSG = idbMsg.getIndexes();

    // ENCLOSED FUNCS
    /**
     * Factory to pin 'db' in the scope and create function to upgrade DB structure on opening.
     * @param {IDBDatabase} db
     * @return {(function(*): void)|*}
     */
    function fnUpgradeDb(db) {
        const autoIncrement = true;
        const multiEntry = true;
        const unique = true;

        // /band
        if (!db.objectStoreNames.contains(E_BAND)) {
            const store = db.createObjectStore(E_BAND, {keyPath: A_BAND.ID, autoIncrement});
            store.createIndex(I_BAND.BY_CONTACT, A_BAND.CONTACT_REF, {unique});
        }
        // /contact
        if (!db.objectStoreNames.contains(E_CONTACT)) {
            const store = db.createObjectStore(E_CONTACT, {keyPath: A_CONTACT.ID, autoIncrement});
            store.createIndex(I_CONTACT.BY_BACK_ID, A_CONTACT.ID_ON_BACK, {unique});
        }
        // /msg
        if (!db.objectStoreNames.contains(E_MSG)) {
            const store = db.createObjectStore(E_MSG, {keyPath: A_MSG.ID, autoIncrement});
            store.createIndex(I_MSG.BY_UUID, A_MSG.UUID, {unique});
            store.createIndex(I_MSG.BY_BAND, [A_MSG.BAND_REF, A_MSG.DIRECTION, A_MSG.DATE]);
        }
    }

    // MAIN
    idb.init(NS, IDB_VERSION, fnUpgradeDb);

    return idb;
}
