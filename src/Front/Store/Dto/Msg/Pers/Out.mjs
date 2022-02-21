/**
 * DTO for personal outgoing message stored in IDB.
 *
 * @namespace Fl32_Dup_Front_Store_Dto_Msg_Pers_Out
 */
// MODULE'S VARS
const NS = 'Fl32_Dup_Front_Store_Dto_Msg_Pers_Out';

/**
 * @memberOf Fl32_Dup_Front_Store_Dto_Msg_Pers_Out
 */
const ATTR = {
    DATE_DELIVERED: 'dateDelivered',
    RECIPIENT_ID: 'recipientId',
};

/**
 * @extends Fl32_Dup_Front_Store_Entity_Msg.Dto
 * @memberOf Fl32_Dup_Front_Store_Dto_Msg_Pers_Out
 */
class Dto {
    static namespace = NS;
    /**
     * UTC date when message was delivered to recipient.
     * @type {Date}
     */
    dateDelivered;
    /**
     * Internal ID for recipient of the message.
     * @type {number}
     */
    recipientId;
}

/**
 * @implements TeqFw_Core_Shared_Api_Factory_IDto
 */
export default class Fl32_Dup_Front_Store_Dto_Msg_Pers_Out {
    constructor(spec) {
        /** @type {Fl32_Dup_Front_Store_Entity_Msg} */
        const baseDto = spec['Fl32_Dup_Front_Store_Entity_Msg$'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castInt|function} */
        const castInt = spec['TeqFw_Core_Shared_Util_Cast.castInt'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castDate|function} */
        const castDate = spec['TeqFw_Core_Shared_Util_Cast.castDate'];

        /**
         * @param {Fl32_Dup_Front_Store_Dto_Msg_Pers_Out.Dto} [data]
         * @return {Fl32_Dup_Front_Store_Dto_Msg_Pers_Out.Dto}
         */
        this.createDto = function (data) {
            // init base DTO and copy it to this DTO
            const base = baseDto.createDto(data);
            const res = Object.assign(new Dto(), base);
            // then init this DTO props
            res.dateDelivered = castDate(data?.dateDelivered);
            res.recipientId = castInt(data?.recipientId);
            return res;
        }
    }
}
