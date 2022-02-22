/**
 * Enumeration for state of chat message.
 */
const Fl32_Dup_Front_Enum_Msg_State = {
    NOT_SENT: 10, // message is saved in outgoing queue
    ON_SERVER: 20, // message is sent to server
    DELIVERED: 30, // message is delivered to recipient
    READ: 40, // message is read by recipient
}

Object.freeze(Fl32_Dup_Front_Enum_Msg_State);
export default Fl32_Dup_Front_Enum_Msg_State;
