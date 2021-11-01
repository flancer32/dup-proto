/**
 * Key manager to generate keys, import/export keys, etc.
 * @namespace Fl32_Dup_Front_Model_Key_Manager
 */

export default class Fl32_Dup_Front_Model_Key_Manager {

    constructor(spec) {
        // EXTRACT DEPS
        /** @type {TeqFw_Core_Shared_Util.buf2hex|function} */
        const buf2hex = spec['TeqFw_Core_Shared_Util.buf2hex'];

        // DEFINE WORKING VARS / PROPS
        const crypto = window.crypto.subtle;

        // DEFINE INSTANCE METHODS

        /**
         * Convert private key into HEX string using 'pkcs8' format.
         * @param {CryptoKeyPair} keys
         * @return {Promise<string>}
         */
        this.exportKeyPrivate = async function (keys) {
            const buffer = await crypto.exportKey('pkcs8', keys.privateKey);
            return buf2hex(buffer);
        }

        /**
         * Convert public key into HEX string using 'raw' format.
         * @param {CryptoKeyPair} keys
         * @return {Promise<string>}
         */
        this.exportKeyPublic = async function (keys) {
            const buffer = await crypto.exportKey('raw', keys.publicKey);
            return buf2hex(buffer);
        }

        /**
         * Generate keys for asymmetric encryption.
         * @return {Promise<CryptoKeyPair>}
         */
        this.generateKeyAsymmetric = async function () {
            return crypto.generateKey(
                {
                    name: "ECDSA",
                    namedCurve: "P-256"
                },
                true,
                ["sign", "verify"]
            );
        }
    }

}
