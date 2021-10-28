/**
 * Plugin constants (hardcoded configuration) for frontend code.
 */
export default class Fl32_Dup_Front_Defaults {
    /** @type {Fl32_Dup_Shared_Defaults} */
    SHARED;

    constructor(spec) {
        this.SHARED = spec['Fl32_Dup_Shared_Defaults$'];
        Object.freeze(this);
    }
}
