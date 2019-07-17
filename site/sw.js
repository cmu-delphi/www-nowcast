/*!
* ILY Nearby | Influenza-like Illness Nearby
* @authors:
    David Farrow, PhD | Computational Biology Department | Carnegie Mellon University
    Roberto Iriondo | Machine Learning Department, Carnegie Mellon University
    Bryan Learn | Pittsburgh Supercomputing Center | Computer Science Department, Carnegie Mellon University
    Delphi Research Group | Carnegie Mellon University
* @author-url: https://delphi.midas.cs.cmu.edu/
* @copyright: Delphi Research Group | Carnegie Mellon University | All Rights Reserved
* @description: Service worker service ILI Nearby.
*/

//Initialize Service Worker Properly
"use strict";
var workbox = 0;
"function" == typeof importScripts &&
  importScripts (
    "https://storage.googleapis.com/workbox-cdn/releases/3.0.0/workbox-sw.js"
  );

console.log('Was Workbox able to load?');
  if (workbox) {
    console.log('Workbox loaded correctly.');
  } else {
    console.log('Workbox did not load correctly, please check your service worker for errors.');
  }

workbox.googleAnalytics.initialize();

workbox.routing.registerRoute(
  // Cache CSS files
  /.*\.css/,
  // Use cache but update in the background ASAP
  workbox.strategies.staleWhileRevalidate({
    cacheName: 'css-cache',
  })
);

workbox.routing.registerRoute(
  // Cache JS files
  /.*\.js/,
  // Use cache but update in the background ASAP
  workbox.strategies.staleWhileRevalidate({
    cacheName: 'js-cache',
  })
);


workbox.routing.registerRoute(
  // Cache Image files
  /.*\.(?:png|jpg|jpeg|svg|gif)/,
  // Use the cache if it's available
  workbox.strategies.cacheFirst({
    cacheName: 'image-cache',
    plugins: [
      new workbox.expiration.Plugin({
        // Cache up to 300 images | Leaflet is heavy on .png files
        maxEntries: 300,
        // Cache for a maximum of 28 days
        maxAgeSeconds: 28 * 24 * 60 * 60,
      })
    ],
  })
);

workbox.routing.registerRoute(
  /.*(?:mldcmu)\.ai.*$/,
  workbox.strategies.staleWhileRevalidate({
  cacheName: 'internal-cache',
  })
);

workbox.routing.registerRoute(
  /.*(?:googleapis|cloudflare|unpkg|gstatic)\.com.*$/,
  workbox.strategies.staleWhileRevalidate({
  cacheName: 'external-cache',
  })
);

workbox.routing.registerRoute(
  /.*(?:delphi.midas.cs.cmu)\.edu.*$/,
  workbox.strategies.staleWhileRevalidate({
  cacheName: 'API-cache',
  })
);

workbox.routing.registerRoute(
  /.*(?:tile.osm|tile.thunderforest)\.org.*$/,
  workbox.strategies.staleWhileRevalidate({
  cacheName: 'tiles-cache',
  })
);
