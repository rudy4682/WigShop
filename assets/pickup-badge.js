/* pickup-badge.js
   - Waits for consent:ready before requesting geolocation
   - Reads data attributes from `.js-pickup-badge` elements
   - Computes distance to store coords and updates badge text
   - Gracefully degrades if geolocation permission is denied or data missing
*/
(function () {
  'use strict';

  function haversineKm(lat1, lon1, lat2, lon2) {
    function toRad(x) {
      return (x * Math.PI) / 180;
    }
    var R = 6371; // km
    var dLat = toRad(lat2 - lat1);
    var dLon = toRad(lon2 - lon1);
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  function parseCoords(str) {
    if (!str) return null;
    var parts = String(str)
      .split(',')
      .map(function (s) {
        return parseFloat(s.trim());
      });
    if (parts.length !== 2 || isNaN(parts[0]) || isNaN(parts[1])) return null;
    return { lat: parts[0], lon: parts[1] };
  }

  function updateBadgeText(el, text) {
    el.innerHTML = '<span class="badge badge--pickup">' + (text || '') + '</span>';
  }

  function handleElements(elements) {
    if (!elements || elements.length === 0) return;
    var storeCoordsRaw = elements[0].getAttribute('data-store-coords') || '';
    var storeCoords = parseCoords(storeCoordsRaw);

    var shipDaysRaw = elements[0].getAttribute('data-ship-days') || '';
    var shipDays = shipDaysRaw === '' ? null : parseInt(shipDaysRaw, 10);

    // If no store coords provided, render fallback using shipDays only
    if (!storeCoords) {
      elements.forEach(function (el) {
        if (shipDays === 0) updateBadgeText(el, 'Pickup Today');
        else if (shipDays) updateBadgeText(el, 'Ships in ' + shipDays + ' days');
      });
      return;
    }

    // Request geolocation, but only when permitted by the browser
    if (!navigator.geolocation) {
      elements.forEach(function (el) {
        if (shipDays === 0) updateBadgeText(el, 'Pickup Today');
        else if (shipDays) updateBadgeText(el, 'Ships in ' + shipDays + ' days');
      });
      return;
    }

    var options = { enableHighAccuracy: false, maximumAge: 300000, timeout: 10000 };
    navigator.geolocation.getCurrentPosition(
      function (pos) {
        var userLat = pos.coords.latitude;
        var userLon = pos.coords.longitude;
        var distKm = haversineKm(userLat, userLon, storeCoords.lat, storeCoords.lon);
        // 100 miles ~ 160.934 km
        var withinKm = 160.934;
        elements.forEach(function (el) {
          if (distKm <= withinKm) {
            if (shipDays === 0 || shipDays === null) {
              updateBadgeText(el, 'Pickup Today');
            } else if (shipDays <= 1) {
              updateBadgeText(el, 'Ready in 1 Hour');
            } else {
              updateBadgeText(el, 'Pickup: ' + shipDays + ' days');
            }
          } else {
            // Not within pickup radius — still display ship days if provided
            if (shipDays === 0) updateBadgeText(el, 'Ships Today');
            else if (shipDays) updateBadgeText(el, 'Ships in ' + shipDays + ' days');
          }
        });
      },
      function (err) {
        // User denied or error; fallback to shipDays text
        elements.forEach(function (el) {
          if (shipDays === 0) updateBadgeText(el, 'Ships Today');
          else if (shipDays) updateBadgeText(el, 'Ships in ' + shipDays + ' days');
        });
      },
      options
    );
  }

  function init() {
    var els = Array.prototype.slice.call(document.querySelectorAll('.js-pickup-badge'));
    if (els.length === 0) return;

    // Respect consent if present — wait for consent:ready, otherwise run immediately
    var run = function () {
      handleElements(els);
    };
    if (window && window.wigshopConsent !== undefined) {
      // If consent already present, run now
      run();
    } else {
      document.addEventListener(
        'consent:ready',
        function () {
          run();
        },
        { once: true }
      );
      // fallback: run after short delay
      setTimeout(run, 2000);
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
