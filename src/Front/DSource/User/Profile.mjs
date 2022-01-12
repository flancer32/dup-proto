/**
 * DataSource for user data stored in IDB.
 */
export default class Fl32_Dup_Front_DSource_User_Profile {
    constructor(spec) {
        // EXTRACT DEPS
        /** @type {Fl32_Dup_Front_Defaults} */
        const DEF = spec['Fl32_Dup_Front_Defaults$'];
        /** @type {TeqFw_Web_Front_Store} */
        const store = spec['TeqFw_Web_Front_Store$'];
        /** @type {TeqFw_User_Shared_Dto_User} */
        const dtoUser = spec['TeqFw_User_Shared_Dto_User$'];

        // ENCLOSED VARS
        const STORE_KEY = `${DEF.SHARED.NAME}/front/user/profile`;
        let _cache;

        // INSTANCE METHODS
        /**
         * Get user data from IDB or generate new one and sae to IDB.
         * @return {Promise<TeqFw_User_Shared_Dto_User.Dto>}
         */
        this.get = async () => { }

        /**
         * @param {TeqFw_User_Shared_Dto_User.Dto} data
         * @return {Promise<void>}
         */
        this.set = async (data) => { }

    }
}
