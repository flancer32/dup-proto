/**
 * Link dialog on the contact add route.
 * Container to access Vue component as singleton.
 */
export default class Fl32_Dup_Front_Ui_Contacts_Add_DialogLink {
    constructor() {
        // VARS
        let _store;

        // INSTANCE METHODS
        this.set = (data) => _store = data;
        this.get = () => _store;
    }
}
