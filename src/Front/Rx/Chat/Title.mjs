/**
 * Chat title (reactive element).
 *
 * @namespace Fl32_Dup_Front_Rx_Chat_Title
 * @deprecated use Fl32_Dup_Front_Rx_Chat_Current
 */
export default class Fl32_Dup_Front_Rx_Chat_Title {
    constructor(spec) {
        // EXTRACT DEPS
        /** @type {TeqFw_Vue_Front_Lib} */
        const VueLib = spec['TeqFw_Vue_Front_Lib$'];

        // DEFINE WORKING VARS / PROPS
        const ref = VueLib.getVue().ref;
        const _data = ref();

        // DEFINE INNER FUNCTIONS


        // DEFINE INSTANCE METHODS
        this.set = (data) => _data.value = data;

        this.getRef = () => _data;

        // MAIN FUNCTIONALITY
    }

}
