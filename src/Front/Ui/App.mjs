/**
 * Application itself (as UI component, not as widget).
 * Container to access Vue component as singleton.
 */
export default class Fl32_Dup_Front_Ui_App {
    constructor() {
        // VARS
        let _store;
        let _router;

        // INSTANCE METHODS
        this.get = () => _store;
        this.getRouter = () => _router;
        this.set = (data) => _store = data;
        this.setRouter = (data) => _router = data;
    }
}
