/**
 *  Meta data for '/app/user/tree' entity.
 *  @namespace Fl32_Dup_Back_Store_RDb_Schema_User_Tree
 */
// MODULE'S VARS
const NS = 'Fl32_Dup_Back_Store_RDb_Schema_User_Tree';
/**
 * Path to the entity in plugin's DEM.
 * @type {string}
 */
const ENTITY = '/app/user/tree';

/**
 * @memberOf Fl32_Dup_Back_Store_RDb_Schema_User_Tree
 * @type {Object}
 */
const ATTR = {
    FRONT_REF: 'front_ref',
    PARENT_REF: 'parent_ref',
};

// MODULE'S CLASSES
/**
 * @memberOf Fl32_Dup_Back_Store_RDb_Schema_User_Tree
 */
class Dto {
    static namespace = NS;
    /**
     * @type {number}
     */
    front_ref;
    /**
     * User who invites this user.
     * @type {number}
     */
    parent_ref;
}

// noinspection JSClosureCompilerSyntax
/**
 * @implements TeqFw_Db_Back_RDb_Meta_IEntity
 */
export default class Fl32_Dup_Back_Store_RDb_Schema_User_Tree {
    constructor(spec) {
        /** @type {Fl32_Dup_Back_Defaults} */
        const DEF = spec['Fl32_Dup_Back_Defaults$'];
        /** @type {TeqFw_Db_Back_RDb_Schema_EntityBase} */
        const base = spec['TeqFw_Db_Back_RDb_Schema_EntityBase$'];

        return base.create(this,
            `${DEF.SHARED.NAME}${ENTITY}`,
            ATTR,
            [ATTR.FRONT_REF],
            Dto
        );
    }
}

// finalize code components for this es6-module
Object.freeze(ATTR);
