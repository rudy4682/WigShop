
      // Ensure Add-To-Cart buttons remain disabled until a variant is chosen.
      (function () {
        function isVariantSelectedInUrl() {
          // Liquid substitute: this JS flag will be "true" if server-side request.params.id existsreturn false;}

        function updateFormState(form, enable) {
          const submit = form.querySelector('[type="submit"], button[name="add"], button.add-to-cart, .product-form__submit');
          if (!submit) return;
          if (enable) {
            submit.removeAttribute('disabled');
            submit.classList.remove('disabled');
          } else {
            submit.setAttribute('disabled', 'disabled');
            submit.classList.add('disabled');
          }
        }

        function formHasSelection(form) {
          const select = form.querySelector('select[name="id"]');
          if (select) return select.value && select.value !== '';
          // radios or other inputs:
          const checked = form.querySelector('input[name="id"]:checked');
          return !!checked;
        }

        function initForms() {
          document.querySelectorAll('form[action*="/cart/add"]').forEach((form) => {
            // initial state: enable only if URL had variant id or form already contains a selection
            updateFormState(form, isVariantSelectedInUrl() || formHasSelection(form));

            // listen for native select/radio changes inside the form
            form.addEventListener('change', (e) => {
              if (e.target && e.target.name === 'id') {
                updateFormState(form, formHasSelection(form));
              }
            });
          });
        }

        // Listen for theme CustomEvent (variant selection published by the variant selector)
        document.addEventListener('optionValueSelectionChange', function (event) {
          const variantId = event?.detail?.variantId || event?.detail?.target?.value || null;
          // When a variant is selected, update all cart forms on the page (most stores only have one)
          document.querySelectorAll('form[action*="/cart/add"]').forEach((form) => {
            const select = form.querySelector('select[name="id"]');
            if (select && variantId) {
              // set select value (keeps form in sync with custom variant pickers)
              try {
                select.value = variantId;
                // trigger change for any listeners
                select.dispatchEvent(new Event('change', { bubbles: true }));
              } catch (e) {
                /* ignore if select is not writable */
              }
            }
            // enable the add-to-cart when a variantId is present
            updateFormState(form, !!variantId);
          });
        });

        document.addEventListener('DOMContentLoaded', initForms);
      })();
    