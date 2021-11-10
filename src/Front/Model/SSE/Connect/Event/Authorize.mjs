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
    const {box, randomBytes} = spec['Fl32_Dup_Front_Lib_Nacl'];
    const {decodeBase64, encodeBase64, decodeUTF8, encodeUTF8} = spec['Fl32_Dup_Front_Lib_Nacl_Util'];


    /**
     * @param {} event
     * @return {Promise<void>}
     * @memberOf Fl32_Dup_Front_Model_SSE_Connect_Event_Authorize
     */
    async function handler(event) {
        const text = event.data;
        try {
            const msg = JSON.parse(text);
            const dto = sseAuth.createDto(msg);
            const connectionId = dto.connectionId;
            const payload = dto.payload;
            /** @type {Fl32_Dup_Front_Store_Entity_User.Dto} */
            const user = _session.getUser();
            const serverPub = user.serverPubKey;
            const userSec = user.key.secret;

            const abPub = decodeBase64(serverPub);
            const abSec = decodeBase64(userSec);

            const newNonce = () => randomBytes(box.nonceLength);

            const encrypt = (
                secretOrSharedKey,
                json,
                key
            ) => {
                const nonce = newNonce();
                const messageUint8 = decodeUTF8(JSON.stringify(json));
                const encrypted = key
                    ? box(messageUint8, nonce, key, secretOrSharedKey)
                    : box.after(messageUint8, nonce, secretOrSharedKey);

                const fullMessage = new Uint8Array(nonce.length + encrypted.length);
                fullMessage.set(nonce);
                fullMessage.set(encrypted, nonce.length);

                const base64FullMessage = encodeBase64(fullMessage);
                return base64FullMessage;
            };

            debugger

            const sharedA = box.before(abPub, abSec);

            const encrypted = encrypt(sharedA, payload);

        } catch
            (e) {
            console.log(text);
            console.dir(e);
        }
    }

    Object.defineProperty(handler, 'name', {value: `${NS}.handler`});
    return handler;
}
