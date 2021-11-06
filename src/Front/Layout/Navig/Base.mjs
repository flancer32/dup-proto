/**
 * Base navigation.
 *
 * @namespace Fl32_Dup_Front_Layout_Navig_Base
 */
// MODULE'S VARS
const NS = 'Fl32_Dup_Front_Layout_Navig_Base';

// MODULE'S FUNCTIONS
/**
 * TeqFW DI factory function to get dependencies for the object.
 *
 * @returns {Fl32_Dup_Front_Layout_Navig_Base.vueCompTmpl}
 */
export default function (spec) {
    /** @type {Fl32_Dup_Front_Defaults} */
    const DEF = spec['Fl32_Dup_Front_Defaults$'];


    // DEFINE WORKING VARS
    const template = `
<q-list bordered padding class="rounded-borders text-primary">

    <q-item to="${DEF.ROUTE_HOME}"
            active-class="bg-primary text-white"
            clickable
            v-ripple
    >
        <q-item-section avatar>
            <q-icon name="home"/>
        </q-item-section>
        <q-item-section>{{$t('navig.home')}}</q-item-section>
    </q-item>

    <q-item to="${DEF.ROUTE_CONTACTS}"
            active-class="bg-primary text-white"
            clickable
            v-ripple
    >
        <q-item-section avatar>
            <q-icon name="people"/>
        </q-item-section>
        <q-item-section>{{$t('navig.contacts')}}</q-item-section>
    </q-item>

    <q-item to="${DEF.ROUTE_CHAT}"
            active-class="bg-primary text-white"
            clickable
            v-ripple
    >
        <q-item-section avatar>
            <q-icon name="chat"/>
        </q-item-section>
        <q-item-section>{{$t('navig.chat')}}</q-item-section>
    </q-item>
    
    <q-item to="${DEF.ROUTE_CFG}"
            active-class="bg-primary text-white"
            clickable
            v-ripple
    >
        <q-item-section avatar>
            <q-icon name="settings"/>
        </q-item-section>
        <q-item-section>{{$t('navig.cfg')}}</q-item-section>
    </q-item>
    
    <q-item to="${DEF.ROUTE_LOGS}"
            active-class="bg-primary text-white"
            clickable
            v-ripple
    >
        <q-item-section avatar>
            <q-icon name="receipt"/>
        </q-item-section>
        <q-item-section>{{$t('navig.logs')}}</q-item-section>
    </q-item>

</q-list>
`;
    /**
     * Template to create new component instances using Vue.
     *
     * @const {Object} vueCompTmpl
     * @memberOf Fl32_Dup_Front_Layout_Navig_Base
     */
    return {
        teq: {package: DEF.SHARED.NAME},
        name: NS,
        template,
        components: {},
        data() {
            return {};
        },
        methods: {},
        async mounted() { },
    };
}
