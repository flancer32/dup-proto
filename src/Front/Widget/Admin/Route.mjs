/**
 * Container to access UI widget as singleton.
 */
export default class Fl32_Dup_Front_Widget_Admin_Route {
    constructor() {
        // VARS
        /** @type {Fl32_Dup_Front_Ui_Admin_Route.IUiComp} */
        let _store;

        // INSTANCE METHODS
        /**
         * @param {Fl32_Dup_Front_Ui_Admin_Route.IUiComp} data
         */
        this.set = (data) => _store = data;

        /**
         * @return {Fl32_Dup_Front_Ui_Admin_Route.IUiComp}
         */
        this.get = () => _store;
    }
}
