import {config, container, dbConnect} from '@teqfw/test';
import {describe, it} from 'mocha';

// get runtime objects from DI
/** @type {TeqFw_Core_Back_Config} */
const appConfig = await container.get('TeqFw_Core_Back_Config$');
appConfig.setBoot(config.pathToRoot, 'test');
appConfig.loadLocal(config.pathToRoot);
/** @type {Fl32_Dup_Back_Act_Push_Send.act|function} */
const act = await container.get('Fl32_Dup_Back_Act_Push_Send$');

describe('Fl32_Dup_Back_Act_Push_Send', function () {

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
            body: 'message from user #64.',
        });
        await trx.commit();
        await conn.disconnect();
    });

});

