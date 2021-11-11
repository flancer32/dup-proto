/**
 *
 */
export default class Fl32_Dup_Back_Model_SSE_Registry {
    constructor(spec) {

        // DEFINE WORKING VARS / PROPS
        let count = 1;
        /** @type {Object<number, Fl32_Dup_Back_Handler_SSE_DTO_Registry_Item.Dto>} */
        const _store = {};

        // DEFINE INNER FUNCTIONS
        function generateId() {
            return count++;
        }


        // DEFINE INSTANCE METHODS
        /**
         *
         * @param {Fl32_Dup_Back_Handler_SSE_DTO_Registry_Item.Dto} item
         * @return {number}
         */
        this.add = function (item) {
            const id = generateId();
            item.connectionId = id;
            _store[id] = item;
            return id;
        }

        this.sendMessage = function (connId, message, event) {
            const item = _store[connId];
            const msgId = item.messageId++;
            item.respond(message, msgId, event);
        }

        this.setState = function (connId, state) {
            const item = _store[connId];
            if (item) item.state = state;
        }
        this.close = function (connId) {
            const item = _store[connId];
            item.close();
        }
        this.items = function () {
            return Object.values(_store);
        }
    }

}
