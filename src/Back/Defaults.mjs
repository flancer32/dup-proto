/**
 * Plugin constants (hardcoded configuration) for backend code.
 */
export default class Fl32_Dup_Back_Defaults {
    CLI_PREFIX = 'app';

    /** @type {TeqFw_User_Back_Defaults} */
    MOD_USER;

    /** @type {Fl32_Dup_Shared_Defaults} */
    SHARED;

    constructor(spec) {
        this.SHARED = spec['Fl32_Dup_Shared_Defaults$'];
        this.MOD_USER = spec['TeqFw_User_Back_Defaults$'];
        Object.freeze(this);
    }
}
