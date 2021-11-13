export default class Fl32_Dup_Shared_Defaults {
    NAME = '@flancer32/duplo-proto';

    DATA_DUPLO_NICK = 'D.U.P.L.O.';
    DATA_DUPLO_USER_ID = 0;
    DATA_INVITE_CODE_LENGTH = 16; // default length for sign-up & sign-in codes
    DATA_INVITE_LIFETIME_MIN = 5; // default lifetime in minutes for invitation

    SPACE_SSE = 'sse';

    WAPI_HOLLOW_IS_FREE = '/hollow/isFree';
    WAPI_MSG_POST = '/msg/post';
    WAPI_SSE_AUTHORIZE = '/sse/authorize';
    WAPI_USER_CREATE = '/user/create';
    WAPI_USER_INVITE_CREATE = '/user/invite/create';
    WAPI_USER_INVITE_VALIDATE= '/user/invite/validate';
    WAPI_USER_LIST = '/user/list';

    constructor() {
        Object.freeze(this);
    }
}
