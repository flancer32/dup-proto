/**
 * 'Home' route.
 *
 * @namespace Fl32_Dup_Front_Widget_Home_Route
 */
// MODULE'S VARS
const NS = 'Fl32_Dup_Front_Widget_Home_Route';

// MODULE'S FUNCTIONS
/**
 * Factory to create template for new Vue component instances.
 *
 * @returns {Fl32_Dup_Front_Widget_Home_Route.vueCompTmpl}
 */
export default function (spec) {
    /** @type {Fl32_Dup_Front_Defaults} */
    const DEF = spec['Fl32_Dup_Front_Defaults$'];
    /** @type {Fl32_Dup_Front_DSource_User_Profile} */
    const dsProfile = spec['Fl32_Dup_Front_DSource_User_Profile$'];

    // WORKING VARS
    const template = `
<layout-base>
    <div class="row justify-center items-center" style="height: calc(100vh - 100px)">

        <q-card class="bg-white q-mt-xs col text-center" style="max-width:300px">
            <q-card-section class="text-subtitle1">
                <div>DUPLO is a secured messenger.</div>
                <div>Welcome to the hollow, {{name}}!</div>
            </q-card-section>
        </q-card>

    </div>
</layout-base>
`;
    /**
     * Template to create new component instances using Vue.
     *
     * @const {Object} vueCompTmpl
     * @memberOf Fl32_Dup_Front_Widget_Home_Route
     */
    return {
        teq: {package: DEF.SHARED.NAME},
        name: NS,
        template,
        data() {
            return {
                name: null
            };
        },
        async mounted() {
            const user = await dsProfile.get();
            this.name = user?.username;
        }
    };
}
