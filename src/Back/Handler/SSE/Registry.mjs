/**
 * Registry for SSE connections.
 */
export default class Fl32_Dup_Back_Handler_SSE_Registry {
    constructor(spec) {

        // DEFINE WORKING VARS / PROPS
        let count = 1;
        /** @type {Object<number, Fl32_Dup_Back_Handler_SSE_DTO_Registry_Item.Dto>} */
        const _store = {};
        /**
         * Map userID to SSE-connection. One user has one opened connection only.
         * @type {Object<number, number>}
         * @private
         */
        const _mapUser = {};

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

        /**
         * Map connection ID to user id.
         * @param {number} connId
         * @param {number} userId
         */
        this.mapUser = function (connId, userId) {
            if (_store[connId]) {
                if ((_mapUser[userId]) && (_mapUser[userId] !== connId))
                    this.close(_mapUser[userId]);
                _mapUser[userId] = connId;
            }
        }

        this.close = function (connId) {
            const item = _store[connId];
            item.close();
            delete _store[connId];
        }
        this.items = function () {
            return Object.values(_store);
        }

        /**
         * @param {number} userId
         * @return {Fl32_Dup_Back_Handler_SSE_DTO_Registry_Item.Dto|null}
         */
        this.getConnectionByUser = function (userId) {
            const connId = _mapUser[userId];
            return (_store[connId]) ?? null;
        }
    }

}
