/**
 * DTO for personal incoming message stored in IDB.
 *
 * @namespace Fl32_Dup_Front_Store_Dto_Msg_Pers_In
 */
// MODULE'S VARS
const NS = 'Fl32_Dup_Front_Store_Dto_Msg_Pers_In';

/**
 * @memberOf Fl32_Dup_Front_Store_Dto_Msg_Pers_In
 */
const ATTR = {
    DATE_SENT: 'dateSent',
    SENDER_ID: 'senderId',
};

/**
 * @extends Fl32_Dup_Front_Store_Entity_Msg_Base.Dto
 * @memberOf Fl32_Dup_Front_Store_Dto_Msg_Pers_In
 */
class Dto {
    static namespace = NS;
    /**
     * UTC date when message was sent by author.
     * @type {Date}
     */
    dateSent;
    /**
     * Internal ID for sender of the message.
     * @type {number}
     */
    senderId;
}

/**
 * @implements TeqFw_Core_Shared_Api_Factory_IDto
 */
export default class Fl32_Dup_Front_Store_Dto_Msg_Pers_In {
    constructor(spec) {
        /** @type {Fl32_Dup_Front_Store_Entity_Msg_Base} */
        const baseDto = spec['Fl32_Dup_Front_Store_Entity_Msg_Base$'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castInt|function} */
        const castInt = spec['TeqFw_Core_Shared_Util_Cast.castInt'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castDate|function} */
        const castDate = spec['TeqFw_Core_Shared_Util_Cast.castDate'];

        /**
         * @param {Fl32_Dup_Front_Store_Dto_Msg_Pers_In.Dto} [data]
         * @return {Fl32_Dup_Front_Store_Dto_Msg_Pers_In.Dto}
         */
        this.createDto = function (data) {
            // init base DTO and copy it to this DTO
            const base = baseDto.createDto(data);
            const res = Object.assign(new Dto(), base);
            // then init this DTO props
            res.dateSent = castDate(data?.dateSent);
            res.senderId = castInt(data?.senderId);
            return res;
        }
    }
}
