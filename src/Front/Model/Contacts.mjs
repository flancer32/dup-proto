/**
 * Model for list of users contacts.
 *
 * @namespace Fl32_Dup_Front_Model_Contacts
 */
export default class Fl32_Dup_Front_Model_Contacts {
    constructor(spec) {
        // EXTRACT DEPS
        /** @type {TeqFw_Vue_Front_Lib} */
        const VueLib = spec['TeqFw_Vue_Front_Lib$'];

        // DEFINE WORKING VARS / PROPS
        const ref = VueLib.getVue().ref;
        /** @type {Fl32_Dup_Front_Dto_Contacts_Card.Dto[]} */
        const _data = ref([]);

        // DEFINE INNER FUNCTIONS


        // DEFINE INSTANCE METHODS
        this.push = function (data) {
            _data.value.push(data);
        };

        this.setValues = function (data) {
            _data.value = data;
        }
        /**
         * Get reactive object.
         * @return {Fl32_Dup_Front_Dto_Contacts_Card.Dto[]}
         */
        this.getRef = () => _data;

        // MAIN FUNCTIONALITY
    }

}
