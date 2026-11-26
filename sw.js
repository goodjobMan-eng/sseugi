// 한 번 열면 이 기기에 통째로 저장해 두고, 그다음부터는 인터넷 없이 연다.
// 새 판을 올릴 때는 VERSION 숫자만 바꾸면 기기가 알아서 새 판으로 바꾼다.
const VERSION = 'sseugi-v0.2-96';
const AUDIO = 'sseugi-audio';
const FILES = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(VERSION).then(c => c.addAll(FILES))); self.skipWaiting(); });
self.addEventListener('activate', e => {
  // 녹음 파일 보관함(sseugi-audio)은 판이 바뀌어도 지우지 않는다
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION && k !== AUDIO).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  if (new URL(e.request.url).pathname.includes('/audio/')) {   // 녹음: 한 번 받으면 기기에 두고 쓴다
    e.respondWith(caches.open(AUDIO).then(c => c.match(e.request).then(hit => hit || fetch(e.request).then(r => { if (r.ok) c.put(e.request, r.clone()); return r; }))));
    return;
  }
  e.respondWith(caches.match(e.request, { ignoreSearch: true }).then(hit => hit || fetch(e.request)));
});
