/**
 * Factory to load NaCL libraries for backend area and to create related objects.
 *
 * TODO: tmp solution until DI replacement will be fixed (back & front areas).
 */
// MODULE'S IMPORT
import nacl from 'tweetnacl'; // as CommonJS module
import util from 'tweetnacl-util'; // as CommonJS module

export default class Fl32_Dup_Back_Factory_Crypto {

    constructor(spec) {
        // EXTRACT DEPS
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
