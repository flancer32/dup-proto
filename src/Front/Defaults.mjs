/**
 * Plugin constants (hardcoded configuration) for frontend code.
 */
export default class Fl32_Dup_Front_Defaults {

    ROUTE_CFG = '/cfg';
    ROUTE_CHAT = '/chat';
    ROUTE_CHAT_ROOM = '/chat/room/:id';
    ROUTE_CHAT_USER = '/chat/user/:id';
    ROUTE_CONTACTS_ADD = '/contacts/add';
    ROUTE_CONTACTS_LIST = '/contacts/list';
    ROUTE_HOLLOW_OCCUPY = '/hollow/occupy';
    ROUTE_HOME = '/';
    ROUTE_INVITE_VALIDATE = '/invite/validate/:code';
    ROUTE_LOGS = '/logs';

    /** @type {Fl32_Dup_Shared_Defaults} */
    SHARED;

    TIMEOUT_EVENT_RESPONSE = 10000; // default timeout for response event (sent from back as answer to request from front)
    TIMEOUT_UI_DELAY = 1500; // default timeout for UI delays

    constructor(spec) {
        this.SHARED = spec['Fl32_Dup_Shared_Defaults$'];
        Object.freeze(this);
    }
}
