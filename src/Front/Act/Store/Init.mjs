/**
 * Action to (re)initialize IDB structure
 * @namespace Fl32_Dup_Front_Act_Store_Init
 */
// MODULE'S VARS
const NS = 'Fl32_Dup_Front_Act_Store_Init';


export default function (spec) {
    /** @type {Fl32_Dup_Front_Defaults} */
    const DEF = spec['Fl32_Dup_Front_Defaults$'];
    /** @type {TeqFw_Web_Front_Store_IDB} */
    const db = spec['Fl32_Dup_Front_Store_Db$'];
    /** @type {Fl32_Dup_Front_Store_Entity_Contact_Card} */
    const metaContact = spec['Fl32_Dup_Front_Store_Entity_Contact_Card$'];

    /**
     *
     * @return {Promise<void>}
     * @memberOf Fl32_Dup_Front_Act_Store_Init
     */
    async function act() {
        await db.dropDb();
        /** @type {IDBTransaction} */
        const trx = await db.startTransaction(metaContact);
        try {
            const duplo = metaContact.createDto();
            duplo.nick = DEF.SHARED.DATA_DUPLO_NICK;
            duplo.userId = DEF.SHARED.DATA_DUPLO_USER_ID;
            await db.add(trx, metaContact, duplo);
        } catch (e) {
            console.log(e);
            trx.abort();
        }
    }

    Object.defineProperty(act, 'name', {value: `${NS}.act`});
    return act;
}
