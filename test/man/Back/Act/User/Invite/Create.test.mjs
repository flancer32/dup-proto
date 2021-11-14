import {container, dbConnect} from '@teqfw/test';
import {describe, it} from 'mocha';

// get runtime objects from DI
/** @type {Fl32_Dup_Back_Act_User_Invite_Create.act|function} */
const act = await container.get('Fl32_Dup_Back_Act_User_Invite_Create$');


describe('Fl32_Dup_Back_Act_User_Invite_Create', function () {

    it('can create action', async () => {
        console.assert(typeof act === 'function');
    });

    it('action works', async () => {
        /** @type {TeqFw_Db_Back_RDb_IConnect} */
        const conn = await dbConnect();
        /** @type {TeqFw_Db_Back_RDb_ITrans} */
        const trx = await conn.startTransaction();
        await act({
            trx,
            userId: 1,
            onetime: true,
            dateExpired: new Date()
        });
        await trx.commit();
        await conn.disconnect();
    });

});

