/**
 * Authorize SSE connection.
 *
 * Client encrypt SSE token with server's public key and sign it with own secret key. This service receives
 * encrypted data, decrypt it and authorize related connection to send messages to the client.
 *
 * @namespace Fl32_Dup_Back_WAPI_SSE_Authorize
 */
// MODULE'S IMPORT
import {join} from "path";

// MODULE'S VARS
const NS = 'Fl32_Dup_Back_WAPI_SSE_Authorize';

/**
 * @implements TeqFw_Web_Back_Api_Service_IFactory
 */
export default class Fl32_Dup_Back_WAPI_SSE_Authorize {

    constructor(spec) {
        // EXTRACT DEPS
        /** @type {Fl32_Dup_Back_Defaults} */
        const DEF = spec['Fl32_Dup_Back_Defaults$'];
        /** @type {TeqFw_Core_Shared_Logger} */
        const logger = spec['TeqFw_Core_Shared_Logger$'];
        /** @type {TeqFw_Db_Back_RDb_IConnect} */
        const conn = spec['TeqFw_Db_Back_RDb_IConnect$'];
        /** @type {Fl32_Dup_Shared_WAPI_SSE_Authorize.Factory} */
        const route = spec['Fl32_Dup_Shared_WAPI_SSE_Authorize#Factory$'];
        /** @type {TeqFw_Core_Back_Config} */
        const config = spec['TeqFw_Core_Back_Config$'];
        /** @type {TeqFw_Core_Back_Util.readJson|function} */
        const readJson = spec['TeqFw_Core_Back_Util.readJson'];
        /** @type {Fl32_Dup_Back_Handler_SSE_Registry} */
        const registry = spec['Fl32_Dup_Back_Handler_SSE_Registry$'];
        /** @type {TeqFw_Db_Back_Api_RDb_ICrudEngine} */
        const crud = spec['TeqFw_Db_Back_Api_RDb_ICrudEngine$'];
        /** @type {Fl32_Dup_Back_Store_RDb_Schema_User} */
        const rdbAppUser = spec['Fl32_Dup_Back_Store_RDb_Schema_User$'];
        /** @type {Fl32_Dup_Back_Store_RDb_Schema_Queue_Msg_User} */
        const rdbQUserMsg = spec['Fl32_Dup_Back_Store_RDb_Schema_Queue_Msg_User$'];
        /** @type {Fl32_Dup_Back_Factory_Crypto} */
        const factCrypto = spec['Fl32_Dup_Back_Factory_Crypto$'];


        // DEFINE WORKING VARS / PROPS
        /** @type {typeof Fl32_Dup_Back_Store_RDb_Schema_User.ATTR} */
        const A_USER = rdbAppUser.getAttributes();
        /** @type {typeof Fl32_Dup_Back_Store_RDb_Schema_Queue_Msg_User.ATTR} */
        const A_QUM = rdbQUserMsg.getAttributes();

        // DEFINE INSTANCE METHODS
        this.getRouteFactory = () => route;

        this.getService = function () {
            // DEFINE INNER FUNCTIONS
            /**
             * @param {TeqFw_Web_Back_Api_Service_Context} context
             * @return Promise<void>
             */
            async function service(context) {
                // DEFINE INNER FUNCTIONS
                /**
                 * Load server's public key from the file
                 * @return {string}
                 */
                function loadSecretKey() {
                    // load key from local file
                    const root = config.getBoot().projectRoot;
                    const path = join(root, DEF.FILE_CRYPTO_KEYS);
                    const keys = readJson(path);
                    return keys?.secretKey;
                }

                async function loadPublicKey(trx, userId) {
                    /** @type {Fl32_Dup_Back_Store_RDb_Schema_User.Dto} */
                    const one = await crud.readOne(trx, rdbAppUser, {[A_USER.USER_REF]: userId})
                    return one?.key_pub;
                }

                async function sendDelayedMessaged(trx, userId) {
                    // DEFINE INNER FUNCTIONS
                    async function getNameByUserId(trx, userId) {
                        /** @type {Fl32_Dup_Back_Store_RDb_Schema_User.Dto} */
                        const item = await crud.readOne(trx, rdbAppUser, userId);
                        return item?.nick ?? '';
                    }

                    // MAIN FUNCTIONALITY
                    const where = {[A_QUM.RECEIVER_REF]: parseInt(userId)};
                    /** @type {Fl32_Dup_Back_Store_RDb_Schema_Queue_Msg_User.Dto[]} */
                    const items = await crud.readSet(trx, rdbQUserMsg, where);
                    for (const item of items) {
                        /** @type {Fl32_Dup_Back_Handler_SSE_DTO_Registry_Item.Dto} */
                        const itemTo = registry.getConnectionByUser(userId);
                        if (itemTo) {
                            const body = item.payload;
                            const author = await getNameByUserId(trx, userId);
                            const dto = {userId: item.sender_ref, body, author, msgId: item.id};
                            const event = 'chatPost';
                            itemTo.respond(dto, null, event);
                        }
                    }

                }

                // MAIN FUNCTIONALITY
                /** @type {Fl32_Dup_Shared_WAPI_SSE_Authorize.Request} */
                const req = context.getInData();
                /** @type {Fl32_Dup_Shared_WAPI_SSE_Authorize.Response} */
                const res = context.getOutData();
                //
                const trx = await conn.startTransaction();
                try {
                    const userId = req.userId;
                    const token = req.token;
                    const secretBase64 = loadSecretKey();
                    const publicBase64 = await loadPublicKey(trx, userId);
                    if (publicBase64 === undefined) {
                        res.userNotFound = true;
                    } else {
                        /** @type {Fl32_Dup_Shared_Model_Crypto_Enigma_Asym} */
                        const enigma = await factCrypto.createEnigmaAsym();
                        enigma.setKeys(publicBase64, secretBase64);
                        /** @type {Fl32_Dup_Shared_SSE_Authorize.Dto} */
                        const decrypted = enigma.decryptAndVerify(token);
                        if (decrypted) {
                            logger.info(`User #${userId} is authorized to use SSE.`);
                            registry.setState(decrypted.connectionId, 'authorized')
                            registry.mapUser(decrypted.connectionId, userId);
                            await sendDelayedMessaged(trx, userId);
                        }
                    }
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
