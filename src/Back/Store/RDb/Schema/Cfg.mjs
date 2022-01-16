/**
 *  Meta data for '/app/cfg' entity.
 *  @namespace Fl32_Dup_Back_Store_RDb_Schema_Cfg
 */
// MODULE'S VARS
const NS = 'Fl32_Dup_Back_Store_RDb_Schema_Cfg';
/**
 * Path to the entity in plugin's DEM.
 * @type {string}
 */
const ENTITY = '/app/cfg';

/**
 * @memberOf Fl32_Dup_Back_Store_RDb_Schema_Cfg
 * @type {Object}
 */
const ATTR = {
    KEY: 'key',
    VALUE: 'value',
};

// MODULE'S CLASSES
/**
 * @memberOf Fl32_Dup_Back_Store_RDb_Schema_Cfg
 */
class Dto {
    static namespace = NS;
    /**
     * Path to current config value (/path/to/option).
     * @type {string}
     */
    key;
    /**
     * Any value stored as text..
     * @type {string}
     */
    value;
}

// noinspection JSClosureCompilerSyntax
/**
 * @implements TeqFw_Db_Back_RDb_Meta_IEntity
 */
export default class Fl32_Dup_Back_Store_RDb_Schema_Cfg {
    constructor(spec) {
        /** @type {Fl32_Dup_Back_Defaults} */
        const DEF = spec['Fl32_Dup_Back_Defaults$'];
        /** @type {TeqFw_Db_Back_RDb_Schema_EntityBase} */
        const base = spec['TeqFw_Db_Back_RDb_Schema_EntityBase$'];

        return base.create(this,
            `${DEF.SHARED.NAME}${ENTITY}`,
            ATTR,
            [ATTR.KEY],
            Dto
        );
    }
}

// finalize code components for this es6-module
Object.freeze(ATTR);
