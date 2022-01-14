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
        /** @type {TeqFw_Web_Front_App_Connect_Event_Direct_Portal} */
        const portalBack = spec['TeqFw_Web_Front_App_Connect_Event_Direct_Portal$'];
        /** @type {TeqFw_Web_Front_App_Event_Bus} */
        const eventsFront = spec['TeqFw_Web_Front_App_Event_Bus$'];
        /** @type {Fl32_Dup_Shared_Event_Front_Hollow_State_Requested} */
        const esfStateRequested = spec['Fl32_Dup_Shared_Event_Front_Hollow_State_Requested$'];
        /** @type {Fl32_Dup_Shared_Event_Back_Hollow_State_Composed} */
        const esbStateComposed = spec['Fl32_Dup_Shared_Event_Back_Hollow_State_Composed$'];

        // DEFINE WORKING VARS / PROPS
        const STORE_KEY = `${DEF.SHARED.NAME}/back/hollow/is_free`;
        let _cache;

        // DEFINE INSTANCE METHODS
        this.clean = async () => {
            _cache = undefined;
            await store.delete(STORE_KEY);
        }
        this.get = () => _cache;
        this.set = async (data) => {
            _cache = data;
            await store.set(STORE_KEY, data);
        }
        this.init = async function () {

            // DEFINE INNER FUNCTIONS
            function requestHollowState() {
                return new Promise((resolve) => {
                    const message = esfStateRequested.createDto();
                    portalBack.publish(message); // send first message
                    let i = 0;
                    const intId = setInterval(() => {
                        portalBack.publish(message);
                        if (i++ > ATTEMPTS) {
                            clearInterval(intId);
                            resolve(null);
                        }
                    }, TIMEOUT);

                    eventsFront.subscribe(
                        esbStateComposed.getEventName(),
                        /**
                         * @param {Fl32_Dup_Shared_Event_Back_Hollow_State_Composed.Dto} data
                         */
                        ({data}) => {
                            if (intId) clearInterval(intId);
                            resolve(data.hollowIsFree);
                        }
                    );
                });

            }

            // MAIN FUNCTIONALITY
            const value = await store.get(STORE_KEY);
            if (typeof value === 'boolean') {
                _cache = value;
            } else {
                _cache = await requestHollowState();
                await store.set(STORE_KEY, _cache);
            }
            return _cache;
        }
    }
}
