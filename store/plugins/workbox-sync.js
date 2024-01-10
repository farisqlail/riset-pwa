// import { registerRoute } from 'workbox-routing';
// import { NetworkFirst, StaleWhileRevalidate } from 'workbox-strategies';
// import { Queue } from 'workbox-background-sync';

// const queue = new Queue('apiQueue');

// self.addEventListener('fetch', (event) => {
//   const { request } = event;

//   if (request.url.includes('/api/')) {
//     const strategy = new NetworkFirst({
//       cacheName: 'apiCache',
//     });

//     const handler = strategy.makeRequest({ request })
//       .catch(() => queue.addRequest({ request }));

//     event.respondWith(handler);
//   }
// });

// registerRoute(
//   ({ url }) => url.pathname.includes('/api/'),
//   new StaleWhileRevalidate({
//     cacheName: 'apiCache',
//   })
// );
