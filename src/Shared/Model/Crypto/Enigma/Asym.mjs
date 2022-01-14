/**
 * Object to encrypt and decrypt messages using public and secret keys (asymmetric cipher).
 *
 * Each object has own pair of keys and should be used as instance rather than singleton.
 *
 * @namespace Fl32_Dup_Shared_Model_Crypto_Enigma_Asym
 * @deprecated use TeqFw_User_Shared_Api_Crypto_IScrambler
 */

export default class Fl32_Dup_Shared_Model_Crypto_Enigma_Asym {
    /** @type {Uint8Array} */
    #keyShared;
    #nacl;
    #util;

    constructor(spec) {
        // EXTRACT DEPS
        this.#nacl = spec['Fl32_Dup_Shared_Lib_Nacl'];
        this.#util = spec['Fl32_Dup_Shared_Lib_Nacl_Util'];

        // DEFINE WORKING VARS / PROPS
        // DEFINE INNER FUNCTIONS
        // DEFINE INSTANCE METHODS
    }

    /**
     * Decrypt data using own secret key and verify data using 'their' public key.
     * @param data
     * @return {{}|null}
     */
    decryptAndVerify(data) {
        let res = null;
        const messageWithNonceAsUint8Array = this.#util.decodeBase64(data);
        const nonce = messageWithNonceAsUint8Array.slice(0, this.#nacl.box.nonceLength);
        const message = messageWithNonceAsUint8Array.slice(
            this.#nacl.box.nonceLength,
            data.length
        );
        const decryptedAb = this.#nacl.box.open.after(message, nonce, this.#keyShared);
        if (decryptedAb) {
            const jsonStr = this.#util.encodeUTF8(decryptedAb);
            res = JSON.parse(jsonStr);
        }
        return res;
    }

    /**
     * Encrypt payload with public key and sign with secret.
     * @param {*} payload
     * @return {string} base64 encoded result
     */
    encryptAndSign(payload) {
        const messageUint8 = this.#util.decodeUTF8(JSON.stringify(payload));
        const nonce = this.#nacl.randomBytes(this.#nacl.box.nonceLength);
        const encrypted = this.#nacl.box.after(messageUint8, nonce, this.#keyShared);
        const fullMessage = new Uint8Array(nonce.length + encrypted.length);
        fullMessage.set(nonce);
        fullMessage.set(encrypted, nonce.length);
        return this.#util.encodeBase64(fullMessage);
    }

    /**
     * Set public and secret keys to encrypt/decrypt messages.
     * @param {string} pub base64 encoded public key (their)
     * @param {string} sec base64 encoded secret key (own)
     */
    setKeys(pub, sec) {
        const abPub = this.#util.decodeBase64(pub);
        const abSec = this.#util.decodeBase64(sec);
        this.#keyShared = this.#nacl.box.before(abPub, abSec);
    }
}
