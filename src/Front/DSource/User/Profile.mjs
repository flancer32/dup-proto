/**
 * DataSource for user profile data (application level) stored in IDB.
 * @deprecated use Fl32_Dup_Front_Mod_User_Profile
 */
export default class Fl32_Dup_Front_DSource_User_Profile {
    constructor(spec) {
        // EXTRACT DEPS
        /** @type {Fl32_Dup_Front_Defaults} */
        const DEF = spec['Fl32_Dup_Front_Defaults$'];
        /** @type {TeqFw_Web_Front_Store} */
        const store = spec['TeqFw_Web_Front_Store$'];

        // ENCLOSED VARS
        const STORE_KEY = `${DEF.SHARED.NAME}/front/user/profile`;
        let _cache;

        // INSTANCE METHODS

        this.clean = async () => {
            _cache = undefined;
            await store.delete(STORE_KEY);
        }

        /**
         * Get user data from IDB or generate new one and sae to IDB.
         * @return {Promise<Fl32_Dup_Front_Dto_User.Dto>}
         */
        this.get = async () => {
            if (_cache === undefined)
                _cache = await store.get(STORE_KEY);
            return _cache;
        }

        /**
         * @param {Fl32_Dup_Front_Dto_User.Dto} data
         * @return {Promise<void>}
         */
        this.set = async (data) => {
            _cache = data;
            await store.set(STORE_KEY, data);
        }

    }
}
