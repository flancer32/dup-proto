/**
 * @implements TeqFw_User_Front_Api_ISession
 */
export default class Fl32_Dup_Front_Model_User_Session {

    constructor(spec) {
        // EXTRACT DEPS
        /** @type {TeqFw_Web_Front_App_Connect_Event_Reverse} */
        const eventStreamReverse = spec['TeqFw_Web_Front_App_Connect_Event_Reverse$'];
        /** @type {TeqFw_Web_Front_Store} */
        const store = spec['TeqFw_Web_Front_Store$'];
        /** @type {Fl32_Dup_Front_Store_Single_User} */
        const metaUser = spec['Fl32_Dup_Front_Store_Single_User$'];
        /** @type {Fl32_Dup_Front_DSource_Hollow_IsFree} */
        const dsHollowIsFree = spec['Fl32_Dup_Front_DSource_Hollow_IsFree$'];

        // DEFINE WORKING VARS / PROPS
        let _router, _routeRedirect, _routeSignIn;
        /** @type {Fl32_Dup_Front_Store_Single_User.Dto} */
        let _currentUser;

        // DEFINE INSTANCE METHODS

        this.checkUserAuthenticated = async function () {
            const isHollowFree = dsHollowIsFree.get();
            if (isHollowFree) {
                _router.push(_routeSignIn);
                return false;
            }
            if (!_currentUser) {
                // noinspection JSValidateTypes
                /** @type {Fl32_Dup_Front_Store_Single_User.Dto} */
                const dto = await store.get(metaUser.getEntityName());
                if (!dto?.id) {
                    if (
                        (typeof _router?.push === 'function') &&
                        (typeof _routeSignIn === 'string')
                    ) {
                        const route = _router?.currentRoute?.value;
                        const requiresAuth = route?.meta?.requiresAuth ?? true;
                        const isHome = (route?.path === '/');
                        const isFirstHome = (route?.matched?.length === 0);
                        const isSignIn = (route?.path === _routeSignIn);
                        if (requiresAuth && !isSignIn)
                            _router.push(_routeSignIn);
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
         * @return {Fl32_Dup_Front_Store_Single_User.Dto}
         */
        this.getUser = function () {
            return _currentUser;
        }
        /**
         * @return {number}
         */
        this.getUserId = function () {
            return _currentUser?.id;
        }

        this.open = async function () {
            if (!eventStreamReverse.stateOpen() && self.navigator.onLine)
                eventStreamReverse.open();
            await this.checkUserAuthenticated();
        }

        this.reopen = async function (route = null) {
            _currentUser = undefined;
            await this.checkUserAuthenticated();
            if (_router && route) _router.push(route);
        }

        this.setRouter = function (router) {
            _router = router;
        }
        this.setRouteToRedirect = function (route) {
            _routeRedirect = route;
        }

        this.setRouteToSignIn = function (route) {
            _routeSignIn = route;
        }
    }

}
