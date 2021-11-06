/**
 * Plugin constants (hardcoded configuration) for frontend code.
 */
export default class Fl32_Dup_Front_Defaults {

    ROUTE_CFG = '/cfg';
    ROUTE_CHAT = '/chat';
    ROUTE_CONTACTS = '/contacts';
    ROUTE_HOME = '/';
    ROUTE_USER_CREATE = '/user/create';

    /** @type {Fl32_Dup_Shared_Defaults} */
    SHARED;

    STORE_KEY_USER = 'user';

    constructor(spec) {
        this.SHARED = spec['Fl32_Dup_Shared_Defaults$'];
        Object.freeze(this);
    }
}
