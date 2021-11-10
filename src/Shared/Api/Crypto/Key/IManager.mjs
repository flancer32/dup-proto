/**
 * Interface for cryptographic keys manager.
 *
 * There are different cryptographic libraries and algorithms, so this interface define
 * base principles for crypto keys usage in the app (both for back & front).
 *
 * @namespace Fl32_Dup_Shared_Api_Crypto_Key_IManager
 */

/**
 * Interface for cryptographic keys manager.
 *
 * @interface
 */
export default class Fl32_Dup_Shared_Api_Crypto_Key_IManager {

    /**
     * Generate keys pair for asynchronous encryption.
     * Both keys in result  are base64 encoded strings.
     * @return {Promise<{secretKey: string, publicKey: string}>}
     */
    async generateAsyncKeys() {
        return {
            secretKey: '',
            publicKey: ''
        };
    }

}
