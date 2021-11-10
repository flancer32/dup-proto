/**
 * Key manager to generate keys, import/export keys, etc.
 * @namespace Fl32_Dup_Front_Model_Crypto_Key_Manager
 */

/**
 * @implements Fl32_Dup_Shared_Api_Crypto_Key_IManager
 */
export default class Fl32_Dup_Front_Model_Crypto_Key_Manager {
    constructor(spec) {
        // EXTRACT DEPS
        const {box} = spec['Fl32_Dup_Front_Lib_Nacl'];
        const {decodeBase64, encodeBase64} = spec['Fl32_Dup_Front_Lib_Nacl_Util'];

        // DEFINE INSTANCE METHODS

        this.generateAsyncKeys = async function () {
            const keysBuf = box.keyPair();
            const secretKey = encodeBase64(keysBuf.secretKey);
            const publicKey = encodeBase64(keysBuf.publicKey);
            return {secretKey, publicKey};
        }

        this.generateSyncKey = async function () {}
    }
}
