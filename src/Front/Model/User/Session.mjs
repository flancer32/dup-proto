/**
 * @implements TeqFw_User_Front_Api_ISession
 */
export default class Fl32_Dup_Front_Model_User_Session {
    constructor() {
        // EXTRACT DEPS

        // DEFINE WORKING VARS / PROPS
        let _routeRedirect, _routeSignIn;

        // DEFINE INSTANCE METHODS
        this.checkUserAuthenticated = async function (router) {
            if (
                (typeof router?.push === 'function') &&
                (typeof _routeSignIn === 'string')
            ) {
                router.push(_routeSignIn);
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
