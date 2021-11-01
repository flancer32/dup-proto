/**
 *  Meta data for '/app/user' entity.
 *  @namespace Fl32_Dup_Back_Store_RDb_Schema_User
 */
// MODULE'S VARS
const NS = 'Fl32_Dup_Back_Store_RDb_Schema_User';
/**
 * Path to the entity in plugin's DEM.
 * @type {string}
 */
const ENTITY = '/app/user';

/**
 * @memberOf Fl32_Dup_Back_Store_RDb_Schema_User
 * @type {Object}
 */
const ATTR = {
    KEY_PUB: 'key_pub',
    NICK: 'nick',
    USER_REF: 'user_ref',
};

// MODULE'S CLASSES
/**
 * @memberOf Fl32_Dup_Back_Store_RDb_Schema_User
 */
class Dto {
    static name = `${NS}.Dto`;
    /**
     * Public key for the user.
     * @type {string}
     */
    key_pub;
    /**
     * Default nickname for the user.
     * @type {string}
     */
    nick;
    /**
     * @type {number}
     */
    user_ref;
}

// noinspection JSClosureCompilerSyntax
/**
 * @implements TeqFw_Db_Back_RDb_Meta_IEntity
 */
export default class Fl32_Dup_Back_Store_RDb_Schema_User {
    constructor(spec) {
        /** @type {Fl32_Dup_Back_Defaults} */
        const DEF = spec['Fl32_Dup_Back_Defaults$'];
        /** @type {TeqFw_Db_Back_RDb_Schema_EntityBase} */
        const base = spec['TeqFw_Db_Back_RDb_Schema_EntityBase$'];

        return base.create(this,
            `${DEF.SHARED.NAME}${ENTITY}`,
            ATTR,
            [ATTR.USER_REF],
            Dto
        );
    }
}

// finalize code components for this es6-module
Object.freeze(ATTR);
