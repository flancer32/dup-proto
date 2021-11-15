/**
 * Factory to create handler for authorization events in SSE.
 * @namespace Fl32_Dup_Front_Model_SSE_Connect_Event_Authorize
 */
// MODULE'S VARS
const NS = 'Fl32_Dup_Front_Model_SSE_Connect_Event_Authorize';

export default function (spec) {
    /** @type {TeqFw_User_Front_Api_ISession} */
    const _session = spec['TeqFw_User_Front_Api_ISession$'];
    /** @type {Fl32_Dup_Shared_SSE_Authorize} */
    const sseAuth = spec['Fl32_Dup_Shared_SSE_Authorize$'];
    /** @type {TeqFw_Web_Front_Service_Gate} */
    const gate = spec['TeqFw_Web_Front_Service_Gate$'];
    /** @type {Fl32_Dup_Shared_WAPI_SSE_Authorize.Factory} */
    const wapiAuth = spec['Fl32_Dup_Shared_WAPI_SSE_Authorize#Factory$'];
    /** @type {Fl32_Dup_Front_Factory_Crypto} */
    const factCrypto = spec['Fl32_Dup_Front_Factory_Crypto$'];

    /**
     * @param event
     * @return {Promise<void>}
     * @memberOf Fl32_Dup_Front_Model_SSE_Connect_Event_Authorize
     */
    async function handler(event) {
        const text = event.data;
        try {
            // extract input data from event
            const msg = JSON.parse(text);
            const dto = sseAuth.createDto(msg);
            const connectionId = dto.connectionId;
            const payload = dto.payload;
            // get encryption keys
            /** @type {Fl32_Dup_Front_Store_Single_User.Dto} */
            const user = _session.getUser();
            const serverPub = user.serverPubKey;
            const userSec = user.key.secret;
            // compose and encrypt payload
            const source = {connectionId, payload};
            /** @type {Fl32_Dup_Shared_Model_Crypto_Enigma_Asym} */
            const enigma = await factCrypto.createEnigmaAsym();
            enigma.setKeys(serverPub, userSec);
            const encrypted = enigma.encryptAndSign(source);
            // send encrypted data to server using WAPI
            /** @type {Fl32_Dup_Shared_WAPI_SSE_Authorize.Request} */
            const req = wapiAuth.createReq();
            req.userId = user.id;
            req.token = encrypted;
            // noinspection JSValidateTypes
            /** @type {Fl32_Dup_Shared_WAPI_SSE_Authorize.Response} */
            const res = await gate.send(req, wapiAuth);
            if (res?.success) {} else if (res?.userNotFound) {
                // user has no public key in the hollow, delete user data from IDB
                await _session.deleteUser();
                await _session.open();
            }
        } catch (e) {
            console.log(text);
            console.dir(e);
        }
    }

    Object.defineProperty(handler, 'name', {value: `${NS}.handler`});
    return handler;
}
