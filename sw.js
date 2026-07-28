/* ============================================================
   sw.js — Service worker (network-first)
   ⚠️ Mỗi lần deploy có đổi file, PHẢI tăng CACHE lên số mới,
   nếu không máy cũ sẽ dùng lại bản cache cũ.
   ============================================================ */
const CACHE = 'thunhap-v42b';

const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './css/tokens.css',
  './css/base.css',
  './css/layout.css',
  './css/components.css',
  './css/desktop.css',
  './js/app.js',
  './js/config.js',
  './js/store.js',
  './js/compute.js',
  './js/classify.js',
  './js/format.js',
  './js/export.js',
  './js/ui/dash.js',
  './js/ui/list.js',
  './js/ui/chart.js',
  './js/ui/report.js',
  './js/ui/modal.js',
  './js/ui/toast.js',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

/* Network-first: luôn ưu tiên bản mới, mất mạng mới lấy cache */
self.addEventListener('fetch', e => {
  if(e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request)
      .then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy)).catch(() => {});
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
