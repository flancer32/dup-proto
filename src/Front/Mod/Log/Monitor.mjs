/**
 * Model to configure logs monitoring (send logs to backend).
 */
export default class Fl32_Dup_Front_Mod_Log_Monitor {
    constructor(spec) {
        // DEPS
        /** @type {Fl32_Dup_Front_Defaults} */
        const DEF = spec['Fl32_Dup_Front_Defaults$'];
        /** @type {TeqFw_Web_Front_Mod_Store_Singleton} */
        const storeSingle = spec['TeqFw_Web_Front_Mod_Store_Singleton$'];

        // VARS
        const STORE_KEY = `${DEF.SHARED.NAME}/front/log/monitor`;
        /** @type {boolean} */
        let _cache;


        // INSTANCE METHODS
        /**
         * Get data from IDB or generate new one and save to IDB.
         * @return {Promise<boolean>}
         */
        this.get = async function () {
            if (_cache === undefined) {
                const obj = await storeSingle.get(STORE_KEY);
                if (obj?.enabled === undefined) await this.set(true);
                else _cache = !!obj.enabled;
            }
            return _cache;
        }

        /**
         * Save data into IDB and refresh cache.
         * @param {boolean} enabled
         * @return {Promise<void>}
         */
        this.set = async (enabled) => {
            enabled = !!enabled;
            await storeSingle.set(STORE_KEY, {enabled});
            _cache = enabled;
        }
    }
}
