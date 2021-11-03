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

    // DEFINE WORKING VARS
    const template = `
<layout-base>
    <q-card class="t-bg-white" style="min-width:245px">
        <q-card-actions align="center">
            <q-btn :label="$t('btn.ok')" padding="xs lg" v-on:click="test"></q-btn>
        </q-card-actions>
    </q-card>
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
        components: {},
        data() {
            return {};
        },
        methods: {
            test() {
                const evtSource = new EventSource('./sse/channel');
                evtSource.onmessage = function (e) {
                    console.log(`message`);
                    console.dir(e.data);
                }
                evtSource.onerror = function (e) {
                    console.log(`error`);
                    console.dir(e);
                    evtSource.close();
                }
                evtSource.onclose = function (e) {
                    console.log(`close`);
                    console.dir(e);
                }
                console.log(`testing...`);
            }
        },
    };
}
