/**
 * Wrap TweetNaCl library to use as ES6 module in TeqFW on the front.
 * @namespace Fl32_Dup_Front_Lib_Nacl
 */
if (window.nacl === undefined) {
    throw new Error(`
Add '<script type="application/javascript" src="./src/tweetnacl/nacl-fast.min.js"></script>' 
to your startup HTML to use TweetNaCl.            
`);
}
export const {
    box,
    hash,
    lowlevel,
    randomBytes,
    scalarMult,
    secretbox,
    setPRNG,
    sign,
    verify,
} = window.nacl;
