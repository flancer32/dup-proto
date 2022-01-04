/**
 * Get list of the users from the server.
 *
 * @namespace Fl32_Dup_Back_WAPI_User_List
 */
// MODULE'S VARS
const NS = 'Fl32_Dup_Back_WAPI_User_List';

/**
 * @implements TeqFw_Web_Back_Api_WAPI_IFactory
 */
export default class Fl32_Dup_Back_WAPI_User_List {

    constructor(spec) {
        // EXTRACT DEPS
        /** @type {TeqFw_Db_Back_RDb_IConnect} */
        const conn = spec['TeqFw_Db_Back_RDb_IConnect$'];
        /** @type {Fl32_Dup_Shared_WAPI_User_List.Factory} */
        const route = spec['Fl32_Dup_Shared_WAPI_User_List#Factory$'];
        /** @type {TeqFw_User_Back_Store_RDb_Schema_User} */
        const metaUser = spec['TeqFw_User_Back_Store_RDb_Schema_User$'];
        /** @type {Fl32_Dup_Back_Store_RDb_Schema_User} */
        const metaApp = spec['Fl32_Dup_Back_Store_RDb_Schema_User$'];
        /** @type {Fl32_Dup_Back_Store_RDb_Schema_User_Tree} */
        const metaTree = spec['Fl32_Dup_Back_Store_RDb_Schema_User_Tree$'];
        /** @type {Fl32_Dup_Shared_Dto_Contacts_Card} */
        const dtoCard = spec['Fl32_Dup_Shared_Dto_Contacts_Card$'];

        // DEFINE WORKING VARS / PROPS
        /** @type {typeof Fl32_Dup_Shared_Dto_Contacts_Card.ATTR} */
        const ATTR = dtoCard.getAttributes();
        /** @type {typeof Fl32_Dup_Back_Store_RDb_Schema_User_Tree.ATTR} */
        const A_TREE = metaTree.getAttributes();
        /** @type {typeof Fl32_Dup_Back_Store_RDb_Schema_User.ATTR} */
        const A_APP = metaApp.getAttributes();
        /** @type {typeof TeqFw_User_Back_Store_RDb_Schema_User.ATTR} */
        const A_USER = metaUser.getAttributes();

        // DEFINE INSTANCE METHODS
        this.getRouteFactory = () => route;

        this.getService = function () {
            // DEFINE INNER FUNCTIONS
            /**
             * @param {TeqFw_Web_Back_App_Server_Handler_WAPI_Context} context
             * @return Promise<void>
             */
            async function service(context) {
                // DEFINE INNER FUNCTIONS

                /**
                 * @param {TeqFw_Db_Back_RDb_ITrans} trx
                 * @return {Promise<Object<number, Fl32_Dup_Shared_Dto_Contacts_Card.Dto>>}
                 */
                async function listContacts(trx) {
                    const res = {};
                    // actual table names
                    const T_APP = trx.getTableName(metaApp);
                    const T_TREE = trx.getTableName(metaTree);
                    const T_USER = trx.getTableName(metaUser);
                    // table aliases
                    const AS_A = 'app';
                    const AS_T = 'tree';
                    const AS_U = 'user';
                    // attributes aliases
                    const A_DATE = ATTR.DATE_REGISTERED;
                    const A_KEY_PUB = ATTR.KEY_PUBLIC;
                    const A_NICK = ATTR.NICK;
                    const A_PARENT_ID = ATTR.PARENT_ID;
                    const A_USER_ID = ATTR.USER_ID;

                    // select from main table
                    /** @type {Knex.QueryBuilder} */
                    const query = trx.createQuery();
                    query.table({[AS_U]: T_USER});
                    query.select([
                        {[A_USER_ID]: `${AS_U}.${A_USER.ID}`},
                        {[A_DATE]: `${AS_U}.${A_USER.DATE_CREATED}`},
                    ]);
                    // left join app_user
                    query.leftOuterJoin(
                        {[AS_A]: T_APP},
                        `${AS_A}.${A_APP.USER_REF}`,
                        `${AS_U}.${A_USER.ID}`);
                    query.select([
                        {[A_NICK]: `${AS_A}.${A_APP.NICK}`},
                        {[A_KEY_PUB]: `${AS_A}.${A_APP.KEY_PUB}`}
                    ]);
                    // left join app_user_tree
                    query.leftOuterJoin(
                        {[AS_T]: T_TREE},
                        `${AS_T}.${A_TREE.USER_REF}`,
                        `${AS_U}.${A_USER.ID}`);
                    query.select([
                        {[A_PARENT_ID]: `${AS_T}.${A_TREE.PARENT_REF}`},
                    ]);
                    // const sql = query.toQuery();
                    const rs = await query;
                    for (const one of rs) {
                        const card = dtoCard.createDto(one);
                        res[card.userId] = card;
                    }
                    return res;
                }

                // MAIN FUNCTIONALITY
                /** @type {Fl32_Dup_Shared_WAPI_User_List.Request} */
                // const req = context.getInData();
                /** @type {Fl32_Dup_Shared_WAPI_User_List.Response} */
                const res = context.getOutData();
                //
                const trx = await conn.startTransaction();
                try {
                    res.cards = await listContacts(trx);
                    await trx.commit();
                } catch (error) {
                    await trx.rollback();
                    throw error;
                }
            }

            // MAIN FUNCTIONALITY
            Object.defineProperty(service, 'name', {value: `${NS}.service`});
            return service;
        }

    }
}
