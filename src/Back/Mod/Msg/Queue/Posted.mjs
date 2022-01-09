/**
 * Queue to save posted messages on the server.
 *
 * @namespace Fl32_Dup_Back_Mod_Msg_Queue_Posted
 */
// MODULE'S IMPORT
import {v4} from 'uuid';

// MODULE'S VARS
const NS = 'Fl32_Dup_Back_Mod_Msg_Queue_Posted';

// MODULE'S CLASSES
export default class Fl32_Dup_Back_Mod_Msg_Queue_Posted {
    constructor(spec) {
        // EXTRACT DEPS

        // ENCLOSED VARS
        const _store = new Map();

        // MAIN

        // ENCLOSED FUNCTIONS

        // INSTANCE METHODS
        this.add = function (data) {
            const key = v4();
            _store.set(key, data);
            return key;
        }
        this.remove = function () {}
    }
}

// MODULE'S FUNCTIONS

// MODULE'S MAIN
