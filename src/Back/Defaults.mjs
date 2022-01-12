/**
 * Plugin constants (hardcoded configuration) for backend code.
 */
export default class Fl32_Dup_Back_Defaults {
    CLI_PREFIX = 'app';
    /**
     * @deprecated use TeqFw_User_Back_Defaults.FILE_CRYPTO_KEYS
     * @type {string}
     */
    FILE_CRYPTO_KEYS = './cfg/local.crypto.keys.json';
    /** @type {Fl32_Dup_Shared_Defaults} */
    SHARED;

    constructor(spec) {
        this.SHARED = spec['Fl32_Dup_Shared_Defaults$'];
        Object.freeze(this);
    }
}
