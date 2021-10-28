'use strict';
const CACHE_STATIC = 'static-cache-v1';

/**
 * Send message to `index.html` to start bootstrap.
 */
function hndlEventActivate() {
    self.clients.claim();
}

/**
 * Cache minimal set of files to be loadable offline.
 * @param evt
 */
function hndlEventInstall(evt) {

    async function cacheStaticFiles() {
        const files = [
            './',
            './favicon.ico',
            './img/favicon-192.png',
            './img/favicon-512.png',
            './index.html',
            './pwa.webmanifest',
            './styles.css',
            './styles_boot.css',
            './sw.js',
        ];
        const cacheStat = await caches.open(CACHE_STATIC);
        await Promise.all(
            files.map(function (url) {
                return cacheStat.add(url).catch(function (reason) {
                    console.log(`'${url}' failed: ${String(reason)}`);
                });
            })
        );
    }

    //  wait until all static files will be cached
    evt.waitUntil(cacheStaticFiles());
}

/**
 * Return requested resource from cache or load from server and save to cache.
 * @param evt
 */
function hndlEventFetch(evt) {
    // DEFINE INNER FUNCTIONS

    async function getFromCache() {
        const cache = await self.caches.open(CACHE_STATIC);
        const cachedResponse = await cache.match(evt.request);
        if (cachedResponse) return cachedResponse;
        // if not found then wait until resource will be fetched from server and stored in cache
        const res = await fetch(evt.request);
        if (evt.request.method === 'GET') await cache.put(evt.request, res.clone());
        return res;
    }

    async function clearCache() {
        await self.caches.delete(CACHE_STATIC);
        return new Response(JSON.stringify({result: true}), {
            headers: {'Content-Type': 'application/json'}
        });
    }

    // MAIN FUNCTIONALITY
    const url = evt.request.url;
    if (url.includes('/sw/cache/clean')) {
        evt.respondWith(clearCache());
    } else {
        evt.respondWith(getFromCache());
    }
}

self.addEventListener('activate', hndlEventActivate);
self.addEventListener('install', hndlEventInstall);
self.addEventListener('fetch', hndlEventFetch);
