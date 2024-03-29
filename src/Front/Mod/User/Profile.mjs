/**
 * User profile for front app. There is no users on back, only front apps.
 */
export default class Fl32_Dup_Front_Mod_User_Profile {
    constructor(spec) {
        // DEPS
        /** @type {Fl32_Dup_Front_Defaults} */
        const DEF = spec['Fl32_Dup_Front_Defaults$'];
        /** @type {TeqFw_Web_Front_Mod_Store_Singleton} */
        const storeSingle = spec['TeqFw_Web_Front_Mod_Store_Singleton$'];

        // VARS
        const STORE_KEY = `${DEF.SHARED.NAME}/front/user/profile`;
        /** @type {Fl32_Dup_Front_Dto_User.Dto} */
        let _cache;

        // INSTANCE METHODS
        /**
         * Get data from IDB or generate new one and save to IDB.
         * @return {Promise<Fl32_Dup_Front_Dto_User.Dto>}
         */
        this.get = async function () {
            if (_cache === undefined)
                _cache = await storeSingle.get(STORE_KEY);
            return _cache;
        }

        /**
         * Save data into IDB and refresh cache.
         * @param {Fl32_Dup_Front_Dto_User.Dto} data
         * @return {Promise<void>}
         */
        this.set = async (data) => {
            await storeSingle.set(STORE_KEY, data);
            _cache = data;
        }
    }
}
