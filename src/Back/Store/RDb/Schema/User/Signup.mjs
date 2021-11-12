/**
 *  Meta data for '/app/user/signup' entity.
 *  @namespace Fl32_Dup_Back_Store_RDb_Schema_User_Signup
 */
// MODULE'S VARS
const NS = 'Fl32_Dup_Back_Store_RDb_Schema_User_Signup';
/**
 * Path to the entity in plugin's DEM.
 * @type {string}
 */
const ENTITY = '/app/user/signup';

/**
 * @memberOf Fl32_Dup_Back_Store_RDb_Schema_User_Signup
 * @type {Object}
 */
const ATTR = {
    CODE: 'code',
    DATE_EXPIRED: 'date_expired',
    ONETIME: 'onetime',
    USER_REF: 'user_ref',
};

// MODULE'S CLASSES
/**
 * @memberOf Fl32_Dup_Back_Store_RDb_Schema_User_Signup
 */
class Dto {
    static name = `${NS}.Dto`;
    /**
     * Sign up code.
     * @type {string}
     */
    code;
    /**
     * Expiration date for sign up code.
     * @type {Date}
     */
    date_expired;
    /**
     * 'true' - this code is available for one time registration only.
     * @type {boolean}
     */
    onetime;
    /**
     * User who creates this sign up code.
     * @type {number}
     */
    user_ref;
}

// noinspection JSClosureCompilerSyntax
/**
 * @implements TeqFw_Db_Back_RDb_Meta_IEntity
 */
export default class Fl32_Dup_Back_Store_RDb_Schema_User_Signup {
    constructor(spec) {
        /** @type {Fl32_Dup_Back_Defaults} */
        const DEF = spec['Fl32_Dup_Back_Defaults$'];
        /** @type {TeqFw_Db_Back_RDb_Schema_EntityBase} */
        const base = spec['TeqFw_Db_Back_RDb_Schema_EntityBase$'];

        return base.create(this,
            `${DEF.SHARED.NAME}${ENTITY}`,
            ATTR,
            [ATTR.CODE],
            Dto
        );
    }
}

// finalize code components for this es6-module
Object.freeze(ATTR);
