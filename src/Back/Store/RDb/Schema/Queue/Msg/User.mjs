/**
 *  Meta data for '/queue/msg/user' entity.
 *  @namespace Fl32_Dup_Back_Store_RDb_Schema_Queue_Msg_User
 */
// MODULE'S VARS
const NS = 'Fl32_Dup_Back_Store_RDb_Schema_Queue_Msg_User';
/**
 * Path to the entity in plugin's DEM.
 * @type {string}
 */
const ENTITY = '/queue/msg/user';

/**
 * @memberOf Fl32_Dup_Back_Store_RDb_Schema_Queue_Msg_User
 * @type {Object}
 */
const ATTR = {
    DATE: 'date',
    ID: 'id',
    PAYLOAD: 'payload',
    RECEIVER_REF: 'receiver_ref',
    SENDER_REF: 'sender_ref',
    STATE: 'state',
};

// MODULE'S CLASSES
/**
 * @memberOf Fl32_Dup_Back_Store_RDb_Schema_Queue_Msg_User
 */
class Dto {
    static name = `${NS}.Dto`;
    /**
     * Message date (when registered in queue).
     * @type {Date}
     */
    date;
    /** @type {number} */
    id;
    /**
     * Message text, encrypted and base64 encoded.
     * @type {string}
     */
    payload;
    /**
     * User who should receive the message.
     * @type {number}
     */
    receiver_ref;
    /**
     * User who sent the message.
     * @type {number}
     */
    sender_ref;
    /**
     * State of the message in queue.
     * @type {string}
     */
    state;
}

// noinspection JSClosureCompilerSyntax
/**
 * @implements TeqFw_Db_Back_RDb_Meta_IEntity
 */
export default class Fl32_Dup_Back_Store_RDb_Schema_Queue_Msg_User {
    constructor(spec) {
        /** @type {Fl32_Dup_Back_Defaults} */
        const DEF = spec['Fl32_Dup_Back_Defaults$'];
        /** @type {TeqFw_Db_Back_RDb_Schema_EntityBase} */
        const base = spec['TeqFw_Db_Back_RDb_Schema_EntityBase$'];

        return base.create(this,
            `${DEF.SHARED.NAME}${ENTITY}`,
            ATTR,
            [ATTR.ID],
            Dto
        );
    }
}

// finalize code components for this es6-module
Object.freeze(ATTR);
