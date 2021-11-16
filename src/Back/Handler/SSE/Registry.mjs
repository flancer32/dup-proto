/**
 * Registry for SSE connections.
 */
export default class Fl32_Dup_Back_Handler_SSE_Registry {
    constructor(spec) {
        // EXTRACT DEPS
        /** @type {TeqFw_Core_Shared_Logger} */
        const logger = spec['TeqFw_Core_Shared_Logger$'];

        // WORKING VARS / PROPS
        let count = 1;
        /** @type {Object<number, Fl32_Dup_Back_Handler_SSE_DTO_Registry_Item.Dto>} */
        const _store = {};
        /**
         * Map userID to SSE-connection. One user has one opened connection only.
         * @type {Object<number, number>}
         * @private
         */
        const _mapUser = {};

        // INNER FUNCTIONS
        function generateId() {
            return count++;
        }


        // INSTANCE METHODS
        /**
         *
         * @param {Fl32_Dup_Back_Handler_SSE_DTO_Registry_Item.Dto} item
         * @return {number}
         */
        this.add = function (item) {
            const id = generateId();
            item.connectionId = id;
            _store[id] = item;
            logger.info(`New SSE connection #${id} is registered.`);
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
            const conn = _store[connId];
            if (conn) {
                if ((_mapUser[userId]) && (_mapUser[userId] !== connId))
                    this.close(_mapUser[userId]);
                _mapUser[userId] = connId;
                conn.userId = userId;
            }
        }

        this.close = function (connId) {
            const item = _store[connId];
            if (item) {
                item.close();
                logger.info(`SSE connection #${connId} is closed.`);
            } else {
                logger.error(`Cannot close SSE connection #${connId}. This connection is not in the registry.`);
            }
        }


        this.remove = function (connId) {
            const conn = _store[connId];
            if (conn) {
                const userId = conn.userId;
                delete _store[connId];
                delete _mapUser[userId];
                logger.info(`SSE connection #${connId} for user #${userId} is removed from registry.`);
            }
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
