/**
 * Logging transport implementation for back app.
 * Send logs to log monitoring server.
 */
// MODULE'S IMPORT
import http from "https";

// MODULE'S CLASSES
/**
 * @implements TeqFw_Core_Shared_Api_Logger_ITransport
 */
export default class Fl32_Dup_Back_Mod_Logger_Transport {
    constructor(spec) {
        // DEPS
        /** @type {Fl32_Dup_Back_Defaults} */
        const DEF = spec['Fl32_Dup_Back_Defaults$'];
        /** @type {TeqFw_Core_Back_Config} */
        const config = spec['TeqFw_Core_Back_Config$'];
        /** @type {TeqFw_Core_Shared_Mod_Logger_Transport_Console} */
        const transConsole = spec['TeqFw_Core_Shared_Mod_Logger_Transport_Console$'];
        /** @type {Fl32_Dup_Shared_Dto_Log_Request} */
        const dtoReq = spec['Fl32_Dup_Shared_Dto_Log_Request$'];
        /** @type {typeof TeqFw_Web_Shared_Enum_Log_Type} */
        const TYPE = spec['TeqFw_Web_Shared_Enum_Log_Type$'];

        // VARS
        let _canSendLogs;

        // MAIN
        /** @type {Fl32_Dup_Back_Dto_Config_Local} */
        const cfg = config.getLocal(DEF.SHARED.NAME);
        /** @type {TeqFw_Core_Back_Api_Dto_Config_Local} */
        const cfgCore = config.getLocal(DEF.MOD_CORE.SHARED.NAME);
        const HOSTNAME = cfg.logsMonitor;
        _canSendLogs = cfgCore.devMode;

        // INSTANCE METHODS
        /**
         * @param {TeqFw_Core_Shared_Dto_Log.Dto} dto
         */
        this.log = function (dto) {
            if (_canSendLogs)
                try {
                    // compose WAPI DTO to send data to logs monitor
                    const entry = dtoReq.createDto();
                    entry.date = dto.date;
                    entry.message = dto.message;
                    entry.source = dto.source;
                    entry.level = (dto.isError) ? 1 : 0;
                    entry.meta = dto.meta ?? {};
                    // default type is 'back'
                    entry.meta[DEF.SHARED.LOG_META_TYPE] = entry.meta[DEF.SHARED.LOG_META_TYPE] ?? TYPE.BACK;
                    // send log entry to logs monitor
                    const postData = JSON.stringify({data: entry});
                    const options = {
                        hostname: HOSTNAME,
                        path: '/api/@flancer64/pwa_log_agg/add',
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Content-Length': Buffer.byteLength(postData)
                        }
                    };
                    // just write out data w/o response processing
                    const req = http.request(options, (res) => {
                        if (res.statusCode !== 200)
                            _canSendLogs = false;
                    });
                    req.on('error', (e) => {
                        if (e.code === 'ECONNREFUSED') {
                            _canSendLogs = false;
                        } else {
                            console.error(`problem with request: ${e.message}`);
                        }
                    });
                    req.write(postData);
                    req.end();
                } catch (e) {
                    _canSendLogs = false;
                }
            // duplicate to console
            transConsole.log(dto);
        }

        this.enableLogs = () => _canSendLogs = true;

        this.disableLogs = () => _canSendLogs = false;

        this.isLogsMonitorOn = () => _canSendLogs;
    }
}
