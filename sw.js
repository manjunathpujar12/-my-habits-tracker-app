// Astra Habits - Service Worker v1.0
const CACHE_NAME = 'astra-v1';

self.addEventListener('install', e => { self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(clients.claim()); });

self.addEventListener('push', e => {
  const data = e.data ? e.data.json() : {};
  e.waitUntil(self.registration.showNotification(data.title || '💧 Astra', {
    body: data.body || 'Time for your habit!',
    icon: data.icon || '/icon.png',
    vibrate: [200, 100, 200, 100, 200],
    tag: data.tag || 'astra',
    requireInteraction: false,
    actions: [{action:'open',title:'Open App'}]
  }));
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(clients.matchAll({type:'window'}).then(list => {
    for (const c of list) { if ('focus' in c) return c.focus(); }
    if (clients.openWindow) return clients.openWindow('/');
  }));
});

self.addEventListener('message', e => {
  if (!e.data || e.data.type !== 'SCHEDULE') return;
  const { delay, title, body, tag } = e.data;
  setTimeout(() => {
    self.registration.showNotification(title, {
      body, tag,
      icon: '/icon.png',
      vibrate: [300, 100, 300],
      requireInteraction: false
    });
  }, Math.max(0, delay));
});
