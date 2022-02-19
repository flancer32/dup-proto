/**
 * Local configuration DTO for the plugin.
 * @see TeqFw_Core_Back_Config
 */
// MODULE'S VARS
const NS = 'Fl32_Dup_Back_Dto_Config_Local';

// MODULE'S CLASSES
export default class Fl32_Dup_Back_Dto_Config_Local {
    /** @type {TeqFw_Db_Back_Dto_Config_Local} */
    db;
    /** @type {string} */
    logsMonitor;
}

/**
 * Factory to create new DTO instances.
 * @memberOf Fl32_Dup_Back_Dto_Config_Local
 */
export class Factory {
    static namespace = NS;

    constructor(spec) {
        /** @type {TeqFw_Db_Back_Dto_Config_Local.Factory} */
        const fDb = spec['TeqFw_Db_Back_Dto_Config_Local.Factory$'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castString|function} */
        const castString = spec['TeqFw_Core_Shared_Util_Cast.castString'];

        /**
         * @param {Fl32_Dup_Back_Dto_Config_Local|null} [data]
         * @return {Fl32_Dup_Back_Dto_Config_Local}
         */
        this.create = function (data) {
            const res = new Fl32_Dup_Back_Dto_Config_Local();
            res.db = fDb.create(data?.db);
            res.logsMonitor = castString(data?.logsMonitor);
            return res;
        }
    }
}
