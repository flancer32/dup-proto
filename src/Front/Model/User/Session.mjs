/**
 * @implements TeqFw_User_Front_Api_ISession
 */
export default class Fl32_Dup_Front_Model_User_Session {

    constructor(spec) {
        // EXTRACT DEPS
        /** @type {TeqFw_Web_Front_Store} */
        const store = spec['TeqFw_Web_Front_Store$'];
        /** @type {Fl32_Dup_Front_Store_User} */
        const metaUser = spec['Fl32_Dup_Front_Store_User$'];

        // DEFINE WORKING VARS / PROPS
        let _routeRedirect, _routeSignIn;

        // DEFINE INSTANCE METHODS
        this.checkUserAuthenticated = async function (router) {
            // noinspection JSValidateTypes
            /** @type {Fl32_Dup_Front_Store_User.Dto} */
            const dto = await store.get(metaUser.getEntityName());
            if (!dto?.id) {
                if (
                    (typeof router?.push === 'function') &&
                    (typeof _routeSignIn === 'string')
                ) {
                    router.push(_routeSignIn);
                }
            }
        }

        this.close = async function () {
            return Promise.resolve(undefined);
        }

        this.getUser = function () {
        }

        this.open = async function ({router}) {
            await this.checkUserAuthenticated(router);
        }

        this.setRouteToRedirect = function (route) {
            _routeRedirect = route;
        }

        this.setRouteToSignIn = function (route) {
            _routeSignIn = route;
        }
    }

}
