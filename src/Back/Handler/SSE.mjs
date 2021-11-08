/**
 * Experimental SSE (Server Side Events) handler.
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
    /** @type {Fl32_Dup_Back_Model_Registry_Sse} */
    const regSse = spec['Fl32_Dup_Back_Model_Registry_Sse$'];

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
                ctx.setResponseHeader(H2.HTTP2_HEADER_CONTENT_TYPE, 'text/event-stream');
                ctx.setResponseHeader(H2.HTTP2_HEADER_CACHE_CONTROL, 'no-cache');
                ctx.markRequestProcessed();

                // setup stream
                /** @type {ServerHttp2Stream} */
                const stream = ctx.getStream();
                stream.addListener('aborted', () => console.log('SSE stream aborted.'));
                stream.addListener('close', () => console.log('SSE stream close.'));
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
                let id = 5;

                function respond(msg, event) {
                    if (event) stream.write(`event: ${event}\n`);
                    stream.write(`data: ${JSON.stringify(msg)}\n`);
                    stream.write(`id: ${id++}\n\n`);
                }

                respond({sessionId: 'some UID'}, 'authorize');

                // TODO: add stream closing function
                regSse.add(respond);
                // setTimeout(() => {
                //     stream.end('finish SSE');
                // }, 3000);

                context.markRequestComplete();
            }
        }
    }

    // MAIN FUNCTIONALITY
    Object.defineProperty(handle, 'name', {value: `${NS}.handle`});
    return handle;
}
