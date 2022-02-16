/**
 * Logging transport implementation for this app.
 * Send logs to logs monitoring server.
 */
// MODULE'S IMPORT
import http from "http";

// MODULE'S CLASSES
/**
 * @implements TeqFw_Core_Shared_Api_Logger_ITransport
 */
export default class Fl32_Dup_Back_Mod_Logger_Transport {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Core_Shared_Mod_Logger_Transport_Console} */
        const transConsole = spec['TeqFw_Core_Shared_Mod_Logger_Transport_Console$'];
        /** @type {Fl32_Dup_Back_Mod_Logger_Transport_A_Request} */
        const dtoReq = spec['Fl32_Dup_Back_Mod_Logger_Transport_A_Request$'];

        // INSTANCE METHODS
        /**
         * @param {TeqFw_Core_Shared_Dto_Log.Dto} dto
         */
        this.log = function (dto) {
            const entry = dtoReq.createDto();
            entry.date = dto.date;
            entry.message = dto.message;
            entry.source = dto.source;
            entry.level = (dto.isError) ? 1 : 0;
            entry.meta = dto.meta;
            const postData = JSON.stringify({data: entry});
            const options = {
                hostname: 'localhost',
                port: 4040,
                path: '/api/@flancer64/pwa_log_agg/add',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(postData)
                }
            };
            // just write out data w/o response processing
            const req = http.request(options);
            req.write(postData);
            req.end();
            // duplicate to console
            transConsole.log(dto);
        }
    }
}
