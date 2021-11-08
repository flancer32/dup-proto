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
    /** @type {Fl32_Dup_Front_Store_Db} */
    const db = spec['Fl32_Dup_Front_Store_Db$'];
    /** @type {Fl32_Dup_Front_Store_Entity_Msg} */
    const metaMsg = spec['Fl32_Dup_Front_Store_Entity_Msg$'];
    /** @type {Fl32_Dup_Front_Store_Entity_Msg_Band} */
    const metaBand = spec['Fl32_Dup_Front_Store_Entity_Msg_Band$'];

    // DEFINE WORKING VARS
    const template = `
<layout-base>
<!--    <q-card class="bg-white q-mt-xs" style="min-width:245px">-->
<!--        <q-card-actions align="center">-->
<!--            <q-btn :label="$t('btn.ok')" padding="xs lg" v-on:click="test"></q-btn>-->
<!--        </q-card-actions>-->
<!--    </q-card>-->
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
            async test() {
                // sseChannel.open();
                // setTimeout(() => sseChannel.close(), 10000);
                // const A_MSG = metaMsg.getAttributes();
                // /** @type {TeqFw_Web_Front_Store_IDB} */
                // const idb = db.getDb();
                // await idb.open();
                // const trx = await idb.startTransaction([metaMsg, metaBand]);
                // const idBand = await idb.add(trx, metaBand, {});
                // const idMsg = await idb.add(trx, metaMsg, {[A_MSG.BAND_ID]: idBand});
                // const bp = true;
                // trx.commit();
            }
        },
    };
}
