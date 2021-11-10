/**
 * Wrap TweetNaCl library to use as ES6 module in TeqFW.
 * @namespace Fl32_Dup_Front_Lib_Nacl_Util
 */
if (window?.nacl?.util === undefined) {
    throw new Error(`
Add '<script type="application/javascript" src="./src/tweetnacl-util/nacl-util.min.js"></script>' 
to your startup HTML to use TweetNaCl.            
`);
}
export const {
    decodeBase64,
    decodeUTF8,
    encodeBase64,
    encodeUTF8,
} = window.nacl.util;
