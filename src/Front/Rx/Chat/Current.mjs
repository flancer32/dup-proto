/**
 * Reactive element contains data related to display messages band for currently active chat.
 *
 * @namespace Fl32_Dup_Front_Rx_Chat_Current
 */
export default class Fl32_Dup_Front_Rx_Chat_Current {
    constructor(spec) {
        // DEPS
        const {ref} = spec['TeqFw_Vue_Front_Lib_Vue'];

        // VARS
        const _bandId = ref(null);
        const _messages = ref([]);
        const _messagesCount = ref(0);
        const _title = ref();
        const _typeRoom = ref(false);
        const _typeUser = ref(false);

        // FUNCS

        // INSTANCE METHODS
        /**
         * @param {Fl32_Dup_Front_Dto_Message.Dto} data
         * @return {*}
         */
        this.addMessage = (data) => {
            _messages.value.push(data);
            _messagesCount.value = _messages.value.length;
        }

        /**
         *
         * @param {Fl32_Dup_Front_Dto_Message.Dto[]} messages
         */
        this.resetBand = function (messages) {
            _messages.value.length = 0;
            for (const one of messages) _messages.value.push(one);
        }

        this.getMessages = () => _messages;
        this.getMessagesCount = () => _messagesCount;
        this.getBandId = () => _bandId;
        this.getTitle = () => _title;
        this.getTypeRoom = () => _typeRoom;
        this.getTypeUser = () => _typeUser;

        this.setBandId = (id) => _bandId.value = id;
        this.setTitle = (value) => _title.value = value;
        this.setTypeRoom = () => {
            _typeRoom.value = true;
            _typeUser.value = false;
        }
        this.setTypeUser = () => {
            _typeUser.value = true;
            _typeRoom.value = false;
        }

    }

}
