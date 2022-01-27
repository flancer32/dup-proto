// MODULE'S IMPORT
/** @type {typeof TeqFw_Web_Sw_Worker} */
import ServiceWorker from './src/@teqfw/web/Sw/Worker.mjs';
/** @type {typeof TeqFw_Web_Push_Sw_Worker} */
// import WebPushWorker from './src/@teqfw/web-push/Sw/Worker.mjs';

// MODULE'S VARS
const DOOR = '';
const RAND = Math.floor(Math.random() * 1000000); // pseudo UUID to mark one front logs on a server
const dtoLog = {
    data: {body: 'empty'},
    meta: {
        frontUUID: `sw-${RAND}`,
        name: 'TeqFw_Web_Shared_Event_Front_Log',
    },
};

// MODULE'S FUNCTIONS
function log(msg) {
    dtoLog.data.body = msg;
    fetch(`./efb/TeqFw_Web_Shared_Event_Front_Log`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dtoLog),
    });
}

// MAIN
self.logToServer = log;
log(`[sw.js]: import is done.`);
const sw = new ServiceWorker();
sw.setup(self, DOOR);
log(`[sw.js]: TeqFw_Web_Sw_Worker is created and setup`);
// const swPush = new WebPushWorker();
// swPush.setup(self, DOOR);
// log(`[sw.js]: TeqFw_Web_Push_Sw_Worker is created and setup`);
