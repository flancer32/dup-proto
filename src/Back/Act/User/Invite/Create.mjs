/**
 * Create new invitation code in DB.
 *
 * @namespace Fl32_Dup_Back_Act_User_Invite_Create
 */
// MODULE'S IMPORT
import $crypto from "crypto";

// MODULE'S VARS
const NS = 'Fl32_Dup_Back_Act_User_Invite_Create';

// MODULE'S FUNCTIONS
export default function (spec) {
    // DEPS
    /** @type {Fl32_Dup_Back_Defaults} */
    const DEF = spec['Fl32_Dup_Back_Defaults$'];
    /** @type {TeqFw_Db_Back_Api_RDb_ICrudEngine} */
    const crud = spec['TeqFw_Db_Back_Api_RDb_ICrudEngine$'];
    /** @type {Fl32_Dup_Back_Store_RDb_Schema_User_Invite} */
    const metaInvite = spec['Fl32_Dup_Back_Store_RDb_Schema_User_Invite$'];

    // DEFINE WORKING VARS / PROPS
    const CODE_LENGTH = DEF.SHARED.DATA_INVITE_CODE_LENGTH;
    const CODE_LIFETIME_MIN = DEF.SHARED.DATA_INVITE_LIFETIME_MIN;
    /** @type {typeof Fl32_Dup_Back_Store_RDb_Schema_User_Invite.ATTR} */
    const ATTR = metaInvite.getAttributes();

    // ENCLOSED FUNCS
    /**
     * @param {TeqFw_Db_Back_RDb_ITrans} trx
     * @param {number} userId
     * @param {string} userNick
     * @param {boolean} onetime
     * @param {Date} dateExpired
     * @return {Promise<{code:string}>}
     * @memberOf Fl32_Dup_Back_Act_User_Invite_Create
     */
    async function act({trx, userId, userNick, onetime, dateExpired}) {
        // ENCLOSED FUNCS
        /**
         * @param trx
         * @returns {Promise<string>}
         */
        async function generateCode(trx) {
            let code, found;
            do {
                code = $crypto.randomBytes(CODE_LENGTH).toString('hex').toLowerCase();
                found = await crud.readOne(trx, metaInvite, {[ATTR.CODE]: code});
            } while (found !== null);
            return code;
        }

        function getDateExpDefault() {
            const result = new Date();
            result.setUTCMinutes(result.getUTCMinutes() + CODE_LIFETIME_MIN);
            return result;
        }

        // MAIN
        const code = await generateCode(trx);
        const dateExp = dateExpired ?? getDateExpDefault();
        // add invitation to DB
        /** @type {Fl32_Dup_Back_Store_RDb_Schema_User_Invite.Dto} */
        const dto = metaInvite.createDto();
        dto.code = code;
        dto.date_expired = dateExp;
        dto.onetime = onetime;
        dto.user_nick = userNick;
        dto.front_ref = userId;
        await crud.create(trx, metaInvite, dto);
        return {code};

    }

    // MAIN
    Object.defineProperty(act, 'name', {value: `${NS}.act`});
    return act;
}
