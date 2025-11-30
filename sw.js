// sw.js の基本的な内容
const CACHE_NAME = 'my-pwa-cache-v1';
const urlsToCache = [
  './', // index.html
  './index.html',
  './manifest.json',
  // 必要に応じて他のCSSやJSファイルも追加
];

// Service Worker のインストール
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// リソースの取得 (Fetch)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // キャッシュにあればそれを返す
        if (response) {
          return response;
        }
        // なければネットワークから取得
        return fetch(event.request);
      })
  );
});
