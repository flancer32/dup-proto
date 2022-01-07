/**
 * DataSource for hollow state (free or occupied).
 *
 * This data source is initialized once, when front is started.
 * It's required to set state manually when first user is registered because state is cached in IndexedDb.
 *
 */
// MODULE'S VARS
const ATTEMPTS = 4; // number of attempts to get response event from backend
const TIMEOUT = 2000; // between events messages to backend

// MODULE'S CLASSES
export default class Fl32_Dup_Front_DSource_Hollow_IsFree {
    constructor(spec) {
        // EXTRACT DEPS
        /** @type {Fl32_Dup_Front_Defaults} */
        const DEF = spec['Fl32_Dup_Front_Defaults$'];
        /** @type {TeqFw_Web_Front_Store} */
        const store = spec['TeqFw_Web_Front_Store$'];
        /** @type {TeqFw_Web_Front_App_UUID} */
        const frontUUID = spec['TeqFw_Web_Front_App_UUID$'];
        /** @type {TeqFw_Web_Front_App_Event_Queue} */
        const eventsQueue = spec['TeqFw_Web_Front_App_Event_Queue$'];
        /** @type {TeqFw_Web_Front_App_Event_Embassy} */
        const backEmbassy = spec['TeqFw_Web_Front_App_Event_Embassy$'];
        /** @type {Fl32_Dup_Shared_Event_Front_Hollow_State_Requested} */
        const esfStateRequested = spec['Fl32_Dup_Shared_Event_Front_Hollow_State_Requested$'];
        /** @type {Fl32_Dup_Shared_Event_Back_Hollow_State_Composed} */
        const esbStateComposed = spec['Fl32_Dup_Shared_Event_Back_Hollow_State_Composed$'];

        // DEFINE WORKING VARS / PROPS
        const STORE_KEY = `${DEF.SHARED.NAME}/back/hollow/is_free`;
        let _value;

        // DEFINE INSTANCE METHODS
        this.get = () => _value;
        this.set = async (data) => {
            _value = data;
            await store.set(STORE_KEY, data);
        }
        this.init = async function () {

            // DEFINE INNER FUNCTIONS
            function requestHollowState() {
                return new Promise((resolve) => {
                    const payload = esfStateRequested.createDto();
                    payload.frontUUID = frontUUID.get();
                    let i = 0;
                    const intId = setInterval(() => {
                        eventsQueue.add(esfStateRequested.getName(), payload);
                        if (i++ > ATTEMPTS) {
                            clearInterval(intId);
                            resolve(null);
                        }
                    }, TIMEOUT);

                    backEmbassy.subscribe(
                        esbStateComposed.getName(),
                        /**
                         * @param {Fl32_Dup_Shared_Event_Back_Hollow_State_Composed.Dto} evt
                         */
                        (evt) => {
                            if (intId) clearInterval(intId);
                            resolve(evt.hollowIsFree);
                        }
                    );
                });

            }

            // MAIN FUNCTIONALITY
            const value = await store.get(STORE_KEY);
            if (typeof value === 'boolean') {
                _value = value;
            } else {
                _value = await requestHollowState();
                await store.set(STORE_KEY, _value);
            }
            return _value;
        }
    }
}
