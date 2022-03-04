/**
 * Conversations on the home route.
 * Container to access Vue component as singleton.
 */
export default class Fl32_Dup_Front_Ui_Home_Conversation {
    constructor() {
        // VARS
        let _store;

        // INSTANCE METHODS
        this.set = (data) => _store = data;
        this.get = () => _store;
    }
}
