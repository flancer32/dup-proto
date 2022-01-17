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
    const idbContactCard = spec['Fl32_Dup_Front_Store_Entity_Contact_Card$'];
    /** @type {Fl32_Dup_Front_Store_Entity_Msg} */
    const idbMsg = spec['Fl32_Dup_Front_Store_Entity_Msg$'];
    /** @type {Fl32_Dup_Front_Store_Entity_Msg_Band_User} */
    const idbMsgBandUser = spec['Fl32_Dup_Front_Store_Entity_Msg_Band_User$'];

    // DEFINE WORKING VARS / PROPS
    const E_CONTACT_CARD = idbContactCard.getEntityName();
    const E_MSG = idbMsg.getEntityName();
    const E_MSG_BAND_USER = idbMsgBandUser.getEntityName();
    const A_CONTACT_CARD = idbContactCard.getAttributes();
    const A_MSG = idbMsg.getAttributes();
    const A_MSG_BAND_USER = idbMsgBandUser.getAttributes();

    // DEFINE INNER FUNCTIONS
    /**
     * Factory to pin 'db' in the scope and create function to upgrade DB structure on opening.
     * @param {IDBDatabase} db
     * @return {(function(*): void)|*}
     */
    function fnUpgradeDb(db) {
        if (!db.objectStoreNames.contains(E_CONTACT_CARD))
            db.createObjectStore(E_CONTACT_CARD, {keyPath: A_CONTACT_CARD.USER_ID});
        if (!db.objectStoreNames.contains(E_MSG)) {
            const store = db.createObjectStore(E_MSG, {keyPath: A_MSG.UUID});
            store.createIndex(A_MSG.BAND_ID, A_MSG.BAND_ID);
        }
        if (!db.objectStoreNames.contains(E_MSG_BAND_USER))
            db.createObjectStore(E_MSG_BAND_USER, {keyPath: A_MSG_BAND_USER.USER_ID});
    }

    // MAIN FUNCTIONALITY
    idb.init(NS, IDB_VERSION, fnUpgradeDb);

    return idb;
}
