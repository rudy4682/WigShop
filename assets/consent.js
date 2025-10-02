/*
  AUDIT HEADER:
  File: assets/consent.js
  Purpose: GDPR consent storage and gating; dispatches "consent:ready" when state is known
  Trigger: Loaded in layout/theme.liquid <head> (defer), used across entire storefront
  Dependencies: snippets/consent-banner.liquid (optional UI)
*/

(function () {
  var KEY = 'wigshop.consent';
  var banner = document.getElementById('ConsentBanner');
  var form = document.getElementById('ConsentForm');
  var rejectBtn = document.getElementById('ConsentReject');
  var previouslyFocused = null;

  function parse(json) {
    try {
      return JSON.parse(json);
    } catch (e) {
      return null;
    }
  }

  function apply(consent) {
    window.wigshopConsent = consent || { necessary: true, analytics: false, marketing: false };
    document.documentElement.setAttribute('data-consent', JSON.stringify(window.wigshopConsent));
    document.dispatchEvent(new CustomEvent('consent:ready', { detail: window.wigshopConsent }));
  }

  function openBanner() {
    if (!banner) return;
    previouslyFocused = document.activeElement;
    banner.hidden = false;
    banner.setAttribute('aria-hidden', 'false');
    // focus first focusable element in banner
    var focusable = banner.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (focusable) focusable.focus();
    trapFocus(true);
  }

  function closeBanner() {
    if (!banner) return;
    banner.hidden = true;
    banner.setAttribute('aria-hidden', 'true');
    trapFocus(false);
    if (previouslyFocused && previouslyFocused.focus) previouslyFocused.focus();
  }

  function trapFocus(enable) {
    if (!banner) return;
    if (!enable) {
      banner.removeEventListener('keydown', handleKeydown);
      return;
    }

    banner.addEventListener('keydown', handleKeydown);
  }

  function handleKeydown(e) {
    if (e.key === 'Escape' || e.key === 'Esc') {
      // close banner without changing consent
      closeBanner();
      return;
    }

    if (e.key !== 'Tab') return;
    var focusable = banner.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (!focusable.length) return;
    focusable = Array.prototype.slice.call(focusable);
    var first = focusable[0];
    var last = focusable[focusable.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  function persist(consent) {
    localStorage.setItem(KEY, JSON.stringify(consent));
    apply(consent);
    closeBanner();

    // Shopify Customer Privacy API integration (optional)
    if (
      window.Shopify &&
      window.Shopify.customerPrivacy &&
      typeof window.Shopify.customerPrivacy.setTrackingConsent === 'function'
    ) {
      window.Shopify.customerPrivacy.setTrackingConsent(consent, function () {
        // callback
      });
    }
  }

  var existing = parse(localStorage.getItem(KEY));
  apply(existing);
  if (!existing && banner && form) {
    openBanner();
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var consent = {
        necessary: true,
        analytics: !!form.elements['analytics'] && !!form.elements['analytics'].checked,
        marketing: !!form.elements['marketing'] && !!form.elements['marketing'].checked,
      };
      persist(consent);
    });
  }

  if (rejectBtn) {
    rejectBtn.addEventListener('click', function () {
      var consent = { necessary: true, analytics: false, marketing: false };
      persist(consent);
    });
  }

  // Close overlay when clicking outside the banner
  document.addEventListener('click', function (e) {
    if (!banner || banner.hidden) return;
    if (!banner.contains(e.target)) {
      // don't change consent, just close
      closeBanner();
    }
  });
})();
