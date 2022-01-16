/**
 * Get incoming messages from backend and send confirmation back.
 * @implements TeqFw_Core_Shared_Api_Event_IProcess
 */
export default class Fl32_Dup_Front_Proc_Msg_Receive {
    constructor(spec) {
        // EXTRACT DEPS
        /** @type {TeqFw_Web_Front_App_Event_Bus} */
        const eventsFront = spec['TeqFw_Web_Front_App_Event_Bus$'];
        /** @type {Fl32_Dup_Shared_Event_Back_Msg_Receive} */
        const esbReceived = spec['Fl32_Dup_Shared_Event_Back_Msg_Receive$'];
        /** @type {TeqFw_User_Shared_Api_Crypto_IScrambler} */
        const scrambler = spec['TeqFw_User_Shared_Api_Crypto_IScrambler$'];
        /** @type {TeqFw_User_Front_DSource_User} */
        const dsUser = spec['TeqFw_User_Front_DSource_User$'];
        /** @type {TeqFw_Web_Front_Store_IDB} */
        const idb = spec['Fl32_Dup_Front_Store_Db$'];
        /** @type {Fl32_Dup_Front_Store_Entity_Contact_Card} */
        const idbCard = spec['Fl32_Dup_Front_Store_Entity_Contact_Card$'];
        /** @type {Fl32_Dup_Front_Act_Band_Msg_Add.act|function} */
        const actMsgAdd = spec['Fl32_Dup_Front_Act_Band_Msg_Add$'];

        // ENCLOSED VARS

        // MAIN
        eventsFront.subscribe(esbReceived.getEventName(), onReceive);

        // ENCLOSED FUNCTIONS
        /**
         * @param {Fl32_Dup_Shared_Event_Back_Msg_Receive.Dto} data
         * @param {TeqFw_Web_Shared_App_Event_Trans_Message_Meta.Dto} meta
         */
        async function onReceive({data, meta}) {
            // ENCLOSED FUNCTIONS
            async function getPublicKey(userId) {
                const trx = await idb.startTransaction(idbCard, false);
                /** @type {Fl32_Dup_Front_Store_Entity_Contact_Card.Dto} */
                const one = await idb.readOne(trx, idbCard, userId);
                await trx.commit();
                return one?.keyPub;
            }

            // MAIN
            const encrypted = data.message;
            const publicKey = await getPublicKey(data.senderId);
            const user = await dsUser.get();
            scrambler.setKeys(publicKey, user.keys.secret);
            const body = scrambler.decryptAndVerify(encrypted);
            if (body)
                // save message to IDB and push to current band (if required)
                actMsgAdd({
                    authorId: data.senderId,
                    bandId: data.senderId,
                    body,
                    date: new Date(),
                    msgId: meta.uuid,
                });
        }

        // INSTANCE METHODS
        this.init = async function () { }
        this.run = async function ({}) { }
    }
}
