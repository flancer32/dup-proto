/**
 * Experimental SSE (Server Side Events) handler ([processor|dispatcher]???).
 * Try to use function factory instead of class factory.
 *
 * @namespace Fl32_Dup_Back_Handler_SSE
 */
// MODULE'S IMPORT
import {constants as H2} from 'http2';

// MODULE'S VARS
const NS = 'Fl32_Dup_Back_Handler_SSE';

// MODULE'S FUNCTIONS
/**
 * Factory to setup execution context and to create handler.
 *
 * @implements TeqFw_Web_Back_Api_Request_IHandler.Factory
 * @memberOf TeqFw_Web_Back_Plugin_Web_Handler_Static
 */
export default function (spec) {
    // EXTRACT DEPS
    /** @type {Fl32_Dup_Back_Defaults} */
    const DEF = spec['Fl32_Dup_Back_Defaults$'];
    /** @type {TeqFw_Web_Back_Model_Address} */
    const mAddress = spec['TeqFw_Web_Back_Model_Address$'];
    /** @type {Fl32_Dup_Back_Handler_SSE_Registry} */
    const registry = spec['Fl32_Dup_Back_Handler_SSE_Registry$'];
    /** @type {Fl32_Dup_Shared_SSE_Authorize} */
    const dtoAuth = spec['Fl32_Dup_Shared_SSE_Authorize$'];
    /** @type {Fl32_Dup_Back_Handler_SSE_DTO_Registry_Item} */
    const metaDtoRegItem = spec['Fl32_Dup_Back_Handler_SSE_DTO_Registry_Item$'];

    // DEFINE INNER FUNCTIONS
    /**
     * Action to process web request for static files.
     *
     * @param {TeqFw_Web_Back_Api_Request_IContext} context
     * @returns {Promise<void>}
     * @memberOf Fl32_Dup_Back_Handler_SSE
     */
    async function handle(context) {
        /** @type {TeqFw_Web_Back_Api_Request_IContext} */
        const ctx = context; // IDEA is failed with 'context' help (suggestions on Ctrl+Space)
        if (!ctx.isRequestProcessed()) {
            // process only unprocessed requests
            const path = ctx.getPath();
            const address = mAddress.parsePath(path);
            if (address.space === DEF.SHARED.SPACE_SSE) {
                // pin connection stream to the current scope ...
                /** @type {ServerHttp2Stream} */
                const stream = ctx.getStream();

                // ... and create functions to process outgoing events for this connection
                function respond(payload, msgId, event) {
                    if (event) stream.write(`event: ${event}\n`);
                    stream.write(`data: ${JSON.stringify(payload)}\n\n`);
                    // if (msgId) stream.write(`id: ${msgId++}\n`);
                    // stream.write(`\n\n`);
                }

                // ... function to close SSE connection (if it is opened)
                function close(payload) {
                    stream.end(payload);
                }

                // save connection data to SSE registry
                const item = metaDtoRegItem.createDto();
                item.respond = respond;
                item.close = close;
                item.messageId = 1;
                const connId = registry.add(item);

                // add handler to remove closed connection from registry
                stream.addListener('close', () => {
                    registry.remove(connId);
                });

                // TMP: add listeners to trace SSE connection events
                stream.addListener('aborted', () => console.log('SSE stream aborted.'));
                stream.addListener('data', () => console.log('SSE stream data.'));
                stream.addListener('drain', () => console.log('SSE stream drain.'));
                stream.addListener('end', () => console.log('SSE stream end.'));
                stream.addListener('error', () => console.log('SSE stream error.'));
                stream.addListener('finish', () => console.log('SSE stream finish.'));
                stream.addListener('frameError', () => console.log('SSE stream frameError.'));
                stream.addListener('pause', () => console.log('SSE stream pause.'));
                stream.addListener('pipe', () => console.log('SSE stream pipe.'));
                stream.addListener('readable', () => console.log('SSE stream readable.'));
                stream.addListener('ready', () => console.log('SSE stream ready.'));
                stream.addListener('resume', () => console.log('SSE stream resume.'));
                stream.addListener('timeout', () => console.log('SSE stream timeout.'));
                stream.addListener('trailers', () => console.log('SSE stream trailers.'));
                stream.addListener('unpipe', () => console.log('SSE stream unpipe.'));
                stream.addListener('wantTrailers', () => console.log('SSE stream wantTrailers.'));

                stream.respond({
                    [H2.HTTP2_HEADER_STATUS]: H2.HTTP_STATUS_OK,
                    [H2.HTTP2_HEADER_CONTENT_TYPE]: 'text/event-stream',
                    [H2.HTTP2_HEADER_CACHE_CONTROL]: 'no-cache',
                });

                // TODO: this is application specific logic
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

                context.markRequestComplete();
            }
        }
    }

    // MAIN FUNCTIONALITY
    Object.defineProperty(handle, 'name', {value: `${NS}.handle`});
    return handle;
}
