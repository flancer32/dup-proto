/**
 * Add sender card to contacts and send own card back.
 *
 * @namespace Fl32_Dup_Front_Ui_Invite_Validate_Contact
 */
// MODULE'S VARS
const NS = 'Fl32_Dup_Front_Ui_Invite_Validate_Contact';
const EVT_DONE = 'onDone';

// MODULE'S FUNCTIONS
/**
 * TeqFW DI factory function to get dependencies for the object.
 *
 * @returns {Fl32_Dup_Front_Ui_Invite_Validate_Contact.vueCompTmpl}
 */
export default function (spec) {
    /** @type {Fl32_Dup_Front_Defaults} */
    const DEF = spec['Fl32_Dup_Front_Defaults$'];
    /** @type {Fl32_Dup_Front_Mod_Contacts} */
    const modContacts = spec['Fl32_Dup_Front_Mod_Contacts$'];

    // VARS
    const template = `
<q-card class="bg-white" style="min-width:245px">
    <q-card-section v-if="displayInviteData">
        <div class="text-subtitle2 text-center">{{$t('wg.invite.validate.contact.title')}}:</div>
        <div class="text-subtitle2 text-center">{{nick}}</div>
        <q-card-actions align="center">
            <q-btn :label="$t('btn.accept')" padding="xs lg" :disable="freezeAccept" v-on:click="accept"></q-btn>
        </q-card-actions>
    </q-card-section>
    <q-card-section v-if="displayAdded">
        <div class="text-subtitle2 text-center">{{$t('wg.invite.validate.contact.added', {id: contactId})}}</div>
    </q-card-section>
    <q-card-section v-if="displayUpdated">
        <div class="text-subtitle2 text-center">{{$t('wg.invite.validate.contact.updated', {id: contactId})}}</div>
    </q-card-section>
</q-card>
`;
    // MAIN
    /**
     * Template to create new component instances using Vue.
     *
     * @const {Object} vueCompTmpl
     * @memberOf Fl32_Dup_Front_Ui_Invite_Validate_Contact
     */
    return {
        teq: {package: DEF.SHARED.NAME},
        name: NS,
        template,
        data() {
            return {
                contactId: null,
                displayAdded: false,
                displayInviteData: true,
                displayUpdated: false,
                freezeAccept: false,
            };
        },
        props: {
            nick: String,
            publicKey: String,
            userId: Number,
        },
        methods: {
            async accept() {
                this.freezeAccept = true;
                const res = await modContacts.add({
                    nick: this.nick,
                    publicKey: this.publicKey,
                    userId: this.userId,
                });
                if (res.contactId) {
                    this.contactId = res.contactId;
                    this.displayInviteData = false;
                    this.displayAdded = !res.alreadyExists;
                    this.displayUpdated = res.alreadyExists;
                }
                this.freezeAccept = false;
                setTimeout(() => {
                    this.displayInviteData = true;
                    this.displayAdded = false;
                    this.displayUpdated = false;
                    this.$emit(EVT_DONE);
                }, DEF.TIMEOUT_UI_DELAY);
            },
        },
        emits: [EVT_DONE],
    };
}
