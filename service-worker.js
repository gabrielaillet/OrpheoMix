// TO DO
// -- look into handling the content of the cache
// -- maybe change how the size is calculated
// -- change fetch function (so that the right files go into CACHE_MUSICS)



// 2 caches:
// CACHE_GENERAL: 
//      -- static files and metadata
//      -- updated when the music database is changed
// CACHE_MUSICS: 
//      -- musics the user listened to
//      -- never fully updated
//      -- has a storage limit
//      -- when the user listens to a music it is added to the cache
//      -- if the cache is full, musics the user listened to the 
//         longest time ago are deleted from the cache until there 
//         is enough space


// caches names
// --> needs to be changed manually at each update of the database
const CACHE_GENERAL = 'orpheomix-general-v1';
// --> never changed
const CACHE_MUSICS = 'orpheomix-musics';

// limit for the music cache
const CACHE_MUSICS_LIMIT = 1024 * 1024 * 1024; // 1 Go
// initial size
let cacheMusicsTotalSize = 0;


// Function to initialize music cache size
async function initializeCacheSize() {
    const cache = await caches.open(CACHE_MUSICS);
    const requests = await cache.keys();

    cacheMusicsTotalSize = 0; // Reset the size
    for (const request of requests) {
        const response = await cache.match(request);
        ///// CALCULATE THE SIZE, MAY NEED TO BE CHANGED
        const size = parseInt(response.headers.get('content-length')) || 0;
        cacheMusicsTotalSize += size;
    }
    console.log('Initialized CACHE_MUSICS size:', cacheMusicsTotalSize);
}

// For now, delete the oldest music, not the one accessed the longest time ago
async function enforceCacheMusicsSizeLimit() {
    const cache = await caches.open(CACHE_MUSICS);
    const requests = await cache.keys();

    while (cacheMusicsTotalSize > CACHE_MUSICS_LIMIT && requests.length > 0) {
        const oldestRequest = requests.shift();
        const response = await cache.match(oldestRequest);

        const size = parseInt(response.headers.get('content-length')) || 0;
        await cache.delete(oldestRequest);

        cacheMusicsTotalSize -= size;
        console.log('Removed from CACHE_MUSICS:', oldestRequest.url, 'Size:', size);
        console.log('Updated CACHE_MUSICS size:', cacheMusicsTotalSize);
    }
}


// static files to be registered
// --> when adding a static file to be registered, add it here
const STATIC_FILES = [
    '/',
    '/index.html',
    '/index.css',
    '/index.js',
    
    '/firstPage/firstPage.html',
    '/firstPage/firstPage.css',

    '/nextPage/nextPage.html',
    '/nextPage/nextPage.css',
];


// event listener for the 'install' event of the Service Worker
// triggered when the Service Worker is installed for the first time
self.addEventListener('install', (event) => {
    console.log('Service Worker: Installation...');
    event.waitUntil(
        caches.open(CACHE_GENERAL).then((cache) => {
            console.log('Caching static files...');
            return cache.addAll(STATIC_FILES);
        })
    );
});

// event listener for the 'activate' event of the Sevice Worker
// triggered when the Service Worker is changed (file changed)
self.addEventListener('activate', (event) => {
    console.log('Service Worker: Activation...');
    const validCacheNames = [CACHE_GENERAL, CACHE_MUSICS];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (!validCacheNames.includes(cacheName)) {
                        console.log(`Deleting old cache: ${cacheName}`);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => initializeCacheSize())
    );
});

// event listener for the 'fetch' event of the Service Worker
// triggered when fetching data
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then(async (cachedResponse) => {
            if (cachedResponse) {
                return cachedResponse;
            }

            const networkResponse = await fetch(event.request);
            if (event.request.url.includes('getmusic')) {
                caches.open(CACHE_MUSICS).then(async (cache) => {
                    // file size is retrieved from the HTTP Content-Length header of the network response
                    // parseInt() method converts the size into an integer
                    // if the Content-Length header is missing or undefined, the default size is set to 0
                    const size = parseInt(networkResponse.headers.get('content-length')) || 0;
                    await cache.put(event.request, networkResponse.clone());
                    cacheMusicsTotalSize += size;
                    console.log('Added to CACHE_MUSICS:', event.request.url, 'Size:', size);
                    console.log('Updated CACHE_MUSICS size:', cacheMusicsTotalSize);

                    enforceCacheMusicsSizeLimit(CACHE_MUSICS);
                });
            } else {
                caches.open(CACHE_GENERAL).then((cache) => {
                    cache.put(event.request, networkResponse.clone());
                });
            }

            return networkResponse;
        })
    );
});

