// MODULE'S IMPORT
/** @type {typeof TeqFw_Web_Sw_Worker} */
import {createLogger, setup as mainSetup} from './src/@teqfw/web/Sw/Worker.mjs';

// MODULE'S VARS
// const DOOR = ''; // door is not used in the app

// MODULE'S FUNCS
/**
 * Event listener for current application. Just display notification to user.
 * @param event
 */
function onPush(event) {
    if (event.data) {
        const json = event.data.json();
        const promiseChain = self.registration.showNotification(json.title, {body: json.body});
        event.waitUntil(promiseChain);
    }
}

// MAIN

// create logger to trace installation process for Service Worker
const rnd = Math.floor(Math.random() * 1000000); // pseudo UUID to mark logs for one front on a server
const uuid = `sw-${rnd}`;
const log = createLogger(uuid);
const logFactory = (tailId) => createLogger(`${uuid}-${tailId}`);
log('[sw.js]: import is done and log related functions are created.');

// setup current service worker
mainSetup({scope: self, logFactory});
log('[sw.js]: TeqFw_Web_Sw_Worker is setup.');
self.addEventListener('push', onPush); // Safari browser has no 'push' event
log('[sw.js]: onPush event listener is setup.');
