/**
 * Events stream from server to client.
 * TODO: tmp solution (one stream per SSE handler)
 */
// MODULE'S IMPORT
import {constants as H2} from 'http2';

// MODULE'S VARS
const {
    HTTP2_HEADER_CACHE_CONTROL,
    HTTP2_HEADER_CONTENT_TYPE,
    HTTP_STATUS_OK,
} = H2;

export default class Fl32_Dup_Back_SSE_Stream {
    constructor(spec) {
        // EXTRACT DEPS
        /** @type {Fl32_Dup_Back_Defaults} */
        const DEF = spec['Fl32_Dup_Back_Defaults$'];
        /** @type {Fl32_Dup_Back_Handler_SSE_Registry} */
        const registry = spec['Fl32_Dup_Back_Handler_SSE_Registry$'];
        /** @type {Fl32_Dup_Shared_SSE_Authorize} */
        const dtoAuth = spec['Fl32_Dup_Shared_SSE_Authorize$'];
        /** @type {Fl32_Dup_Back_Handler_SSE_DTO_Registry_Item} */
        const metaDtoRegItem = spec['Fl32_Dup_Back_Handler_SSE_DTO_Registry_Item$'];


        // DEFINE WORKING VARS / PROPS
        // DEFINE INNER FUNCTIONS
        // DEFINE INSTANCE METHODS
        this.act = function (req, res) {
            // save connection data to SSE registry
            const item = metaDtoRegItem.createDto();
            item.messageId = 1;
            const connId = registry.add(item);

            // add handler to remove closed connection from registry
            res.addListener('close', () => {
                registry.remove(connId);
            });
            res.writeHead(HTTP_STATUS_OK, {
                [HTTP2_HEADER_CONTENT_TYPE]: 'text/event-stream',
                [HTTP2_HEADER_CACHE_CONTROL]: 'no-cache',
            });

            return new Promise((resolve, reject) => {
                // DEFINE INNER FUNCTIONS
                // create functions to process outgoing events for this connection
                function respond(payload, msgId, event) {
                    if (event) res.write(`event: ${event}\n`);
                    res.write(`data: ${JSON.stringify(payload)}\n\n`);
                }

                // ... function to close SSE connection (if it is opened)
                function close(payload) {
                    res.end(payload);
                    resolve();
                }

                // MAIN FUNCTIONALITY
                item.respond = respond;
                item.close = close;

                const auth = dtoAuth.createDto();
                auth.connectionId = connId;
                auth.payload = 'useItOrRemoveIt!';
                registry.sendMessage(connId, auth, 'authorize');
                // close connection if not authorized
                setTimeout(() => {
                    if (item.state === undefined) {
                        item.close();
                        console.log(`Connection '${item.connectionId}' is not authorized and is cosed by timeout.`);
                    }
                }, 5000);
            });
        }
    }
}
