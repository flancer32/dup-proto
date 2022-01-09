/**
 * Manual tests for Key Manager.
 */
import {container} from '@teqfw/test';
import {describe, it} from 'mocha';
import assert from 'assert';

// get runtime objects from DI
/** @type {Fl32_Dup_Back_Mod_Crypto_Key_Manager} */
const manager = await container.get('Fl32_Dup_Back_Mod_Crypto_Key_Manager$');


describe('Fl32_Dup_Back_Mod_Crypto_Key_Manager', function () {

    it('can create asymmetric keys', async () => {
        const res = await manager.generateAsyncKeys();
        assert(typeof res.publicKey === "string");
        assert(typeof res.secretKey === "string");
    });

});

