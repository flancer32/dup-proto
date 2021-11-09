/**
 * Key manager to generate keys, import/export keys, etc.
 * @TeqFw_Core_Shared_Util.b642ab Fl32_Dup_Front_Model_Key_Manager
 */

// MODULE'S VARS
const ASYM_ALG = 'RSA-OAEP';
const ALG_SIGN = 'RSA-PSS';


// MODULE'S CLASSES
export default class Fl32_Dup_Front_Model_Key_Manager {

    constructor(spec) {
        // EXTRACT DEPS
        /** @type {TeqFw_Core_Shared_Util.ab2hex|function} */
        const ab2hex = spec['TeqFw_Core_Shared_Util.ab2hex'];
        /** @type {TeqFw_Core_Shared_Util.ab2str|function} */
        const ab2str = spec['TeqFw_Core_Shared_Util.ab2str'];
        /** @type {TeqFw_Core_Shared_Util.ab2b64|function} */
        const ab2b64 = spec['TeqFw_Core_Shared_Util.ab2b64'];
        /** @type {TeqFw_Core_Shared_Util.b642ab|function} */
        const b642ab = spec['TeqFw_Core_Shared_Util.b642ab'];

        // DEFINE WORKING VARS / PROPS
        const crypto = self.crypto.subtle;

        // DEFINE INSTANCE METHODS

        /**
         * Convert private key into HEX string using 'pkcs8' format.
         * @param {CryptoKeyPair} keys
         * @return {Promise<string>}
         */
        this.exportKeyPrivate = async function (keys) {
            const buffer = await crypto.exportKey('pkcs8', keys.privateKey);
            return ab2b64(buffer);
        }

        /**
         * Convert public key into HEX string using 'spki' format.
         * @param {CryptoKeyPair} keys
         * @return {Promise<string>}
         */
        this.exportKeyPublic = async function (keys) {
            const buffer = await crypto.exportKey('spki', keys.publicKey);
            return ab2b64(buffer);
        }

        /**
         * Export keys to Base64 strings (private - pkcs8, public - spki).
         * @param {CryptoKeyPair} keys
         * @return {Promise<{privateKey: string, publicKey: string}>}
         */
        this.exportKeys = async function (keys) {
            const bufPriv = await crypto.exportKey('pkcs8', keys.privateKey);
            const privateKey = ab2b64(bufPriv);
            const bufPub = await crypto.exportKey('spki', keys.publicKey);
            const publicKey = ab2b64(bufPub);
            return {privateKey, publicKey};
        }

        /**
         * Generate keys for asymmetric encryption.
         * @return {Promise<CryptoKeyPair>}
         */
        this.generateKeyAsymmetric = async function () {
            return crypto.generateKey(
                {
                    name: ASYM_ALG,
                    modulusLength: 4096,
                    publicExponent: new Uint8Array([1, 0, 1]),
                    hash: 'SHA-256'
                },
                true,
                ['encrypt', 'decrypt', 'wrapKey', 'unwrapKey']
            );
        }

        /**
         * Generate asymmetric keys to sign messages.
         * @return {Promise<CryptoKeyPair>}
         */
        this.generateKeyToSign = async function () {
            return crypto.generateKey(
                {
                    name: ALG_SIGN,
                    modulusLength: 4096,
                    publicExponent: new Uint8Array([1, 0, 1]),
                    hash: 'SHA-256'
                },
                true,
                ['sign', 'verify']
            );
        }

        this.encryptPriv = async function (payload, keyPrivB64) {
            debugger
            const ab = b642ab(keyPrivB64);
            const keyPair = await crypto.importKey(
                "pkcs8",
                ab,
                {
                    name: ASYM_ALG,
                    hash: "SHA-256",
                },
                false,
                ["encrypt"]
            );
            debugger
            return 'not yet';
        }
        this.encryptPub = async function (payload, keyPublic) {

            let keyPair = await window.crypto.subtle.generateKey(
                {
                    name: ASYM_ALG,
                    modulusLength: 4096,
                    publicExponent: new Uint8Array([1, 0, 1]),
                    hash: "SHA-256"
                },
                true,
                ["encrypt", "decrypt"]
            );
            const publicKey = await keyPair.publicKey;
            const privateKey = await keyPair.privateKey;

            const enc = new TextEncoder();
            const buffer = enc.encode(payload);
            const encrypted = await window.crypto.subtle.encrypt(
                {
                    name: ASYM_ALG
                },
                publicKey,
                buffer
            );
            const hex = ab2hex(encrypted);

            function ab2str(buf) {
                return String.fromCharCode.apply(null, new Uint8Array(buf));
            }

            const decrypted = await window.crypto.subtle.decrypt(
                {
                    name: "RSA-OAEP"
                },
                privateKey,
                encrypted
            );
            const boo = ab2str(decrypted);
            return boo;
        }
    }

}
