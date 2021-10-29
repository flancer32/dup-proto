/** @type {typeof TeqFw_Web_Sw_Worker} */
import ServiceWorker from './src/@teqfw/web/Sw/Worker.mjs';
/** @type {typeof TeqFw_Web_Push_Sw_Worker} */
import WebPushWorker from './src/@teqfw/web-push/Sw/Worker.mjs';

const DOOR = '';
const sw = new ServiceWorker();
sw.setup(self, DOOR);
const swPush = new WebPushWorker();
swPush.setup(self, DOOR);
