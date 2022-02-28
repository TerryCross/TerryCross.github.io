
const cacheName = "v2";           // use v1 for future compatibility.
const cacheAssets = [
    'index.html',
    'about.html',
    '/css/style.css',
    'js/main.js'
]
console.log("SW: Outer Space");
self.addEventListener("install", async e =>{
  console.log("SW: the 'install' Listener."); // need preserve log to se it
  self.skipWaiting();              // forces the waiting service worker to become the active service worker.  Can ignore returned promise (undef)
  // prevents other newly installed SW from being stuck in a wait.
  console.log("call e.waitUntil");
  e.waitUntil(                 // extendable event, holds sw in installing phase until tasks complete. // signature: extendableEvent.waitUntil(promise);
    saveToCache()
  );                                
  console.log("SW: skipped waiting.");
});

self.addEventListener("fetch", e => {  try {
  console.log("SW: fetch listener, event:", e.request);
  e.respondWith(getCacheOrPage(e));
   } catch(e) { console.log("Error:",e); }
});

async function saveToCache() { try {
  console.log("SW: to cache all assets.");
  var cache = await caches.open(cacheName);   // caches is a global r/o, of type CacheStorage.
  await cache.addAll(cacheAssets);            //   add is equiv to: fetch(url), put(url, response)
  console.log("SW: cached all.");
  }catch(e) {console.log("Error saveToCache",e);}
}

async function getCacheOrPage(e) {
  console.log("SW: e.respondWith.");
  let resp_cached = await caches.match(e.request);              // devtools, tic offline in sws area to test.

  if(resp_cached){
    console.log("SW: HIT cache, returning resp: ", resp_cached);
    return resp_cached;  /// return cached copy if there.
  }
  console.log("SW: MISS cache.  Make a n/w call. ", e.request);
  
  let resp = await fetch(e.request);       // make htttp request.
  let cache = await caches.open(cacheName);       
  cache.put(e.request, resp.clone());     // store with a cache.put
  return resp;
}

// self.addEventListener("activate", e =>{    // activate allows one to clean up any old cache, eg v1 when in v2
//   console.log("sw activated -- cleanup old caches." ); // ned preserve log to se it
//   e.waitUntil(
//     (async () => {
//       var cacheNames = await caches.keys();
//       var proms = cacheNames.map( cachen => {
//         if(cachen !== cacheName)
//           return caches.delete(cachen); // rets a promise resolves to bool.
//         else console.log("cache is the same", cachen );
//       });
//       console.log("prom.all:",
//         await Promise.all(proms)
//       );
//     }) ()
//   );     
// });


/* 
 * e.waitUntil(
 *   (async () => {
 *     const cache = await caches.open(cacheName);
 *     console.log('[Service Worker] Caching all: app shell and content');
 *     await cache.addAll(contentToCache);
 *   }) ()    // self invoking
 * ); */
