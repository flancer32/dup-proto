/**
 * Factory to load NaCL libraries for frontend area and to create related objects.
 *
 * TODO: tmp solution until DI replacement will be fixed (back & front areas).
 */
export default class Fl32_Dup_Front_Factory_Crypto {

    constructor(spec) {
        // EXTRACT DEPS
        /** @type {Fl32_Dup_Front_Lib_Nacl} */
        const nacl = spec['Fl32_Dup_Front_Lib_Nacl'];
        /** @type {Fl32_Dup_Front_Lib_Nacl} */
        const util = spec['Fl32_Dup_Front_Lib_Nacl_Util'];
        /** @type {typeof Fl32_Dup_Shared_Model_Crypto_Enigma_Asym} */
        const EnigmaAsym = spec['Fl32_Dup_Shared_Model_Crypto_Enigma_Asym#'];

        // DEFINE WORKING VARS / PROPS
        // DEFINE INNER FUNCTIONS
        // DEFINE INSTANCE METHODS

        this.createEnigmaAsym = async function () {
            return new EnigmaAsym({
                ['Fl32_Dup_Shared_Lib_Nacl']: nacl,
                ['Fl32_Dup_Shared_Lib_Nacl_Util']: util
            });
        }

        this.createKeyManager = async function () {}
    }
}
