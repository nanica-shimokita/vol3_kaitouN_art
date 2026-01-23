const CACHE_NAME = 'my-pwa-cache-v2'; // バージョンを上げて古いキャッシュを無効化
const urlsToCache = [
  './',
  'index.html',
  'manifest.json',
  'icon.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Caching resources');
        // 1つでも失敗すると全体が失敗するため、個別にaddする方法に変更
        return Promise.all(
          urlsToCache.map(url => {
            return cache.add(url).catch(err => console.error('Failed to cache:', url, err));
          })
        );
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // キャッシュがあれば返す、なければネットワークから取得
        return response || fetch(event.request);
      }).catch(() => {
        // ネットワークエラー時のフォールバック（任意）
      })
  );
});

// 古いキャッシュを削除する処理を追加
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
});
