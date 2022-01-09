/**
 * Backend implementation of crypto key manager.
 * @namespace Fl32_Dup_Back_Mod_Crypto_Key_Manager
 */
// MODULE'S IMPORT
import nacl from 'tweetnacl'; // as CommonJS module
import util from 'tweetnacl-util'; // as CommonJS module

/**
 * @implements Fl32_Dup_Shared_Api_Crypto_Key_IManager
 */
export default class Fl32_Dup_Back_Mod_Crypto_Key_Manager {

    constructor(spec) {
        // EXTRACT DEPS
        /** @type {Fl32_Dup_Back_Defaults} */
        const DEF = spec['Fl32_Dup_Back_Defaults$'];

        this.generateAsyncKeys = async function () {
            const keysBuf = nacl.box.keyPair();
            const secretKey = util.encodeBase64(keysBuf.secretKey);
            const publicKey = util.encodeBase64(keysBuf.publicKey);
            return {secretKey, publicKey};
        }
    }
}
