/**
 * Queue to save posted messages on the server.
 *
 * @namespace Fl32_Dup_Back_Mod_Msg_Queue_Posted
 */
export default class Fl32_Dup_Back_Mod_Msg_Queue_Posted {
    constructor(spec) {
        // EXTRACT DEPS
        /** @type {TeqFw_Core_Shared_Logger} */
        const logger = spec['TeqFw_Core_Shared_Logger$'];

        // ENCLOSED VARS
        const _store = new Map();

        // INSTANCE METHODS
        /**
         * Add message to the queue.
         * @param {Fl32_Dup_Shared_Dto_Msg.Dto} data
         * @return {string} uuid
         */
        this.add = function (data) {
            const uuid = data.uuid;
            if (_store.has(uuid))
                throw Error(`There is message '${uuid}' in the posted queue. Cannot process.`);
            _store.set(uuid, data);
            logger.info(`Message ${uuid} is added to posted queue.`);
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
         * @param {string} uuid
         */
        this.remove = function (uuid) {
            _store.delete(uuid);
            logger.info(`Message ${uuid} is removed from posted queue.`);
        }
    }
}
