/**
 * UI object to access messages in conversation band.
 * Container to access Vue components in the app.
 * @see Fl32_Dup_Front_Widget_Chat_Msg_Band_Item
 */
export default class Fl32_Dup_Front_Ui_Chat_Band {
    constructor() {
        // VARS
        /** @type {Object<string, Fl32_Dup_Front_Widget_Chat_Msg_Band_Item.IUiComp>} */
        let _messages = {};

        // INSTANCE METHODS
        /**
         * @param {string} uuid
         * @param {Fl32_Dup_Front_Widget_Chat_Msg_Band_Item.IUiComp} comp
         * TODO: do we need to use component interface here: Fl32_Dup_Front_Widget_Chat_Msg_Band_Item.IUiComp ???
         */
        this.putMessage = function (uuid, comp) {
            _messages[uuid] = comp;
        }
        /**
         * Get UI component that corresponds to message with given UUID.
         * @param {string} uuid
         * @return {Fl32_Dup_Front_Widget_Chat_Msg_Band_Item.IUiComp}
         */
        this.get = function (uuid) {
            return _messages[uuid];
        }
    }
}
