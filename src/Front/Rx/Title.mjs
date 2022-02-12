/**
 * Reactive title in layouts.
 */
export default class Fl32_Dup_Front_Rx_Title {
    constructor(spec) {
        // EXTRACT DEPS
        const {ref} = spec['TeqFw_Vue_Front_Lib_Vue'];

        // ENCLOSED VARS
        const _data = ref(null);

        // INSTANCE METHODS
        /**
         * Get reactive object.
         */
        this.getRef = () => _data;
        this.set = (val) => _data.value = val;
    }
}
