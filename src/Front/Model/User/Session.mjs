/**
 * @implements TeqFw_User_Front_Api_ISession
 */
export default class Fl32_Dup_Front_Model_User_Session {

    constructor(spec) {
        // EXTRACT DEPS
        /** @type {TeqFw_Web_Front_Store} */
        const store = spec['TeqFw_Web_Front_Store$'];
        /** @type {Fl32_Dup_Front_Store_Entity_User} */
        const metaUser = spec['Fl32_Dup_Front_Store_Entity_User$'];

        // DEFINE WORKING VARS / PROPS
        let _router, _routeRedirect, _routeSignIn;
        /** @type {Fl32_Dup_Front_Store_Entity_User.Dto} */
        let _currentUser;

        // DEFINE INSTANCE METHODS

        this.checkUserAuthenticated = async function (router) {
            if (!_currentUser) {
                // noinspection JSValidateTypes
                /** @type {Fl32_Dup_Front_Store_Entity_User.Dto} */
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
        }

        this.deleteUser = async function () {
            _currentUser = undefined;
            await store.delete(metaUser.getEntityName());
        }

        /**
         * @return {Fl32_Dup_Front_Store_Entity_User.Dto}
         */
        this.getUser = function () {
            return _currentUser;
        }

        this.open = async function (router = null) {
            if (router) _router = router;
            await this.checkUserAuthenticated(_router);
        }

        this.reopen = async function (route = null) {
            _currentUser = undefined;
            await this.checkUserAuthenticated(_router);
            if (_router && route) _router.push(route);
        }

        this.setRouteToRedirect = function (route) {
            _routeRedirect = route;
        }

        this.setRouteToSignIn = function (route) {
            _routeSignIn = route;
        }
    }

}
