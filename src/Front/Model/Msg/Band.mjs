/**
 * Model for messages to display in the Chat Band.
 *
 * @namespace Fl32_Dup_Front_Model_Msg_Band
 */
export default class Fl32_Dup_Front_Model_Msg_Band {
    constructor(spec) {
        // EXTRACT DEPS
        /** @type {TeqFw_Vue_Front_Lib} */
        const VueLib = spec['TeqFw_Vue_Front_Lib$'];

        // DEFINE WORKING VARS / PROPS
        const ref = VueLib.getVue().ref;
        const _data = ref([]);

        // DEFINE INNER FUNCTIONS


        // DEFINE INSTANCE METHODS
        this.push = function (data) {
            _data.value.push(data);
        }

        this.getData = () => _data;

        // MAIN FUNCTIONALITY
    }

}
