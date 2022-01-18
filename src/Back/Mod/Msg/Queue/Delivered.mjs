/**
 * Queue to save delivered messages on the server.
 * These messages are delivered to receivers but have no confirmation from senders about delivery reports receiving.
 *
 * @namespace Fl32_Dup_Back_Mod_Msg_Queue_Delivered
 */
export default class Fl32_Dup_Back_Mod_Msg_Queue_Delivered {
    constructor(spec) {
        // EXTRACT DEPS
        /** @type {TeqFw_Core_Shared_Logger} */
        const logger = spec['TeqFw_Core_Shared_Logger$'];

        // ENCLOSED VARS
        /**
         * @type {Map<string, Fl32_Dup_Shared_Dto_Msg.Dto>}
         */
        const _store = new Map();
        /**
         * Map userId to UUIDs of user's messages in queue.
         * @type {Object<number, string[]>}
         */
        const _mapUser2Msg = {};

        // INSTANCE METHODS
        /**
         * Add message to the queue.
         * @param {Fl32_Dup_Shared_Dto_Msg.Dto} data
         * @return {string} uuid
         */
        this.add = function (data) {
            const uuid = data.uuid;
            const userId = data.senderId; // return delivery report to sender
            if (_store.has(uuid))
                throw Error(`There is message '${uuid}' in the delivered messages queue. Cannot process.`);
            _store.set(uuid, data);
            if (!_mapUser2Msg[userId]) _mapUser2Msg[userId] = [];
            _mapUser2Msg[userId].push(uuid);
            logger.info(`Message ${uuid} is added to delivered messages queue.`);
            return uuid;
        }

        /**
         * @param {string} uuid
         * @return {Fl32_Dup_Shared_Dto_Msg.Dto}
         */
        this.get = function (uuid) {
            return _store.get(uuid);
        }

        /**
         * Get UUIDS for all delayed messages for given user.
         * @param {number} userId
         * @return {string[]}
         */
        this.getUuidsForUser = function (userId) {
            return _mapUser2Msg[userId] || [];
        }


        /**
         * @param {string} uuid
         */
        this.remove = function (uuid) {
            const item = _store.get(uuid);
            if (item) {
                const userId = item.senderId;
                _mapUser2Msg[userId] = _mapUser2Msg[userId].filter((one) => one !== uuid);
                _store.delete(uuid);
                if (_mapUser2Msg[userId].length === 0) delete _mapUser2Msg[userId];
                logger.info(`Message ${uuid} is removed from delivered messages queue.`);
            }
        }
    }
}
