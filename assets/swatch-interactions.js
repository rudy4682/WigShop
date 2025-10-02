(function () {
  // Simple mobile-friendly swatch tooltip toggle
  // - On touch devices, tapping a swatch toggles a 'tooltip-active' class.
  // - A second tap will select the swatch's radio input if present.
  // - Tapping outside clears active tooltips.

  function isTouch() {
    return 'ontouchstart' in window || (navigator.maxTouchPoints && navigator.maxTouchPoints > 0);
  }

  function init() {
    if (!isTouch()) return; // desktop uses hover/focus

    document.addEventListener('click', function (e) {
      var swatch = e.target.closest('.swatch');
      // clear existing active tooltips unless tapping the same swatch
      var active = document.querySelector('.swatch.tooltip-active');
      if (active && active !== swatch) {
        active.classList.remove('tooltip-active');
      }

      if (!swatch) return;
      // toggle active state
      var isActive = swatch.classList.toggle('tooltip-active');
      if (!isActive) return;

      // if the swatch contains an input and was already active previously, select it
      var input = swatch.querySelector('input[type="radio"], input[type="checkbox"]');
      if (input && input.checked === false) {
        // delay to allow any UI transition; user can tap again to confirm selection
        setTimeout(function () {
          input.focus();
        }, 10);
      }
    });

    // Tapping outside any swatch clears active state
    document.addEventListener(
      'touchstart',
      function (e) {
        if (!e.target.closest('.swatch')) {
          var active = document.querySelectorAll('.swatch.tooltip-active');
          active.forEach(function (s) {
            s.classList.remove('tooltip-active');
          });
        }
      },
      { passive: true }
    );
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
