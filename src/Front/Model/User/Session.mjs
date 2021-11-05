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
        /** @type {Fl32_Dup_Front_Store_User.Dto} */
        let _currentUser;
        const bp = 5;
        // DEFINE INSTANCE METHODS

        this.checkUserAuthenticated = async function (router) {
            if (!_currentUser) {
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
                    return false;
                }
                _currentUser = dto;
            }
            return true;
        }

        this.close = async function () {
            _currentUser = undefined;
            return Promise.resolve(undefined);
        }
        /**
         * @return {Fl32_Dup_Front_Store_User.Dto}
         */
        this.getUser = function () {
            return _currentUser;
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
