/**
 * Plugin constants (hardcoded configuration) for backend code.
 */
export default class Fl32_Dup_Back_Defaults {
    CLI_PREFIX = 'app';

    FILE_VAPID_KEYS = './cfg/local.vapid.key';

    /** @type {Fl32_Dup_Shared_Defaults} */
    SHARED;

    constructor(spec) {
        this.SHARED = spec['Fl32_Dup_Shared_Defaults$'];
        Object.freeze(this);
    }
}
