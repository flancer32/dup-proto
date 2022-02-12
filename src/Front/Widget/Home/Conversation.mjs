/**
 * 'Home' route.
 *
 * @namespace Fl32_Dup_Front_Widget_Home_Conversation
 */
// MODULE'S VARS
const NS = 'Fl32_Dup_Front_Widget_Home_Conversation';

// MODULE'S FUNCTIONS
/**
 * Factory to create template for new Vue component instances.
 *
 * @returns {Fl32_Dup_Front_Widget_Home_Conversation.vueCompTmpl}
 */
export default function (spec) {
    /** @type {Fl32_Dup_Front_Defaults} */
    const DEF = spec['Fl32_Dup_Front_Defaults$'];
    /** @type {typeof Fl32_Dup_Front_Dto_Home_Conversation.Dto} */
    const TDtoConv = spec['Fl32_Dup_Front_Dto_Home_Conversation.Dto'];
    /** @type {TeqFw_Core_Shared_Util.formatDateTime|function} */
    const formatDateTime = spec['TeqFw_Core_Shared_Util.formatDateTime'];

    // WORKING VARS
    const template = `
<q-card>
    <q-card-section class="q-gutter-xs">
        <div class="row items-center q-gutter-xs">
            <div class="col-auto">
                <q-avatar color="primary" text-color="white">{{ avatarLetter }}</q-avatar>
            </div>
            <div class="text-h6 col">{{ item.name }}</div>
            <div class="text-subtitle2 col-auto">{{ timestamp }}</div>
        </div>
        <div class="row items-center q-gutter-xs">
            <div class="col">
                {{ message }}
            </div>
            <div class="col-auto">
                 <q-avatar 
                 size="24px" 
                 v-if="unread>0"
                 color="green">{{ unread }}</q-avatar>
            </div>
        </div>
    </q-card-section>
</q-card>

`;
    /**
     * Template to create new component instances using Vue.
     *
     * @const {Object} vueCompTmpl
     * @memberOf Fl32_Dup_Front_Widget_Home_Conversation
     */
    return {
        teq: {package: DEF.SHARED.NAME},
        name: NS,
        template,
        data() {
            return {};
        },
        props: {
            /** @type {Fl32_Dup_Front_Dto_Home_Conversation.Dto} */
            item: TDtoConv,
        },
        computed: {
            avatarLetter() {
                return (typeof this?.item?.name === 'string')
                    ? this.item.name[0]
                    : '?';
            },
            message() {
                let res = '';
                if (typeof this?.item?.message === 'string') {
                    if (this.item.message < 128) res = this.item.message;
                    else {
                        res = `${this.item.message.substr(0, 125)}...`;
                    }
                }
                return res;
            },
            timestamp() {
                let res = '';
                if (this?.item?.time instanceof Date) {
                    const formatted = formatDateTime(this.item.time, false);
                    res = formatted.substr(5);
                }
                return res;
            },
            unread() {
                return this?.item?.unread;
            },
        },
        async mounted() {

        }
    };
}
