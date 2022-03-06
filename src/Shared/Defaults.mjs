export default class Fl32_Dup_Shared_Defaults {
    NAME = '@flancer32/dup-proto';

    DATA_INVITE_CODE_LENGTH = 16; // default length for sign-up & sign-in codes
    DATA_INVITE_LIFETIME_MIN = 5; // default lifetime in minutes for invitation

    LOG_META_TYPE = 'type'; // log type in log metadata sent to logs monitor

    constructor() {
        Object.freeze(this);
    }
}
