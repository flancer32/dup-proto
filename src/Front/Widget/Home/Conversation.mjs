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
    /** @type {TeqFw_Core_Shared_Util_Format.dateTime|function} */
    const formatDateTime = spec['TeqFw_Core_Shared_Util_Format.dateTime'];

    // WORKING VARS
    const template = `
<q-card class="col">
    <q-card-section class="q-gutter-xs">
        <div class="row items-center q-gutter-xs">
            <div class="col-auto" v-on:click="goToContact">
                <q-avatar color="primary" text-color="white">{{ avatarLetter }}</q-avatar>
            </div>
            <div class="text-h6 col ellipsis" v-on:click="goToChat">{{ item.name }}</div>
            <div class="text-subtitle2 col-auto" v-on:click="goToChat">{{ timestamp }}</div>
        </div>
        <div class="row items-center q-gutter-xs" v-on:click="goToChat">
            <div class="col">
                {{ message }}
            </div>
            <div class="col-auto">
                <q-avatar
                        size="8px"
                        v-if="unread"
                        color="green"/>
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
                    res = formatted.substring(5);
                }
                return res;
            },
            unread() {
                return this?.item?.unread;
            },
        },
        methods: {
            goToChat() {
                const route = DEF.ROUTE_CHAT_BAND.replace(':id', this.item.bandId);
                this.$router.push(route);
            },
            goToContact() {
                const route = DEF.ROUTE_CONTACTS_CARD.replace(':id', this.item.contactId);
                this.$router.push(route);
            },
        },
    };
}
