/**
 * Factory to create handler for authorization events in SSE.
 * @namespace Fl32_Dup_Front_Model_SSE_Connect_Event_Authorize
 */
// MODULE'S VARS
const NS = 'Fl32_Dup_Front_Model_SSE_Connect_Event_Authorize';

export default function (spec) {
    /** @type {TeqFw_User_Front_Api_ISession} */
    const _session = spec['TeqFw_User_Front_Api_ISession$'];
    /** @type {Fl32_Dup_Front_Model_Key_Manager} */
    const mgrKey = spec['Fl32_Dup_Front_Model_Key_Manager$'];
    /** @type {Fl32_Dup_Shared_SSE_Authorize} */
    const sseAuth = spec['Fl32_Dup_Shared_SSE_Authorize$'];
    /** @type {TeqFw_Core_Shared_Util.b642ab|function} */
    const b642ab = spec['TeqFw_Core_Shared_Util.b642ab'];
    /** @type {TeqFw_Core_Shared_Util.str2ab|function} */
    const str2ab = spec['TeqFw_Core_Shared_Util.str2ab'];

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

            const pair = await mgrKey.generateKeyAsymmetric();
            const {privateKey, publicKey} = await mgrKey.exportKeys(pair);

            debugger
            const crypto = self.crypto.subtle;

            // import private key
            const fnSign = async function () {
                const crypto = self.crypto.subtle;
                // create keys pair then export private key
                const keyPair = await crypto.generateKey(
                    {
                        name: 'RSA-PSS',
                        modulusLength: 4096,
                        publicExponent: new Uint8Array([1, 0, 1]),
                        hash: 'SHA-256'
                    },
                    true,
                    ['sign', 'verify']
                );
                const exp = await crypto.exportKey('pkcs8', keyPair.privateKey);

                // import private key then sign message
                const imp = await crypto.importKey(
                    'pkcs8',
                    exp,
                    {
                        name: 'RSA-PSS',
                        hash: 'SHA-256'
                    },
                    true,
                    ['sign']
                );
                const payload = str2ab('text to sign');
                const signature = await crypto.sign(
                    {
                        name: "RSA-PSS",
                        saltLength: 32,
                    },
                    imp,
                    payload
                );

                // verify signed message
                const verified = await crypto.verify(
                    {
                        name: "RSA-PSS",
                        saltLength: 32,
                    },
                    keyPair.publicKey,
                    signature,
                    payload
                );
                debugger
            }

            const fnEncrypt = async function () {
                const crypto = window.crypto.subtle;
                // create keys pair then export private key
                const keyPair = await crypto.generateKey(
                    {
                        name: 'RSA-OAEP',
                        modulusLength: 4096,
                        publicExponent: new Uint8Array([1, 0, 1]),
                        hash: 'SHA-256'
                    },
                    true,
                    ['encrypt', 'decrypt']
                );
                const exp = await crypto.exportKey('pkcs8', keyPair.privateKey);

                // import private key then sign message
                debugger
                const imp = await crypto.importKey(
                    'pkcs8',
                    exp,
                    {
                        name: 'RSA-OAEP',
                        hash: 'SHA-256'
                    },
                    true,
                    ['encrypt', 'decrypt']
                );
                debugger
            }

            await fnSign();
            // await fnEncrypt();
            debugger
            // const imp = crypto.importKey()

            // const derPriv = b642ab(privateKey);
            // const derPub = b642ab(publicKey);
            //
            // const der = new Uint8Array(derPriv.byteLength + derPub.byteLength);
            // der.set(new Uint8Array(derPriv), 0);
            // der.set(new Uint8Array(derPub), derPriv.byteLength);
            //
            // const crypto = self.crypto.subtle;
            // const keyNew = await crypto.importKey(
            //     'pkcs8',
            //     derPriv,
            //     {
            //         name: "RSA-PSS",
            //         hash: "SHA-256",
            //     },
            //     true,
            //     ["sign"]
            // );
            //
            // debugger
            /** @type {Fl32_Dup_Front_Store_Entity_User.Dto} */
            // const user = _session.getUser();
            // const key = user.key;
            // // const encrypted = await mgrKey.encryptPub(payload, key.public);
            // const encrypted = await mgrKey.encryptPriv(payload, key.private);
            // console.log(`Authorize: ${encrypted}`);
        } catch
            (e) {
            console.log(text);
            console.dir(e);
        }
    }

    Object.defineProperty(handler, 'name', {value: `${NS}.handler`});
    return handler;
}
