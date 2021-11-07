/**
 * IDB for the application.
 */
// MODULE'S VARS
const NS = 'Fl32_Dup_Front_Store_Db';
const IDB_VERSION = 1;
/**
 * Factory to create connector to application level IDB
 * @param spec
 * @return {TeqFw_Web_Front_Store_IDB}
 */
export default function (spec) {
    /** @type {TeqFw_Web_Front_Store_IDB} */
    const idb = spec['TeqFw_Web_Front_Store_IDB$$']; // new instance
    /** @type {Fl32_Dup_Front_Store_Entity_Contact_Card} */
    const metaContactCard = spec['Fl32_Dup_Front_Store_Entity_Contact_Card$'];
    /** @type {Fl32_Dup_Front_Store_Entity_Msg} */
    const metaMsg = spec['Fl32_Dup_Front_Store_Entity_Msg$'];
    /** @type {Fl32_Dup_Front_Store_Entity_Msg_Band} */
    const metaMsgBand = spec['Fl32_Dup_Front_Store_Entity_Msg_Band$'];

    // DEFINE WORKING VARS / PROPS
    const E_CONTACT_CARD = metaContactCard.getEntityName();
    const E_MSG = metaMsg.getEntityName();
    const E_MSG_BAND = metaMsgBand.getEntityName();
    const A_CONTACT_CARD = metaContactCard.getAttributes();
    const A_MSG = metaMsg.getAttributes();
    const A_MSG_BAND = metaMsgBand.getAttributes();

    // DEFINE INNER FUNCTIONS
    /**
     * Factory to pin 'db' in the scope and create function to upgrade DB structure on opening.
     * @param {IDBDatabase} db
     * @return {(function(*): void)|*}
     */
    function fnUpgradeDb(db) {
        if (!db.objectStoreNames.contains(E_CONTACT_CARD)) {
            db.createObjectStore(E_CONTACT_CARD, {keyPath: A_CONTACT_CARD.ID, autoIncrement: true});
        }
        if (!db.objectStoreNames.contains(E_MSG)) {
            db.createObjectStore(E_MSG, {keyPath: A_MSG.ID, autoIncrement: true});
        }
        if (!db.objectStoreNames.contains(E_MSG_BAND)) {
            db.createObjectStore(E_MSG_BAND, {keyPath: A_MSG_BAND.ID, autoIncrement: true});
        }
    }

    // MAIN FUNCTIONALITY
    idb.init(NS, IDB_VERSION, fnUpgradeDb);

    return idb;
}
