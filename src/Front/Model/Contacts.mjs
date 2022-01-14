/**
 * Model for list of users contacts.
 * TODO: move reactive attributes to to Rx
 *
 * @namespace Fl32_Dup_Front_Model_Contacts
 */
export default class Fl32_Dup_Front_Model_Contacts {
    constructor(spec) {
        // EXTRACT DEPS
        const {ref} = spec['TeqFw_Vue_Front_Lib_Vue'];
        /** @type {TeqFw_Web_Front_App_Connect_WAPI} */
        const gate = spec['TeqFw_Web_Front_App_Connect_WAPI$'];
        /** @type {Fl32_Dup_Shared_WAPI_User_List.Factory} */
        const wapiUsers = spec['Fl32_Dup_Shared_WAPI_User_List.Factory$'];
        /** @type {Fl32_Dup_Front_Dto_Contacts_Card} */
        const dtoCard = spec['Fl32_Dup_Front_Dto_Contacts_Card$'];
        /** @type {TeqFw_User_Front_DSource_User} */
        const dsUser = spec['TeqFw_User_Front_DSource_User$'];

        // DEFINE WORKING VARS / PROPS
        /** @type {Fl32_Dup_Front_Dto_Contacts_Card.Dto[]} */
        const _data = ref([]);
        const A_CARD = dtoCard.getAttributes();

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

        this.loadFromServer = async function () {
            const userCurrent = await dsUser.get();
            const userId = userCurrent.id;
            /** @type {Fl32_Dup_Shared_WAPI_User_List.Request} */
            const req = wapiUsers.createReq();
            /** @type {Fl32_Dup_Shared_WAPI_User_List.Response} */
            const res = await gate.send(req, wapiUsers);
            const update = [];
            for (const key of Object.keys(res?.cards)) {
                const wapi = res.cards[key];
                if (wapi.userId === userId) continue;
                // noinspection JSCheckFunctionSignatures
                const card = dtoCard.createDto({[A_CARD.WAPI_CARD]: wapi});
                update.push(card);
            }
            this.setValues(update);
        }

        // MAIN FUNCTIONALITY
    }

}
