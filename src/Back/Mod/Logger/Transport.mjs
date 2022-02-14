/**
 * Logging transport implementation for this app.
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

        // INSTANCE METHODS
        this.log = function (dto) {
            const postData = JSON.stringify({
                data: {
                    message: dto.message,
                    meta: {
                        date: dto.date,
                        error: dto.isError,
                        source: dto.source,
                        opts: dto.meta,
                    }
                }
            });
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
            const req = http.request(options, (res) => {
                // console.log(`STATUS: ${res.statusCode}`);
                // console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
                // res.setEncoding('utf8');
                // res.on('data', (chunk) => {
                //     console.log(`BODY: ${chunk}`);
                // });
                // res.on('end', () => {
                //     console.log('No more data in response.');
                // });
            });
            req.on('error', (e) => {
                console.error(`problem with request: ${e.message}`);
            });

            // Write data to request body
            req.write(postData);
            req.end();
            // duplicate to console
            transConsole.log(dto);
        }
    }
}
