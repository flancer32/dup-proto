import {container, dbConnect} from '@teqfw/test';
import {describe, it} from 'mocha';
import assert from 'assert';

// get runtime objects from DI
/** @type {Fl32_Dup_Back_Act_Msg_Queue_User_Remove.act|function} */
const act = await container.get('Fl32_Dup_Back_Act_Msg_Queue_User_Remove$');


describe('Fl32_Dup_Back_Act_Msg_Queue_User_Remove', function () {

    it('can create action', async () => {
        console.assert(typeof act === 'function');
    });

    it('action works', async () => {
        /** @type {TeqFw_Db_Back_RDb_IConnect} */
        const conn = await dbConnect();
        let res;
        /** @type {TeqFw_Db_Back_RDb_ITrans} */
        const trx = await conn.startTransaction();
        try {
            res = await act({
                trx,
                messageId: 1,
                recipientId: 3,
            });
            await trx.commit();
        } catch (e) {
            await trx.rollback();
        }
        await conn.disconnect();
        assert(typeof res?.success === 'boolean');
    });

});

