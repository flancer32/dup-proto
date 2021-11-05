export default class Fl32_Dup_Back_Model_Registry_Sse {
    constructor(spec) {

        const _store = [];

        this.add = function (item) {
            _store.push(item);
        }

        this.items = function () {
            return _store;
        }
    }

}
