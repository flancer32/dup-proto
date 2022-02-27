/**
 * Wrap Qrious library to use as ES6 module in the project on the front.
 * @namespace Fl32_Dup_Front_Lib_Qrious
 */
if (window.QRious === undefined) {
    throw new Error(`
Add '<script type="application/javascript" src="./src/qrious/qrious.min.js"></script>' 
to your startup HTML to use Qrious.            
`);
}
export default window.QRious;
