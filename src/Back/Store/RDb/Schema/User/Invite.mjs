/**
 *  Meta data for '/app/user/invite' entity.
 *  @namespace Fl32_Dup_Back_Store_RDb_Schema_User_Invite
 */
// MODULE'S VARS
const NS = 'Fl32_Dup_Back_Store_RDb_Schema_User_Invite';
/**
 * Path to the entity in plugin's DEM.
 * @type {string}
 */
const ENTITY = '/app/user/invite';

/**
 * @memberOf Fl32_Dup_Back_Store_RDb_Schema_User_Invite
 * @type {Object}
 */
const ATTR = {
    CODE: 'code',
    DATE_EXPIRED: 'date_expired',
    FRONT_REF: 'front_ref',
    ONETIME: 'onetime',
    USER_NICK: 'user_nick',
};

// MODULE'S CLASSES
/**
 * @memberOf Fl32_Dup_Back_Store_RDb_Schema_User_Invite
 */
class Dto {
    static namespace = NS;
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
     * User who creates this sign up code.
     * @type {number}
     */
    front_ref;
    /**
     * 'true' - this code is available for one time registration only.
     * @type {boolean}
     */
    onetime;
    /**
     * Nickname of the user who creates this sign up code to add to contact card of parent.
     * @type {string}
     */
    user_nick;
}

// noinspection JSClosureCompilerSyntax
/**
 * @implements TeqFw_Db_Back_RDb_Meta_IEntity
 */
export default class Fl32_Dup_Back_Store_RDb_Schema_User_Invite {
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
